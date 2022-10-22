import { CHANNELS_API_URL, PLAYLISTS_ITEMS_API_URL } from "../constants/youtube-api";
import db from "../firebase/admin";
import { UpdatedVideoPropsItem, YoutubeChannelResponse, YoutubeVideosResponse } from "../types";

interface YoutubeResponseMap {
    [id: string]: UpdatedVideoPropsItem | null;
}

export async function getReorderedYoutubeVideos(playlistId: string, pageToken = '', pageNumber = 0) {

    const videoData: YoutubeVideosResponse = await (await fetch(`${PLAYLISTS_ITEMS_API_URL}&playlistId=${playlistId}&pageToken=${pageToken}`)).json();

    const videos = await db.collection('youtube').get();

    const collection: YoutubeResponseMap = {};
    videos.forEach((vid) => {
        if (vid.exists) {
            const vidData = vid.data() as UpdatedVideoPropsItem;
            collection[vid.id] = vidData;
        }
    });

    const reorderedVideos = [];

    for (let i = 0; i < videoData.items.length; i++) {

        const vid = videoData.items[i];
        if (collection[vid.id]) {
            if (collection[vid.id]!.pageNumber === pageNumber) {
                if ('newPosition' in collection[vid.id]!) {
                    vid.snippet.position = collection[vid.id]!.newPosition as number;
                }
                if ('hide' in collection[vid.id]!) {
                    vid.snippet.hide = collection[vid.id]!.hide;
                }
                collection[vid.id] = null;
                reorderedVideos.push(vid);
            }
        } else {
            reorderedVideos.push(vid);
        }
    }

    const videoIds = [];
    for (let [key, value] of Object.entries(collection)) {
        if (value && value.pageNumber === pageNumber) {
            videoIds.push(key);
        }
    }
    if (videoIds.length > 0) {
        const extraVideos = await (await fetch(`${PLAYLISTS_ITEMS_API_URL}&id=${videoIds.join(',')}`)).json();
        for (let i = 0; i < extraVideos.items.length; i++) {
            if (collection[extraVideos.items[i].id]) {
                extraVideos.items[i].snippet.position = collection[extraVideos.items[i].id]?.newPosition || null;
                if (collection[extraVideos.items[i].id]!.hide) {
                    extraVideos.items[i].snippet.hide = collection[extraVideos.items[i].id]?.hide || false;
                }
            }
        }
        reorderedVideos.push(...extraVideos.items);
    }

    reorderedVideos.sort((a, b) => a.snippet.position - b.snippet.position);


    videoData.items = reorderedVideos;

    return {
        videos: videoData,
    }
}

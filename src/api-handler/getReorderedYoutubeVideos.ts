import { DocumentData } from "firebase-admin/firestore";
import { CHANNELS_API_URL, PLAYLISTS_ITEMS_API_URL } from "../constants/youtube-api";
import db from "../firebase/admin";
import { UpdatedVideoPropsItem, YoutubeChannelResponse, YoutubeVideosResponse } from "../types";

interface YoutubeResponseMap {
    [id: string]: UpdatedVideoPropsItem | null;
}

export async function getReorderedYoutubeVideos(playlistId: string, pageToken = '', pageNumber = 0) {

    const videoData: YoutubeVideosResponse = await (await fetch(`${PLAYLISTS_ITEMS_API_URL}&playlistId=${playlistId}&pageToken=${pageToken}`)).json();

    const videos = await db.collection('youtube').where('pageNumber', '==', pageNumber).get();

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
        if (collection[vid.id] && (collection[vid.id]!.pageNumber === pageNumber)) {
            vid.snippet.position = collection[vid.id]!.newPosition;
            collection[vid.id] = null;
            reorderedVideos.push(vid);
        }

    }

    const videoIds = [];
    for (let [key, value] of Object.entries(collection)) {
        if (value) {
            videoIds.push(key);
        }
    }
    if (videoIds.length > 0) {
        const extraVideos = await (await fetch(`${PLAYLISTS_ITEMS_API_URL}&id=${videoIds.join(',')}`)).json();
        for (let i = 0; i < extraVideos.items.length; i++) {
            if (collection[extraVideos.items[i].id]) {
                extraVideos.items[i].snippet.position = collection[extraVideos.items[i].id]!.newPosition;
            }
        }
        reorderedVideos.push(...extraVideos.items);
    }

    reorderedVideos.sort((a, b) => a.snippet.position - b.snippet.position);


    videoData.items = reorderedVideos;
    console.log('rr', reorderedVideos.length, videoIds.length)

    return {
        videos: videoData,
    }
}

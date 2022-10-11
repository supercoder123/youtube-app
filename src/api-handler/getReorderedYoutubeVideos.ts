import { CHANNELS_API_URL, PLAYLISTS_ITEMS_API_URL } from "../constants/youtube-api";
import db from "../firebase/admin";
import { YoutubeChannelResponse, YoutubeVideosResponse } from "../types";


export async function getReorderedYoutubeVideos(playlistId: string, pageToken = '', pageNumber = 0) {
    const videoData: YoutubeVideosResponse = await (await fetch(`${PLAYLISTS_ITEMS_API_URL}&playlistId=${playlistId}&pageToken=${pageToken}`)).json();
    const snapshot = await db.collection('youtube').get(); //.where('pageNumber', '==', parseInt(pageNumber))
    const collection: any = {};
    snapshot.forEach(doc => {
        collection[doc.id] = doc.data();
    });

    const currentPageDocs = Object.values(collection).reduce((acc, doc) => {
        if(doc.pageNumber === pageNumber) {
            acc[doc.id] = doc;
        }
        return acc;
    }, {});

    const reorderedVideos = [];

    // const videoIds = [];

    // for (let i = 0; i < videoData.items.length; i++) {
    //     try {
    //         const data = collection[videoData.items[i].id];
    //         if (data) {
    //             // videoIds.push(videoData.items[i].snippet.resourceId.videoId)
    //             videoData.items[i].snippet.position = data.newPosition;
    //         }
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    for (let i = 0; i < videoData.items.length; i++) {
        try {
            const vid = videoData.items[i];
            const videoExistsInCurrentPage = currentPageDocs[vid.id];
            const videoExistsInReorderedData = collection[vid.id];
            if (videoExistsInCurrentPage) {
                console.log(vid.snippet.title)
                vid.snippet.position = videoExistsInCurrentPage.newPosition;
                currentPageDocs[vid.id] = null;
                reorderedVideos.push(vid);
            } else if (videoExistsInReorderedData) {
                continue;
            } else {
                reorderedVideos.push(vid);
            }
        } catch (e) {
            console.log(e)
        }
    }
    // console.log('rr',reorderedVideos.length,currentPageDocs)

    const videoIds = []
    for (let [key, value] of Object.entries(currentPageDocs)) {
        if (value) {
            videoIds.push(key);
        }
    }
    if (videoIds.length > 0) {
        const extraVideos = await (await fetch(`${PLAYLISTS_ITEMS_API_URL}&id=${videoIds.join(',')}`)).json();
        for (let i = 0; i < extraVideos.items.length; i++) {
            extraVideos.items[i].snippet.position =  currentPageDocs[extraVideos.items[i].id].newPosition;
        }
        reorderedVideos.push(...extraVideos.items);
    }

    reorderedVideos.sort((a, b) => a.snippet.position - b.snippet.position);

    
    videoData.items = reorderedVideos;
    // console.log('rr',reorderedVideos.length, videoIds.length)

    return {
        videos: videoData,
        // videoIds
    }
}

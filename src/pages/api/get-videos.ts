// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../redis/redis-client';
import { VideoResponse, YoutubeChannelResponse, YoutubeVideosResponse } from '../../types';

client.on('error', function (error) {
  console.dir(error)
});

const API_KEY = 'AIzaSyC4eoBC80aEtdnjIgbL4A9vyJqln1w22us';
const channelListUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=UCDt-2KorfMpzLf-CX71n18A&key=${API_KEY}`;



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VideoResponse>
) {
  const channelData: YoutubeChannelResponse = await (await fetch(channelListUrl)).json();
  const playListId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
  const videoData: YoutubeVideosResponse = await (await fetch(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=${playListId}&key=${API_KEY}`)).json();

  for (let i=0; i<videoData.items.length; i++) {
    const reorderedVideo = await client.get(videoData.items[i].id);
    if (reorderedVideo) {
      // console.log(reorderedVideo)
      const cacheData = JSON.parse(reorderedVideo);
      videoData.items[i].snippet.position = cacheData.position;
    }
  }

  videoData.items.sort((a, b) => a.snippet.position - b.snippet.position);

  res.status(200).json({ channelData, videoData });
}


// vid: 3d42, pos: 1 
// vid: 34s2, pos: 2 
// vid: 4af2, pos: 3 
// vid: 34a2, pos: 4 
// vid: 34d2, pos: 5
// vid: 3v42, pos: 6
// vid: v342, pos: 7
// vid: 3342, pos: 8


// vid: 34a2, pos: 1 
// vid: 3d42, pos: 2 
// vid: 34s2, pos: 3
// vid: 4af2, pos: 4

// vid: ba42, pos: 1 
// vid: mf42, pos: 2
// vid: 3d42, pos: 3 4
// vid: 34s2, pos: 4 5
// vid: 4af2, pos: 5 6
// vid: 34a2, pos: 6 3
// vid: 34d2, pos: 7
// vid: 3v42, pos: 8
// vid: v342, pos: 9
// vid: 3342, pos: 10



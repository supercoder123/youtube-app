import { NextApiRequest, NextApiResponse } from "next";
import { getReorderedYoutubeVideos } from "../../api-handler/getReorderedYoutubeVideos";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === "GET") {
        // console.log('get', req.query)
        const nextPageToken = req.query.pageToken as string;
        const playlistId = req.query.playlistId as string;
        const pageNumber = req.query.pageNumber as string;

        if (!playlistId) {
            res.status(400).json("No playListID provided");    
        }
        const videoData = await getReorderedYoutubeVideos(playlistId, nextPageToken, parseInt(pageNumber));
        res.status(200).json(videoData);    
    }
  }
  
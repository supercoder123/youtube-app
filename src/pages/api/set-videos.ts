import { read } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../redis/redis-client";
import { VideoCache } from "../../types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === "POST") {
        const reorderedVideos: VideoCache[] = JSON.parse(req.body);
        reorderedVideos.forEach((video) => {
            client.set(video.id, JSON.stringify({ position: video.newPosition}))
        });
        res.status(200).json(reorderedVideos);
    }
  }
  
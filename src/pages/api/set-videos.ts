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
        reorderedVideos.forEach(async (video) => {
            await client.set(video.id, JSON.stringify({ position: video.newPosition}))
        });
        await fetch('https://api.vercel.com/v1/integrations/deploy/prj_FEhOJurqCDz3pjlSpULMDbCKCU7e/l7P7KZBLKk');
        res.status(200).json(reorderedVideos);
    }
  }
  
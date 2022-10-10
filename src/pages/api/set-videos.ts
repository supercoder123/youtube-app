import { read } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../redis/redis-client";
import { UpdatedVideoPropsItem } from "../../types";
import { getFirestore } from 'firebase-admin/firestore';
import db from "../../firebase/admin";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === "POST") {
        const reorderedVideos: UpdatedVideoPropsItem[] = JSON.parse(req.body);
        const batch = db.batch()
        reorderedVideos.forEach((video) => {
          const docRef = db.collection('youtube').doc(video.id);
          batch.set(docRef, video);
        });
        batch.commit();
        // reorderedVideos.forEach(async (video) => {
        //   try {
        //     await db.collection('youtube').doc(video.id).set(video);
        //   } catch(e) {
        //     console.error(e)
        //   }
        // });
        // await fetch('https://api.vercel.com/v1/integrations/deploy/prj_FEhOJurqCDz3pjlSpULMDbCKCU7e/l7P7KZBLKk');
        res.status(200).json(reorderedVideos);
    }
  }
  
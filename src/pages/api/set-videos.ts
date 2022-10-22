import { NextApiRequest, NextApiResponse } from "next";
import { UpdatedVideoPropsItem } from "../../types";
import db from "../../firebase/admin";
import { EditedCardsDescription } from "..";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === "POST") {
        const editedVideos: EditedCardsDescription = JSON.parse(req.body);
        const batch = db.batch()
        if (Object.keys(editedVideos).length > 0) {
          for(let [key, value] of Object.entries(editedVideos)) {
            const docRef = db.collection('youtube').doc(value.id);
            batch.set(docRef, value , { merge: true });
          }
        }
        await batch.commit();
        // await fetch('https://api.vercel.com/v1/integrations/deploy/prj_FEhOJurqCDz3pjlSpULMDbCKCU7e/l7P7KZBLKk');
        res.status(200).json(editedVideos);
    }
  }
  
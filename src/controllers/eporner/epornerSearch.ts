import axios from "axios";
import https from "https";
import { Request, Response } from "express";

export const epornerSearch = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    const page = (req.query.page as string) || "1";

    if (!query) {
      return res.json({ success: true, data: [] });
    }

    const agent = new https.Agent({ family: 4 });

    const response = await axios.get(
      "https://www.eporner.com/api/v2/video/search/",
      {
        params: {
          query,
          per_page: 10,
          page,
          thumbsize: "big",
          format: "json"
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Referer": "https://www.eporner.com/",
          "Accept": "application/json"
        },
        httpsAgent: agent,
        timeout: 20000
      }
    );

    const videos = response.data.videos || [];

    return res.json({
      success: true,
      data: videos
    });

  } catch (err: any) {
    console.log("❌ SEARCH ERROR:", err.message);

    return res.json({
      success: true,
      data: []
    });
  }
};

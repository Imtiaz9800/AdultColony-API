import { Request, Response } from "express";
import axios from "axios";

const BASE = "https://yappiest-jennie-fakemailcloud2-7dba030f.koyeb.app";

export const globalSearch = async (req: Request, res: Response) => {
  const query = req.query.query as string;

  try {
    const sources = [
      "/pornhub/search",
      "/xvideos/search",
      "/xnxx/search",
      "/spankbang/search"
    ];

    const results = await Promise.allSettled(
      sources.map(src =>
        axios.get(`${BASE}${src}?query=${encodeURIComponent(query)}`)
      )
    );

    const merged: any[] = [];

    results.forEach((r, i) => {
      if (r.status === "fulfilled") {
        const data = r.value.data.data || [];

        data.slice(0, 3).forEach((item: any) => {
          merged.push({
            ...item,
            source: sources[i].split("/")[1]
          });
        });
      }
    });

    return res.json({
      success: true,
      total: merged.length,
      data: merged
    });

  } catch (err) {
    return res.json({ success: true, data: [] });
  }
};

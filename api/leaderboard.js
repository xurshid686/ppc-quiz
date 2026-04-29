import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Get top 20 entries by score descending
  const raw = await redis.zrange("quiz:scores", "+inf", "-inf", {
    byScore: true,
    rev: true,
    offset: 0,
    count: 20,
  });

  const scores = (raw || []).map((item) => {
    try {
      const parsed = typeof item === "string" ? JSON.parse(item) : item;
      return { name: parsed.name, score: parsed.score, date: parsed.date };
    } catch {
      return { name: "Unknown", score: 0, date: "" };
    }
  });

  return res.status(200).json({ scores });
}

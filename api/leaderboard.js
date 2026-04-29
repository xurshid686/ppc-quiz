import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Get all entries (up to 200)
  const raw = await redis.lrange("quiz:results", 0, 199);

  const all = (raw || []).map((item) => {
    try {
      return typeof item === "string" ? JSON.parse(item) : item;
    } catch {
      return null;
    }
  }).filter(Boolean);

  // Sort by score descending, then show top 20
  all.sort((a, b) => b.score - a.score);
  const top20 = all.slice(0, 20);

  return res.status(200).json({ scores: top20 });
}

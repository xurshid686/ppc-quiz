import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const raw = await redis.zrange("quiz:scores", 0, 19, { rev: true });
  const scores = raw.map((item) => {
    try {
      return typeof item === "string" ? JSON.parse(item) : item;
    } catch {
      return { name: "Unknown", score: 0, date: "" };
    }
  });

  return res.status(200).json({ scores });
}

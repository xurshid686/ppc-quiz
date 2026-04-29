import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const results = {};

  // 1. Check env vars exist
  results.env = {
    hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    hasTelegramToken: !!process.env.TELEGRAM_BOT_TOKEN,
    hasChatId: !!process.env.TELEGRAM_CHAT_ID,
  };

  // 2. Try a simple Redis ping
  try {
    const ping = await redis.ping();
    results.ping = ping;
  } catch (e) {
    results.ping = "ERROR: " + e.message;
  }

  // 3. Check how many items in the list
  try {
    const len = await redis.llen("quiz:results");
    results.listLength = len;
  } catch (e) {
    results.listLength = "ERROR: " + e.message;
  }

  // 4. Fetch raw list items
  try {
    const raw = await redis.lrange("quiz:results", 0, 9);
    results.rawItems = raw;
  } catch (e) {
    results.rawItems = "ERROR: " + e.message;
  }

  // 5. Write a test entry directly
  try {
    await redis.lpush("quiz:results", JSON.stringify({ name: "DEBUG_TEST", score: 99, date: new Date().toISOString() }));
    results.testWrite = "OK";
  } catch (e) {
    results.testWrite = "ERROR: " + e.message;
  }

  return res.status(200).json(results);
}

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function sendTelegram(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, score, total } = req.body;
  if (!name || score === undefined) return res.status(400).json({ error: "Missing fields" });

  const now = new Date();
  const date = now.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  // Store as a simple JSON string in a Redis list
  const entry = JSON.stringify({ name, score, date });
  await redis.lpush("quiz:results", entry);
  // Keep only latest 200 entries
  await redis.ltrim("quiz:results", 0, 199);

  const emoji = score >= 18 ? "🏆" : score >= 14 ? "✅" : score >= 10 ? "⚠️" : "❌";
  const msg =
    `${emoji} <b>New Test Result</b>\n` +
    `👤 Student: <b>${name}</b>\n` +
    `📊 Score: <b>${score}/${total}</b>\n` +
    `🕐 Time: ${date}`;
  await sendTelegram(msg);

  return res.status(200).json({ ok: true });
}

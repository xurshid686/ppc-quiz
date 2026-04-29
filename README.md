# 📝 Present Perfect Continuous Quiz App

A full-stack quiz app with global leaderboard (Upstash Redis) and Telegram result notifications.

## 📁 File Structure
```
├── index.html          ← Frontend (quiz, name entry, leaderboard)
├── api/
│   ├── submit.js       ← POST: saves score to Redis + sends Telegram
│   └── leaderboard.js  ← GET: returns top 20 scores from Redis
├── package.json
├── vercel.json
└── .env.example
```

## 🚀 Deploy to Vercel

1. Go to https://vercel.com → New Project → import this repo.
2. Add Environment Variables in Vercel dashboard:

| Variable | Value |
|---|---|
| `UPSTASH_REDIS_REST_URL` | From Upstash console |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash console |
| `TELEGRAM_BOT_TOKEN` | From @BotFather |
| `TELEGRAM_CHAT_ID` | Your Telegram chat ID |

3. Click **Deploy**. Done! ✅

## 🔑 Getting Credentials

### Upstash Redis
1. Go to https://console.upstash.com
2. Create a free Redis database
3. Copy **REST URL** and **REST Token**

### Telegram
1. Message @BotFather → /newbot → copy the **bot token**
2. Message your bot, then visit:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Find your **chat id** in the response

## 📱 Telegram Report Example
```
✅ New Test Result
👤 Student: Ali Karimov
📊 Score: 16/20
🕐 Time: 29 Apr 2026, 21:30
```

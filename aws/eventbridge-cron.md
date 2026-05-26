# EventBridge — weekly question bank sync

Replaces Vercel Cron (`vercel.json` → `/api/cron/sync-question-bank`).

## Option A — API Destination (HTTPS)

1. **EventBridge → Schedules** → Create schedule
2. **Schedule:** `cron(0 5 ? * SUN *)` (Sundays 05:00 UTC, same as Vercel)
3. **Target:** API destination
   - URL: `https://app.yourdomain.com/api/cron/sync-question-bank`
   - Method: GET
   - Header: `Authorization` = `Bearer <CRON_SECRET>`

## Option B — Lambda proxy

Small Lambda that calls your ALB with the bearer token (use if API Destination is unavailable in your region/account).

## Verify manually

```bash
curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" \
  "https://app.yourdomain.com/api/cron/sync-question-bank"
```

Expect JSON with sync status.

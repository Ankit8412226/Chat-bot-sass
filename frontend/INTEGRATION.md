# BotBridge Frontend Integration Guide

This guide explains how to connect your deployed frontend to the backend, generate and use API keys, embed the chat widget, and test the full flow including human handoff.

## 1) Configure API Base URL

Set the frontend to call your API host. The app already reads `VITE_API_URL` and falls back to `https://api.suhtech.shop/api`.

- Create or update `.env` in `frontend/`:
```
VITE_API_URL=https://api.suhtech.shop/api
```
- Rebuild and redeploy the frontend after changing envs.

Notes:
- Do NOT hit `https://www.suhtech.shop/api/...`. That is your frontend host. Use the API host: `https://api.suhtech.shop/api`.

## 2) Backend CORS/Proxy Checklist

- Backend CORS permits all origins in production (already configured).
- Nginx keeps the `/api` prefix when proxying to Node (already configured).
- Socket.IO is enabled at `/socket.io` and `/api/socket.io`.

Quick health check:
```
curl -i https://api.suhtech.shop/api/health
```

## 3) Generate an API Key (Owner/Admin)

Navigate to Dashboard → API Keys and create a new key:
- Copy the full key (starts with `sk_...`) when it is created. The key is only shown ONCE.
- The list view shows only `maskedKey` (e.g., `sk_123...abcd`). Masked keys cannot be used for widget calls.
- Optional: set `allowedOrigins` to restrict usage to your domain(s).

Keep the key secret. Treat it like a password.

## 4) Test End-to-End in the App

### Integration Test
- Go to Dashboard → Test Integration.
- Paste the full widget API key into “Widget API Key”.
- Click “Run Tests”.
- Use the live widget on the page to trigger a conversation and handoff.

### Chat Tester
- Go to Dashboard → Chat Tester.
- Paste the full API key in the “Paste full API key (starts with sk_)” input.
- Start the chat and try scenarios.

If you see “API key required” or “Invalid API key”, you likely used a masked key; paste the full `sk_...` key instead.

## 5) Embed the Widget on Your Site

Add the `ChatWidget` component where you want the launcher button to appear (e.g., your landing page). Pass the full API key and optional config.

Example (React):
```jsx
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <>
      {/* other UI */}
      <ChatWidget
        apiKey={import.meta.env.VITE_WIDGET_KEY || '<YOUR_SK_KEY>'}
        config={{
          primaryColor: '#3B82F6',
          welcomeMessage: "Hi! I'm your AI assistant. How can I help?",
          placeholder: 'Type your message...',
          showBranding: true
        }}
      />
    </>
  );
}
```

Widget API endpoints used under the hood (from the frontend):
- `POST /api/chat/start` (headers: `X-API-Key: <sk_...>`) → returns `sessionId` and welcome message
- `POST /api/chat/message` (headers: `X-API-Key: <sk_...>`) → sends a message and returns assistant reply
- `GET  /api/chat/:sessionId/history` (headers: `X-API-Key: <sk_...>`) → chat history
- `POST /api/chat/:sessionId/handoff` (headers: `X-API-Key: <sk_...>`) → request human handoff

These are proxied to `https://api.suhtech.shop/api/...` via `VITE_API_URL`.

## 6) Human Handoff

- Agents must log in and open Handoff Center.
- When a handoff is requested, agents see new conversations. Accepting a handoff connects the customer to the agent.
- Socket.IO is used to deliver real-time messages to both sides.

## 7) Dashboard Analytics

- “Avg. Satisfaction” and “Avg. Duration” become available as data accumulates.
- Ensure conversations are ended with satisfaction ratings to populate “Avg. Satisfaction”.
- Duration is computed from conversation lifecycle.

## 8) Common Errors & Fixes

- “API key required” in Integration Test/Chat Tester
  - Paste the full key (starts with `sk_`). Masked keys from the list cannot be used.

- “Invalid API key”
  - Use a valid, active key. Check `allowedOrigins` includes your site origin if configured.
  - Regenerate a key and store the full value securely.

- Calls going to wrong host (DNS_HOSTNAME_NOT_FOUND)
  - Ensure `VITE_API_URL` is set to `https://api.suhtech.shop/api`, rebuild and redeploy.
  - Do not navigate to `https://www.suhtech.shop/api/...` in the browser.

- 404 “Route not found” when hitting `/auth/login`
  - `POST /api/auth/login` only. A GET in the browser bar will 404.

## 9) Quick API Reference (Authenticated, Bearer JWT)

- `GET /api/tenant/analytics?days=30`
- `GET /api/chat/conversations?status=...&limit=...`
- `GET /api/keys` (returns masked keys)
- `POST /api/keys` (returns full key once on creation)

Headers for authenticated routes:
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

Headers for widget (public) routes:
```
X-API-Key: <sk_...>
Content-Type: application/json
```

## 10) Useful cURL Commands

Health:
```
curl -i https://api.suhtech.shop/api/health
```
Login (POST only):
```
curl -i -X POST https://api.suhtech.shop/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"yourPassword"}'
```
List API keys (masked) with JWT:
```
curl -s https://api.suhtech.shop/api/keys \
  -H "Authorization: Bearer <JWT>"
```
Widget start with API key:
```
curl -s -X POST https://api.suhtech.shop/api/chat/start \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: <sk_...>' \
  -d '{"visitorId":"demo_visitor"}'
```

---
If you need a one-page checklist or want this guide surfaced in the UI, we can add a Docs link to the sidebar.

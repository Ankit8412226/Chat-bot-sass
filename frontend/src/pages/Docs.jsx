import React from 'react';

const Docs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">BotBridge Frontend Integration Guide</h1>

        <p className="text-gray-700 mb-6">
          This guide explains how to connect your deployed frontend to the backend, generate and use API keys, embed the chat widget, and test the full flow including human handoff.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">1) Configure API Base URL</h2>
        <p className="text-gray-700 mb-3">Set the frontend to call your API host.</p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto"><code>VITE_API_URL=https://api.suhtech.shop/api</code></pre>
        <p className="text-gray-600 mt-2">Rebuild and redeploy the frontend after changing envs.</p>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          Do NOT hit <code className="font-mono">https://www.suhtech.shop/api/...</code>. Use <code className="font-mono">https://api.suhtech.shop/api</code>.
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">2) Backend CORS/Proxy Checklist</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>CORS allows production origins (configured).</li>
          <li>Nginx preserves the <code className="font-mono">/api</code> prefix.</li>
          <li>Socket.IO enabled at <code className="font-mono">/socket.io</code> and <code className="font-mono">/api/socket.io</code>.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">3) Generate an API Key</h2>
        <p className="text-gray-700 mb-3">Dashboard → API Keys → Create.</p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Copy the full key (starts with <code className="font-mono">sk_</code>) at creation time — shown once.</li>
          <li>List view shows only <em>masked</em> keys (e.g., <code className="font-mono">sk_123...abcd</code>).</li>
          <li>Optional: set allowedOrigins.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">4) Test In-App</h2>
        <p className="text-gray-700">Use the Integration Test and Chat Tester pages and paste your full key.</p>
        <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900">
          If you see “API key required” or “Invalid API key”, you likely pasted a masked key — use the full <code className="font-mono">sk_...</code> key.
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">5) Embed the Widget</h2>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto"><code>{`import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <>
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
}`}</code></pre>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">6) Human Handoff</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Agents log in and open Handoff Center.</li>
          <li>Requests appear as pending handoffs; accepting connects the user.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">7) Dashboard Analytics</h2>
        <p className="text-gray-700">Averages populate once conversations are ended and ratings are provided.</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">8) Troubleshooting</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Invalid key → use full <code className="font-mono">sk_</code> key; check allowedOrigins.</li>
          <li>Wrong host → ensure <code className="font-mono">VITE_API_URL=https://api.suhtech.shop/api</code>, rebuild.</li>
          <li>Login 404 → must POST <code className="font-mono">/api/auth/login</code>.</li>
        </ul>
      </div>
    </div>
  );
};

export default Docs;



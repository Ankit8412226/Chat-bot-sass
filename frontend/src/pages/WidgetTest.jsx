import { MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import ChatWidget from '../components/ChatWidget.jsx';

const WidgetTest = () => {
  const [apiKey, setApiKey] = useState('');
  const [mountedKey, setMountedKey] = useState('');

  const isValidKey = apiKey.startsWith('sk_') && apiKey.length > 16;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Public Widget Test</h1>
        <p className="text-gray-600 mb-6">Paste a full API key (starts with sk_) to try the chat widget without logging in.</p>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value.trim())}
              placeholder="sk_XXXXXXXXXXXXXXXXXXXXXXXX"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => setMountedKey(apiKey)}
              disabled={!isValidKey}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start
            </button>
          </div>
          {!apiKey && (
            <p className="text-xs text-gray-500 mt-2">Generate a key in your dashboard, copy the full value once, and paste here.</p>
          )}
          {apiKey && !isValidKey && (
            <p className="text-xs text-red-600 mt-2">Key must start with sk_ and be a full, unmasked value.</p>
          )}
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-8 h-[520px] relative">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Chat</h2>
          {mountedKey ? (
            <div className="absolute inset-6 top-20">
              <ChatWidget apiKey={mountedKey} className="relative h-full" />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-700 font-medium">Paste your API key and click Start</div>
                <div className="text-sm text-gray-500 mt-1">We will create a temporary session for testing.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetTest;



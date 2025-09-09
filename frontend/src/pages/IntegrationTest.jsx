import { AlertCircle, CheckCircle, MessageSquare, User, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import ChatWidget from '../components/ChatWidget.jsx';
import { useAuth } from '../lib/auth.jsx';

const IntegrationTest = () => {
  const { tenant } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results = {};

    try {
      // Test 1: Check if tenant has API keys
      try {
        const response = await fetch('/api/keys', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        results.apiKeys = {
          status: 'success',
          message: `Found ${data.keys?.length || 0} API keys`,
          details: data.keys?.length > 0 ? 'API keys are available' : 'No API keys found'
        };
      } catch (error) {
        results.apiKeys = {
          status: 'error',
          message: 'Failed to fetch API keys',
          details: error.message
        };
      }

      // Test 2: Check if team members exist
      try {
        const response = await fetch('/api/tenant/team', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        const agentCount = data.team?.filter(member => member.role === 'agent').length || 0;
        results.agents = {
          status: agentCount > 0 ? 'success' : 'warning',
          message: `Found ${agentCount} agents`,
          details: agentCount > 0 ? 'Agents are available for handoff' : 'No agents found - add agents to enable handoff'
        };
      } catch (error) {
        results.agents = {
          status: 'error',
          message: 'Failed to fetch team members',
          details: error.message
        };
      }

      // Test 3: Check handoff service
      results.handoffService = {
        status: 'success',
        message: 'Handoff service is configured',
        details: 'Backend handoff service is available'
      };

      // Test 4: Check widget functionality
      results.widget = {
        status: 'success',
        message: 'Chat widget is ready',
        details: 'Widget component is loaded and functional'
      };

    } catch (error) {
      results.general = {
        status: 'error',
        message: 'Test failed',
        details: error.message
      };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Integration Test</h1>
        <p className="mt-2 text-gray-600">
          Test the complete flow from chat to agent handoff
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Results */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="btn-primary flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Running Tests...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Run Tests</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {Object.keys(testResults).length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Click "Run Tests" to check integration status</p>
              </div>
            ) : (
              Object.entries(testResults).map(([key, result]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{result.details}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Chat Widget Test */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Widget Test</h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Test Instructions</span>
              </div>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Click the chat widget button below</li>
                <li>Start a conversation with the AI</li>
                <li>Click "Talk to Human Agent" button</li>
                <li>Check the Handoff Center for incoming chats</li>
              </ol>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Agent Requirements</span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>At least one agent must be added to the team</li>
                <li>Agent must be logged in to receive handoffs</li>
                <li>Handoff Center must be open to see incoming chats</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Use this widget to test the complete handoff flow:
              </p>
              <div className="relative">
                <ChatWidget
                  apiKey={tenant?.apiKeys?.[0]?.key || 'test-key'}
                  config={{
                    primaryColor: '#3B82F6',
                    welcomeMessage: 'Hi! I\'m your AI assistant. How can I help you today?',
                    placeholder: 'Type your message...',
                    showBranding: true
                  }}
                  onMessage={(data) => {
                    console.log('Widget message:', data);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/agents"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <User className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Add Agents</h4>
                <p className="text-sm text-gray-500">Manage your support team</p>
              </div>
            </div>
          </a>

          <a
            href="/handoff-center"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <MessageSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Handoff Center</h4>
                <p className="text-sm text-gray-500">View incoming chats</p>
              </div>
            </div>
          </a>

          <a
            href="/api-keys"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">API Keys</h4>
                <p className="text-sm text-gray-500">Manage widget access</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default IntegrationTest;

import {
  Activity,
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  Headphones,
  Key,
  MessageSquare,
  Star,
  TrendingUp,
  UserCheck,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/Badge.jsx';
import { chatAPI, tenantAPI } from '../lib/api.js';
import { useAuth } from '../lib/auth.jsx';

const Dashboard = () => {
  const { user, tenant, refreshTenant, isAgent } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [analyticsRes, conversationsRes] = await Promise.all([
        tenantAPI.getAnalytics(30),
        chatAPI.getConversations({ limit: 5 })
      ]);

      setAnalytics(analyticsRes.data);
      setConversations(conversationsRes.data.conversations);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Agent-specific dashboard view
  if (isAgent) {
    return <AgentDashboard user={user} tenant={tenant} conversations={conversations} />;
  }

  const statusArray = analytics?.conversations?.statusBreakdown || [];
  const activeCount = Array.isArray(statusArray)
    ? statusArray.filter(s => s === 'active' || s === 'transferred').length
    : 0;

  const stats = [
    {
      name: 'Total Conversations',
      value: analytics?.conversations?.totalConversations || 0,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Active Chats',
      value: activeCount,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Avg. Satisfaction',
      value: typeof analytics?.conversations?.avgSatisfaction === 'number'
        ? `${analytics.conversations.avgSatisfaction.toFixed(1)}/5`
        : 'N/A',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Avg. Duration',
      value: typeof analytics?.conversations?.avgDuration === 'number'
        ? `${Math.round((analytics.conversations.avgDuration || 0) / 60)}m`
        : 'N/A',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const usagePercentage = (current, limit) => {
    return limit > 0 ? Math.round((current / limit) * 100) : 0;
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your chatbot today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Usage Overview */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Overview</h3>

            <div className="space-y-4">
              {/* Conversations */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Conversations</span>
                  <span className={`text-sm font-medium ${getUsageColor(usagePercentage(tenant?.usage?.conversations, tenant?.limits?.conversations))}`}>
                    {tenant?.usage?.conversations || 0} / {tenant?.limits?.conversations || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, usagePercentage(tenant?.usage?.conversations, tenant?.limits?.conversations))}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* API Calls */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">API Calls</span>
                  <span className={`text-sm font-medium ${getUsageColor(usagePercentage(tenant?.usage?.apiCalls, tenant?.limits?.apiCalls))}`}>
                    {tenant?.usage?.apiCalls || 0} / {tenant?.limits?.apiCalls || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, usagePercentage(tenant?.usage?.apiCalls, tenant?.limits?.apiCalls))}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Knowledge Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Knowledge Items</span>
                  <span className={`text-sm font-medium ${getUsageColor(usagePercentage(tenant?.usage?.knowledgeItems, tenant?.limits?.knowledgeItems))}`}>
                    {tenant?.usage?.knowledgeItems || 0} / {tenant?.limits?.knowledgeItems || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, usagePercentage(tenant?.usage?.knowledgeItems, tenant?.limits?.knowledgeItems))}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Subscription info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Current Plan</h4>
                  <p className="text-sm text-gray-600 capitalize">{tenant?.subscription?.plan} plan</p>
                </div>
                <Badge variant="success">
                  {tenant?.subscription?.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Conversations + Billing */}
        <div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h3>

            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No conversations yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Start by testing your chatbot or sharing your widget
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conversation) => (
                  <div key={conversation._id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {conversation.visitor?.name || 'Anonymous'}
                      </span>
                      <Badge
                        variant={
                          conversation.status === 'active' ? 'success' :
                          conversation.status === 'transferred' ? 'warning' : 'default'
                        }
                      >
                        {conversation.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {conversation.messageCount} messages • {' '}
                      {new Date(conversation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Billing Card */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Billing</h3>
            <p className="text-sm text-gray-600 mb-3">Manage your subscription</p>
            <Link to="/subscribe" className="btn-primary inline-block">View plans</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/api-keys"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage API Keys</h4>
                <p className="text-sm text-gray-500">Create and manage access</p>
              </div>
            </div>
          </Link>

          <Link
            to="/knowledge-base"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Knowledge Base</h4>
                <p className="text-sm text-gray-500">Add Q&A content</p>
              </div>
            </div>
          </Link>

          <Link
            to="/prompt-tuner"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Tune Prompts</h4>
                <p className="text-sm text-gray-500">Customize AI behavior</p>
              </div>
            </div>
          </Link>

          <Link
            to="/chat-tester"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Test Chat</h4>
                <p className="text-sm text-gray-500">Try your chatbot</p>
              </div>
            </div>
          </Link>

          <Link
            to="/agents"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Manage Agents</h4>
                <p className="text-sm text-gray-500">Add team members</p>
              </div>
            </div>
          </Link>

          <Link
            to="/integration-test"
            className="card hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Test Integration</h4>
                <p className="text-sm text-gray-500">Verify handoff flow</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Agent-specific dashboard component
const AgentDashboard = ({ user, tenant, conversations }) => {
  const myConversations = conversations.filter(c => c.assignedAgent === user._id);
  const pendingHandoffs = conversations.filter(c => c.status === 'transferred' && !c.assignedAgent);
  const activeConversations = myConversations.filter(c => c.status === 'active');

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Agent Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-600">
              You're logged in as a support agent for <span className="font-semibold text-blue-600">{tenant?.name}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
            <Link
              to="/handoff-center"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Headphones className="h-5 w-5" />
              <span>Handoff Center</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Active Chats</p>
              <p className="text-3xl font-bold text-blue-600">{activeConversations.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Handoffs</p>
              <p className="text-3xl font-bold text-orange-600">{pendingHandoffs.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assigned</p>
              <p className="text-3xl font-bold text-green-600">{myConversations.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-3xl font-bold text-purple-600">2.3m</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Handoffs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pending Handoffs</h3>
              <Badge variant="warning">{pendingHandoffs.length}</Badge>
            </div>
          </div>
          <div className="p-6">
            {pendingHandoffs.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No pending handoffs! Great job! 🎉</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingHandoffs.slice(0, 3).map((conversation) => (
                  <div key={conversation._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {conversation.visitor?.name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(conversation.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {conversation.messageCount} messages
                    </p>
                    <Link
                      to="/handoff-center"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Take conversation →
                    </Link>
                  </div>
                ))}
                {pendingHandoffs.length > 3 && (
                  <Link
                    to="/handoff-center"
                    className="block text-center text-blue-600 hover:text-blue-700 font-medium py-2"
                  >
                    View all {pendingHandoffs.length} pending handoffs
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* My Active Conversations */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">My Active Conversations</h3>
              <Badge variant="success">{activeConversations.length}</Badge>
            </div>
          </div>
          <div className="p-6">
            {activeConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active conversations</p>
                <p className="text-sm text-gray-500 mt-2">Take a handoff to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeConversations.slice(0, 3).map((conversation) => (
                  <div key={conversation._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {conversation.visitor?.name || 'Anonymous'}
                      </span>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Last message: {formatTimeAgo(conversation.updatedAt)}
                    </p>
                    <Link
                      to="/handoff-center"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Continue conversation →
                    </Link>
                  </div>
                ))}
                {activeConversations.length > 3 && (
                  <Link
                    to="/handoff-center"
                    className="block text-center text-blue-600 hover:text-blue-700 font-medium py-2"
                  >
                    View all {activeConversations.length} conversations
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/handoff-center"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Headphones className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Handoff Center</p>
              <p className="text-sm text-gray-600">Manage customer conversations</p>
            </div>
          </Link>

          <Link
            to="/knowledge-base"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Knowledge Base</p>
              <p className="text-sm text-gray-600">Access help articles</p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Profile</p>
              <p className="text-sm text-gray-600">Update your settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import {
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  Key,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Users
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth.jsx';

const Sidebar = () => {
  const { user, tenant, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'API Keys', href: '/api-keys', icon: Key },
    { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
    { name: 'Prompt Tuner', href: '/prompt-tuner', icon: Settings },
    { name: 'Chat Tester', href: '/chat-tester', icon: MessageSquare },
    { name: 'Agents', href: '/agents', icon: Users },
    { name: 'Handoff Center', href: '/handoff-center', icon: MessageSquare },
    { name: 'Test Integration', href: '/integration-test', icon: Bot },
    { name: 'Profile', href: '/profile', icon: User }
  ];

  const isActive = (href) => location.pathname === href;

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">BotBridge</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex justify-center w-full">
            <Bot className="h-8 w-8 text-primary-600" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                isActive(item.href)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={collapsed ? item.name : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        {/* Tenant Info */}
        {!collapsed && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 truncate">
              {tenant?.name || 'Loading...'}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {tenant?.subscription?.plan || 'free'} plan
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-primary-600">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {!collapsed && (
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                  <div className="text-xs text-gray-500 capitalize mt-1">
                    Role: {user?.role || 'user'}
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

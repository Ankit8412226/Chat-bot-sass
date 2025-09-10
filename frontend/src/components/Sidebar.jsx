import {
    BarChart3,
    BookOpen,
    Bot,
    ChevronLeft,
    ChevronRight,
    Headphones,
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
  const { user, tenant, logout, isAgent } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Role-based navigation
  const getNavigation = () => {
    if (isAgent) {
      // Agent-specific navigation
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Handoff Center', href: '/handoff-center', icon: Headphones },
        { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
        { name: 'Profile', href: '/profile', icon: User }
      ];
    } else {
      // Admin/Owner navigation
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'API Keys', href: '/api-keys', icon: Key },
        { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
        { name: 'Prompt Tuner', href: '/prompt-tuner', icon: Settings },
        { name: 'Chat Tester', href: '/chat-tester', icon: MessageSquare },
        { name: 'Agents', href: '/agents', icon: Users },
        { name: 'Handoff Center', href: '/handoff-center', icon: Headphones },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Test Integration', href: '/integration-test', icon: Bot },
        { name: 'Profile', href: '/profile', icon: User }
      ];
    }
  };

  const navigation = getNavigation();

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
            <div className={`p-2 rounded-lg ${isAgent ? 'bg-blue-100' : 'bg-primary-100'}`}>
              {isAgent ? (
                <Headphones className="h-6 w-6 text-blue-600" />
              ) : (
                <Bot className="h-6 w-6 text-primary-600" />
              )}
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">BotBridge</span>
              {isAgent && (
                <div className="text-xs text-blue-600 font-medium">Agent Portal</div>
              )}
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="flex justify-center w-full">
            <div className={`p-2 rounded-lg ${isAgent ? 'bg-blue-100' : 'bg-primary-100'}`}>
              {isAgent ? (
                <Headphones className="h-6 w-6 text-blue-600" />
              ) : (
                <Bot className="h-6 w-6 text-primary-600" />
              )}
            </div>
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
          <div className={`mb-4 p-3 rounded-lg ${isAgent ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <div className="text-sm font-medium text-gray-900 truncate">
              {tenant?.name || 'Loading...'}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {tenant?.subscription?.plan || 'free'} plan
            </div>
            {isAgent && (
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-green-600 font-medium">Agent Online</span>
              </div>
            )}
          </div>
        )}

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isAgent ? 'bg-blue-100' : 'bg-primary-100'
            }`}>
              <span className={`text-sm font-medium ${
                isAgent ? 'text-blue-600' : 'text-primary-600'
              }`}>
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
                {isAgent && (
                  <div className="text-xs text-blue-600 font-medium">
                    Support Agent
                  </div>
                )}
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
                  <div className={`text-xs capitalize mt-1 font-medium ${
                    isAgent ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {isAgent ? 'Support Agent' : `Role: ${user?.role || 'user'}`}
                  </div>
                  {isAgent && (
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  )}
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

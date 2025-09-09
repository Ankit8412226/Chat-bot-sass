import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './lib/auth.jsx';

// Pages
import AgentManagement from './pages/AgentManagement.jsx';
import ApiKeys from './pages/ApiKeys.jsx';
import ChatTester from './pages/ChatTester.jsx';
import Dashboard from './pages/Dashboard.jsx';
import HandoffCenter from './pages/HandoffCenter.jsx';
import IntegrationTest from './pages/IntegrationTest.jsx';
import KnowledgeBase from './pages/KnowledgeBase.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import PromptTuner from './pages/PromptTuner.jsx';
import Signup from './pages/Signup.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Landing />} />

          {/* Protected routes */}
          <Route path="/app" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/api-keys" element={
            <ProtectedRoute>
              <Layout>
                <ApiKeys />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/knowledge-base" element={
            <ProtectedRoute>
              <Layout>
                <KnowledgeBase />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/prompt-tuner" element={
            <ProtectedRoute>
              <Layout>
                <PromptTuner />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/chat-tester" element={
            <ProtectedRoute>
              <Layout>
                <ChatTester />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/handoff-center" element={
            <ProtectedRoute>
              <Layout>
                <HandoffCenter />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/agents" element={
            <ProtectedRoute>
              <Layout>
                <AgentManagement />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/integration-test" element={
            <ProtectedRoute>
              <Layout>
                <IntegrationTest />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

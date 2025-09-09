import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { loadEnv } from './config/env.js';
import { errorHandler } from './utils/error.js';

// Route imports
import apiKeyRoutes from './routes/apiKeyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import kbRoutes from './routes/kbRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import handoffService from './services/handoff.js';

// Load environment variables
loadEnv();

const app = express();
const server = createServer(app);

// CORS configuration - Allow all origins
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

// Socket.IO config - Allow all origins
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
  }
});



// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration


// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - DISABLED for testing
// app.use(globalRateLimit);

// Handle preflight requests - Allow all origins
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, Origin, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'false');
  res.sendStatus(200);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/keys', apiKeyRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/webhook', webhookRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-tenant', (tenantId) => {
    socket.join(`tenant-${tenantId}`);
    console.log(`Socket ${socket.id} joined tenant ${tenantId}`);
  });

  socket.on('agent-online', (data) => {
    socket.join(`agent-${data.agentId}`);
    socket.to(`tenant-${data.tenantId}`).emit('agent-status', {
      agentId: data.agentId,
      status: 'online'
    });
    console.log(`Agent ${data.agentId} is online`);
  });

  socket.on('agent-offline', (data) => {
    socket.leave(`agent-${data.agentId}`);
    socket.to(`tenant-${data.tenantId}`).emit('agent-status', {
      agentId: data.agentId,
      status: 'offline'
    });
    console.log(`Agent ${data.agentId} is offline`);
  });

  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation-${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation-${conversationId}`);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });

  socket.on('chat-message', (data) => {
    socket.to(`conversation-${data.conversationId}`).emit('new-message', data);
  });

  socket.on('handoff-notification', (data) => {
    // Broadcast handoff notifications to all agents in the tenant
    socket.to(`tenant-${data.tenantId}`).emit('new-handoff', data);
    console.log(`Handoff notification sent to tenant ${data.tenantId}:`, data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);
// Inject io into services that need it
handoffService.setSocketIO(io);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = 3000;

// In Vercel serverless environment, Vercel provides the listener; skip .listen()
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  });
}

export default app;

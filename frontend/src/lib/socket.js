import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(token, tenantId) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    this.socket = io(backendUrl, {
      auth: {
        token,
        tenantId
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;

      // Join tenant room
      if (tenantId) {
        this.socket.emit('join-tenant', tenantId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Agent-specific methods
  setAgentOnline(agentId, tenantId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('agent-online', { agentId, tenantId });
    }
  }

  setAgentOffline(agentId, tenantId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('agent-offline', { agentId, tenantId });
    }
  }

  joinConversation(conversationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-conversation', conversationId);
    }
  }

  leaveConversation(conversationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-conversation', conversationId);
    }
  }

  // Event listeners
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Store listener for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      // Remove from stored listeners
      if (this.listeners.has(event)) {
        const listeners = this.listeners.get(event);
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }
  }

  // Clean up all listeners
  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          this.socket.off(event, callback);
        });
      });
      this.listeners.clear();
    }
  }

  // Emit events
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id
    };
  }
}

export default new SocketManager();

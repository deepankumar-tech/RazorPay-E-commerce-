import http from 'http';
import app from './app';
import { env } from './config/env';
import prisma from './config/database';
import { initSocketServer } from './socket/socketServer';

const PORT = parseInt(env.PORT, 10) || 5000;

async function startServer() {
  try {
    // Verify DB connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database via Prisma ORM');

    const server = http.createServer(app);
    initSocketServer(server);
    console.log('⚡ Socket.IO Server initialized for real-time customer/merchant events');

    server.listen(PORT, () => {
      console.log(`🚀 AI Commerce Growth Agent API running on http://localhost:${PORT}`);
      console.log(`   Agent Catalog API: http://localhost:${PORT}/api/catalog/agent`);
      console.log(`   Health Check:     http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

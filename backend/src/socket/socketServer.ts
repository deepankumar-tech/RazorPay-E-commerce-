import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const initSocketServer = (httpServer: HTTPServer) => {
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log(`⚡ [Socket.IO] Client connected: ${socket.id}`);

    socket.on('join_merchant', (merchantId: string) => {
      socket.join(`merchant_${merchantId}`);
      console.log(`⚡ [Socket.IO] ${socket.id} joined room: merchant_${merchantId}`);
    });

    socket.on('join_user', (userId: string) => {
      socket.join(`user_${userId}`);
      console.log(`⚡ [Socket.IO] ${socket.id} joined room: user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`⚡ [Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = (): SocketIOServer | null => {
  return ioInstance;
};

export const notifyNewOrder = (order: any) => {
  if (!ioInstance) return;
  ioInstance.emit('NEW_ORDER', order);
  if (order.merchantId) {
    ioInstance.to(`merchant_${order.merchantId}`).emit('MERCHANT_NEW_ORDER', order);
  }
  if (order.userId) {
    ioInstance.to(`user_${order.userId}`).emit('USER_NEW_ORDER', order);
  }
};

export const notifyOrderStatusUpdate = (orderId: string, status: string, userId?: string, merchantId?: string) => {
  if (!ioInstance) return;
  const payload = { orderId, status, timestamp: new Date() };
  ioInstance.emit('ORDER_STATUS_UPDATED', payload);
  if (merchantId) ioInstance.to(`merchant_${merchantId}`).emit('ORDER_STATUS_UPDATED', payload);
  if (userId) ioInstance.to(`user_${userId}`).emit('ORDER_STATUS_UPDATED', payload);
};

export const notifyInventoryUpdate = (productId: string, newQuantity: number) => {
  if (!ioInstance) return;
  ioInstance.emit('INVENTORY_UPDATED', { productId, newQuantity });
};

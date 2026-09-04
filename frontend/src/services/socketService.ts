import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('⚡ [Frontend Socket] Connected to backend real-time stream:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('⚡ [Frontend Socket] Disconnected from backend');
    });
  }
  return socket;
};

export const joinMerchantRoom = (merchantId: string) => {
  const s = getSocket();
  s.emit('join_merchant', merchantId);
};

export const joinUserRoom = (userId: string) => {
  const s = getSocket();
  s.emit('join_user', userId);
};

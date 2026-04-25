'use client';

import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export function getSocket() {
  if (!socket && typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinTripTracking(tripId) {
  const s = getSocket();
  if (s) s.emit('tracking:join', { tripId });
}

export function leaveTripTracking(tripId) {
  const s = getSocket();
  if (s) s.emit('tracking:leave', { tripId });
}

export function sendDriverLocation(lat, lng, speed, heading, tripId) {
  const s = getSocket();
  if (s) s.emit('driver:location', { lat, lng, speed, heading, tripId });
}

export function setDriverStatus(isOnline) {
  const s = getSocket();
  if (s) s.emit('driver:status', { isOnline });
}

import { io } from "socket.io-client";

const IN_PROD = import.meta.env.PROD;
const SOCKET_URL = IN_PROD ? 'ws://hypercomm.onrender.com' : 'http://127.0.0.1:8080'; // Adjusted to match your Flask server port

console.log('WebSocket URL:', SOCKET_URL);

export const socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: false });

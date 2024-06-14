import { io } from "socket.io-client";

export const socket = io("wss://hypercomm.onrender.com", { transports: ['websocket'] });

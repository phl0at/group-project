import { io } from "socket.io-client";

export const socket = io("ws://hypercomm.onrender.com", { transports: ['websocket'] });

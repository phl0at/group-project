import { io } from "socket.io-client";

export const socket = io("hypercomm.onrender.com", {transports: ['websocket']});

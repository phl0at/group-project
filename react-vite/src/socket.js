import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.PROD
  ? "hypercomm.onrender.com"
  : "http://localhost:8080";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

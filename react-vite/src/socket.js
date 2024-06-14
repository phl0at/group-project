import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.NODE_ENV === "production"
    ? "wss://hypercomm.onrender.com"
    : "http://localhost:8000", { autoConnect: false }
);

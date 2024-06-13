import { io } from "socket.io-client";

export const socket = io(
  import.meta.env.NODE_ENV === "production"
    ? undefined
    : "http://localhost:8000", {autoConnect: false}
);

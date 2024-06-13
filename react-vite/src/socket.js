import { io } from "socket.io-client";

export const socket = io(
  // import.meta.env.NODE_ENV === "production"
  //   ? "ws://hypercomm.onrender.com"
  //   : "http://localhost:8000", {autoConnect: false}
  import.meta.env.SOCKET_URL
);

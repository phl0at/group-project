import { io } from "socket.io-client";

const IN_PROD = import.meta.env.PROD
const SOCKET_URL = IN_PROD ? 'hypercomm.onrender.com' : process.env.NODE_ENV

console.log('\n====URL=====', SOCKET_URL)

export const socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: false });

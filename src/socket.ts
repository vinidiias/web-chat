import { io } from "socket.io-client";

// Connect to the socket server
export const socket = io("http://localhost:3001", {
  autoConnect: true,
});
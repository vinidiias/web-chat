import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { MessageDTO } from "@/app/@types/MessageDTO";

interface ServerToClientEvents {
  message: (data: MessageDTO) => void;
  userJoined: (data: MessageDTO) => void;
  userLeft: (data: MessageDTO) => void;
  typing: (data: { username: string; isTyping: boolean }) => void;
}

interface ClientToServerEvents {
  join: (username: string) => void;
  sendMessage: (message: string) => void;
  typing: (isTyping: boolean) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  username: string;
}

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer);

  io.on("connection", (socket) => {
    // Handle user joining with username
    socket.on("join", (username: string) => {
      socket.data.username = username;

      const dto: MessageDTO = {
        type: 'notification',
        username: username,
        content: username + 'entrou no chat',
        timestamp: Date.now(),
      }
      // Notify all other users
      socket.broadcast.emit("userJoined", dto);
    });

    // Handle incoming messages
    socket.on("sendMessage", (message: string) => {
      const username = socket.data.username || "Anonymous";

      const dto: MessageDTO = {
        type: 'message',
        username: username,
        content: message,
        timestamp: Date.now(),
      }
      // Broadcast message to all clients including sender
      io.emit("message", dto);
    });

    // Handle typing indicator
    socket.on("typing", (isTyping: boolean) => {
      const username = socket.data.username || "Anonymous";

      // Broadcast typing status to all other users
      socket.broadcast.emit("typing", {
        username,
        isTyping,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const username = socket.data.username || "Anonymous";

      const dto: MessageDTO = {
        type: 'notification',
        username: username,
        content: username + 'saiu do chat',
        timestamp: Date.now(),
      }
      // Notify all other users
      socket.broadcast.emit("userLeft", dto);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
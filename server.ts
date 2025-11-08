//EXTERNAL LIBRARIES
import { createServer } from "node:http";
import next from "next";
import { Server, Socket } from "socket.io";

//TYPES
import { MessageDTO } from "@/app/@types/MessageDTO";
import { UserDTO } from "@/app/@types/UserDTO";
import { TypingDTO } from "@/app/@types/TypingDTO";

interface ServerToClientEvents {
  message: (data: MessageDTO) => void;
  privateMessage: (data: MessageDTO) => void;
  activeUsers: (data: UserDTO[]) => void;
  userJoined: (data: MessageDTO) => void;
  userLeft: (data: MessageDTO) => void;
  typing: (data: TypingDTO) => void;
}

interface ClientToServerEvents {
  join: (data: UserDTO) => void;
  sendMessage: (message: string) => void;
  sendPrivateMessage: (recipientId: string, message: string) => void;
  typing: (isTyping: boolean) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  id: string;
  username: string;
  photo: string;
}

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3001;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const activeUsers: UserDTO[] = [];

const mapMessages = new Map<string, MessageDTO[]>();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer);

  io.on(
    "connection",
    (
      socket: Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >
    ) => {
      // Handle user joining with username
      socket.on("join", (data: UserDTO) => {
        console.log('entrou aq')
        const username = data.username;
        const photo = data.photo; // Already base64 string from client

        // Assign unique socket ID to user
        socket.data.id = socket.id;
        socket.data.username = username;
        socket.data.photo = photo;

        const userExists = activeUsers.find(u => u.id === socket.id);

        if(!userExists) {
          activeUsers.push({
            id: socket.id,
            username,
            photo,
          });
        }

        const dto: MessageDTO = {
          type: "notification",
          username,
          photo,
          content: username + " entrou no chat",
          timestamp: Date.now(),
        };

        io.emit("activeUsers", activeUsers);
        socket.broadcast.emit("userJoined", dto);
      });

      // Handle incoming messages
      socket.on("sendMessage", (message: string) => {
        const userId = socket.data.id;
        const username = socket.data.username || "Anonymous";
        const photo = socket.data.photo;

        const dto: MessageDTO = {
          type: "message",
          username,
          photo,
          content: message,
          timestamp: Date.now(),
        };

        // Broadcast message to all clients including sender
        io.emit("message", dto);
      });

      // Handle private messages to specific friend
      socket.on("sendPrivateMessage", (recipientId: string, message: string) => {
        const senderId = socket.id;
        const username = socket.data.username || "Anonymous";
        const photo = socket.data.photo;

        const dto: MessageDTO = {
          type: "private",
          username,
          photo,
          content: message,
          timestamp: Date.now(),
          senderId: senderId,
          recipientId: recipientId,
        };

        // Send to recipient
        socket.to(recipientId).emit("privateMessage", dto);

        // Send back to sender so they see it in their chat
        socket.emit("privateMessage", dto);
      });

      // Handle typing indicator
      socket.on("typing", (isTyping: boolean) => {
        const username = socket.data.username || "Anonymous";
        const photo = socket.data.photo;

        const dto: TypingDTO = {
          username,
          photo,
          isTyping,
        };
        // Broadcast typing status to all other users
        socket.broadcast.emit("typing", dto);
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        const userId = socket.data.id;
        const username = socket.data.username || "Anonymous";
        const photo = socket.data.photo;

        // Remove user from active users list
        const userIndex = activeUsers.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          activeUsers.splice(userIndex, 1);
        }

        const dto: MessageDTO = {
          type: "notification",
          username,
          photo,
          content: username + " saiu do chat",
          timestamp: Date.now(),
        };
        // Notify all other users
        socket.broadcast.emit("userLeft", dto);
        io.emit("activeUsers", activeUsers);
      });
    }
  );

  httpServer
    .once("error", (err: Error) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

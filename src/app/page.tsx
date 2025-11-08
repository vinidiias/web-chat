"use client";

//EXTERNAL LIBRARIES
import { useEffect, useState, useRef, useContext } from "react";

//SOCKET
import { socket } from "../socket";

//TYPES
import { MessageDTO } from "./@types/MessageDTO";
import { UserDTO } from "./@types/UserDTO";

//UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

//CONTEXT
import { AuthContext } from "./context/AuthContext";

//INTERNAL COMPONENTS
import { Sidebar } from "./components/layout/Siderbar";
import { Header } from "./components/layout/Header";
import { ChatForm } from "./components/pages/chat/form";
import { Messages } from "./components/pages/chat/Messages";

export default function Home() {
  const [activeUsers, setActiveUsers] = useState<UserDTO[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [privateMessages, setPrivateMessages] = useState<MessageDTO[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useContext(AuthContext);
  const { username, photo } = user ?? {};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, privateMessages, selectedUserId]);

  useEffect(() => {
    function onPrivateMessage(data: MessageDTO) {
      setPrivateMessages((prev) => [...prev, data]);
    }

    function onActiveUsers(data: UserDTO[]) {
      setActiveUsers(data);
    }

    function onMessage(data: MessageDTO) {
      setMessages((prev) => [...prev, data]);
    }

    function onUserJoined(data: MessageDTO) {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          type: "notification",
          content: data.username + " entrou no chat",
        },
      ]);
    }

    function onUserLeft(data: MessageDTO) {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          type: "notification",
          content: data.username + " saiu do chat",
        },
      ]);
    }

    function onTyping(data: { username: string; isTyping: boolean }) {
      setTypingUsers((prev) => {
        if (data.isTyping) {
          return prev.includes(data.username) ? prev : [...prev, data.username];
        } else {
          return prev.filter((user) => user !== data.username);
        }
      });
    }

    socket.on("privateMessage", onPrivateMessage);
    socket.on("activeUsers", onActiveUsers);
    socket.on("message", onMessage);
    socket.on("userJoined", onUserJoined);
    socket.on("userLeft", onUserLeft);
    socket.on("typing", onTyping);

    return () => {
      socket.off("privateMessage", onPrivateMessage);
      socket.off("activeUsers", onActiveUsers);
      socket.off("message", onMessage);
      socket.off("userJoined", onUserJoined);
      socket.off("userLeft", onUserLeft);
      socket.off("typing", onTyping);
    };
  }, []);

  const handleSelectedUserId = (id: string) => {
    setSelectedUserId(id ?? null);
  };

  const selectedUser = activeUsers.find((u) => u.id === selectedUserId);

  const displayMessages = selectedUserId
    ? privateMessages.filter(
        (msg) =>
          (msg.senderId === socket.id && msg.recipientId === selectedUserId) ||
          (msg.senderId === selectedUserId && msg.recipientId === socket.id)
      )
    : messages;

  return (
    <>
      <Sidebar
        activeUsers={activeUsers}
        handleClick={handleSelectedUserId}
        selectedUserId={selectedUserId}
      />
      <SidebarInset className="flex flex-col h-screen">
        <div className="w-full flex items-center justify-between p-2">
          <div className="flex items-center gap-5">
            <SidebarTrigger />
            {selectedUser ? (
              <div className="flex justify-start items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={selectedUser.photo}
                    alt={selectedUser.username}
                  />
                </Avatar>
                <span className="font-semibold">{selectedUser.username}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUserId(null)}
                  className="text-xs"
                >
                  Back to Public Chat
                </Button>
              </div>
            ) : (
              <span className="font-semibold">Public Chat</span>
            )}
          </div>
          <Header />
        </div>
        <Messages
          messages={displayMessages}
          messagesEndRef={messagesEndRef}
          username={username ?? ""}
        />

        {typingUsers.length > 0 && (
          <div className="px-4 py-2 text-sm text-gray-500">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing...
          </div>
        )}

        <ChatForm
          selectedUser={selectedUser}
          selectedUserId={selectedUserId}
          photo={photo}
        />
      </SidebarInset>
    </>
  );
}

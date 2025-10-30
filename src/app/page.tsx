"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "../socket";
import { MessageDTO } from "./@types/MessageDTO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { FormJoin } from "./components/FormJoin";

export default function Home() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      setHasJoined(false);
    }

    function onMessage(data: MessageDTO) {
      setMessages((prev) => [...prev, data]);
    }

    function onUserJoined(data: MessageDTO) {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          type: 'notification',
          content: data.username + ' entrou no chat',

        }
      ]);
    }

    function onUserLeft(data: MessageDTO) {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          type: 'notification',
          content: data.username + ' saiu do chat',
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

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("message", onMessage);
    socket.on("userJoined", onUserJoined);
    socket.on("userLeft", onUserLeft);
    socket.on("typing", onTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("message", onMessage);
      socket.off("userJoined", onUserJoined);
      socket.off("userLeft", onUserLeft);
      socket.off("typing", onTyping);
    };
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit("join", username);
      setHasJoined(true);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit("sendMessage", inputMessage);
      setInputMessage("");
      socket.emit("typing", false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    // Emit typing event
    socket.emit("typing", true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", false);
    }, 1000);
  };

  if (!hasJoined) {
    return (
      <FormJoin
        isConnected={isConnected}
        username={username}
        handleChange={handleUsernameChange}
        handleJoin={handleJoin}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Web Chat</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Logged in as: {username}</span>
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.type === "notification" ? (
              <div className="text-center text-gray-500 text-sm py-1">
                {msg.content}
              </div>
            ) : (
              <div className={`flex ${msg.username === username ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.username === username
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800"
                }`}>
                  {msg.username !== username && (
                    <div className="text-xs font-semibold mb-1">{msg.username}</div>
                  )}
                  <div>{msg.content}</div>
                  <div className={`text-xs mt-1 ${
                    msg.username === username ? "text-blue-100" : "text-gray-400"
                  }`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
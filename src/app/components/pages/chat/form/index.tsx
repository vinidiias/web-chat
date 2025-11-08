"use client";

//EXTERNAL LIBRARIES
import { useRef, useState } from "react";

//TYPES
import { UserDTO } from "@/app/@types/UserDTO";

//UI COMPONENTS
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//SOCKET
import { socket } from "@/socket";

interface ChatFormProps {
  selectedUserId: string | null;
  selectedUser: UserDTO | undefined;
  photo: string | undefined;
}

export const ChatForm = ({
  selectedUserId,
  selectedUser,
  photo,
}: ChatFormProps) => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && photo !== null) {
      if (selectedUserId) {
        // Send private message to selected user
        socket.emit("sendPrivateMessage", selectedUserId, inputMessage);
      } else {
        // Send public message to everyone
        socket.emit("sendMessage", inputMessage);
      }
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

  return (
    <div className="p-2">
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder={
            selectedUser
              ? `Message ${selectedUser.username}...`
              : "Type a message..."
          }
        />
        <Button type="submit" disabled={!inputMessage.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};

//EXTERNAL LIBRARIES
import { RefObject } from "react";

//TYPES
import { MessageDTO } from "@/app/@types/MessageDTO";

//UI COMPONENTS
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const formatHours = (data: Date | number): string => {
  const date = new Date(data);

  let formattedHours = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return formattedHours;
}

interface MessagesProps {
    messages: MessageDTO[];
    username: string;
    messagesEndRef: RefObject<HTMLDivElement | null>
}

export const Messages = ({ messages, username, messagesEndRef }: MessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg, index) => {
        return (
          <div key={index}>
            {msg.type === "notification" ? (
              <div className="text-center text-sm py-1">{msg.content}</div>
            ) : (
              <div
                className={`flex ${
                  msg.username === username ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-center gap-2">
                  {msg.username !== username && (
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={msg.photo} alt="" />
                    </Avatar>
                  )}
                  <div
                    className={`flex items-center gap-2 min-h-8 p-3 rounded-md ${
                      msg.username !== username
                        ? "bg-muted color-primary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.username !== username ? (
                      <>
                        <span className="text-[9px] self-end">
                          {formatHours(msg.timestamp)}
                        </span>
                        <span className="text-sm font-normal">
                          {msg.content}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-normal">
                          {msg.content}
                        </span>
                        <span className="text-[9px] self-end">
                          {formatHours(msg.timestamp)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

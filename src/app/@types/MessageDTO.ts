export interface MessageDTO {
  type: "message" | "notification" | "private";
  username: string;
  photo: string;
  content: string;
  timestamp: number;
  recipientId?: string; // Socket ID of the recipient for private messages
  senderId?: string; // Socket ID of the sender for private messages
}
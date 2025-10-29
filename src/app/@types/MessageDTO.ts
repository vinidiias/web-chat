export interface MessageDTO {
  type: "message" | "notification";
  username: string;
  content: string;
  timestamp: number;
}
export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isLoading?: boolean;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ConversationMessage[];
}

export interface AuthStatus {
  connected: boolean;
  expiresAt?: number;
}

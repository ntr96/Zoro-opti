export interface SystemMetrics {
  cpu: number;
  ram: number;
  disk: number;
  temperature: number;
  network: number;
  battery: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Profile {
  id: string;
  email: string;
  paid: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  activation_code: string | null;
  activated: boolean;
  created_at: string;
}

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

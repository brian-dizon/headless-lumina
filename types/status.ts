export interface ServiceStatus {
  id: string;
  name: string;
  status: "operational" | "degraded" | "major_outage" | "under_maintenance" | "unknown";
  provider: "GitHub" | "Vercel" | "AWS" | "OpenAI";
  updated_at: string;
}

export interface GlobalStatusResponse {
  services: ServiceStatus[];
}

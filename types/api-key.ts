// API Key types for managing multiple API keys with metadata

export interface ApiKey {
  id: string;
  name: string;
  host: string;
  apiKey: string;
  creditsPerMonth: number;
  creditsUsed: number;
  rpmLimit?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeySummary {
  totalCredits: number;
  creditsUsed: number;
  activeAccounts: number;
  usagePercentage: number;
}

// API Key types for managing multiple API keys with metadata

export type ServiceType = 'job-search' | 'local-business';

export interface ApiKey {
  id: string;
  name: string;
  host: string;
  apiKey: string;
  creditsPerMonth: number;
  creditsUsed: number;
  rpmLimit?: number;
  isActive: boolean;
  serviceType?: ServiceType; // Optional field to distinguish service types
  createdAt: string;
  updatedAt: string;
}

export interface ApiKeySummary {
  totalCredits: number;
  creditsUsed: number;
  activeAccounts: number;
  usagePercentage: number;
}

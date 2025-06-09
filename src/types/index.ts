
export interface APIKey {
  id: string;
  key: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  maxInstallations: number;
  currentInstallations: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date | null;
  lastUsed: Date | null;
}

export interface Installation {
  id: string;
  apiKeyId: string;
  apiKey: string;
  clientName: string;
  ipAddress: string;
  userAgent?: string;
  location?: string;
  timestamp: Date;
  success: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  status: 'active' | 'suspended' | 'blocked';
  createdAt: Date;
}

export interface DashboardMetrics {
  totalActiveKeys: number;
  installationsToday: number;
  activeClients: number;
  failedValidations: number;
}

export interface InstallationsByDay {
  date: string;
  installations: number;
}

export interface ValidationRequest {
  apiKey: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ValidationResponse {
  success: boolean;
  message: string;
  installationsLeft?: number;
}

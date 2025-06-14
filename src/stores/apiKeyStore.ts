import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { APIKey, Client, Installation, DashboardMetrics, InstallationsByDay, ValidationResponse } from '@/types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const generateAPIKey = () => 'ak_' + Array.from({ length: 28 }, () => 
  Math.random().toString(36).charAt(0)
).join('');

// Função para hidratar datas
const hydrateDates = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map(item => hydrateDates(item)) as T;
  }
  if (data && typeof data === 'object') {
    const hydrated = { ...data as Record<string, unknown> };
    for (const key in hydrated) {
      if (key === 'createdAt' || key === 'expiresAt' || key === 'lastUsed' || key === 'timestamp') {
        if (hydrated[key]) {
          hydrated[key] = new Date(hydrated[key] as string);
        }
      } else if (typeof hydrated[key] === 'object') {
        hydrated[key] = hydrateDates(hydrated[key]);
      }
    }
    return hydrated as T;
  }
  return data;
};

// Dados iniciais
const initialData = {
  apiKeys: [
    {
      id: '1',
      key: 'ak_1234567890abcdef1234567890abcdef',
      clientId: '1',
      clientName: 'TechCorp Ltd',
      clientEmail: 'admin@techcorp.com',
      maxInstallations: 50,
      currentInstallations: 23,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      expiresAt: new Date('2024-12-31'),
      lastUsed: new Date('2024-06-08')
    },
    {
      id: '2',
      key: 'ak_fedcba0987654321fedcba0987654321',
      clientId: '2',
      clientName: 'StartupXYZ',
      clientEmail: 'dev@startupxyz.io',
      maxInstallations: 10,
      currentInstallations: 8,
      isActive: true,
      createdAt: new Date('2024-03-20'),
      expiresAt: new Date('2024-09-20'),
      lastUsed: new Date('2024-06-09')
    },
    {
      id: '3',
      key: 'ak_abcdef1234567890abcdef1234567890',
      clientId: '3',
      clientName: 'Enterprise Solutions',
      clientEmail: 'it@enterprise.com',
      maxInstallations: 100,
      currentInstallations: 67,
      isActive: true,
      createdAt: new Date('2024-02-10'),
      expiresAt: null,
      lastUsed: new Date('2024-06-09')
    },
    {
      id: '4',
      key: 'ak_567890abcdef1234567890abcdef1234',
      clientId: '4',
      clientName: 'DevStudio',
      clientEmail: 'team@devstudio.dev',
      maxInstallations: 5,
      currentInstallations: 5,
      isActive: false,
      createdAt: new Date('2024-05-01'),
      expiresAt: new Date('2024-08-01'),
      lastUsed: new Date('2024-06-01')
    }
  ],
  clients: [
    {
      id: '1',
      name: 'TechCorp Ltd',
      email: 'admin@techcorp.com',
      company: 'TechCorp Ltd',
      phone: '+55 11 99999-9999',
      notes: 'Cliente premium com suporte prioritário',
      status: 'active' as const,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'StartupXYZ',
      email: 'dev@startupxyz.io',
      company: 'StartupXYZ Inc',
      phone: '+55 11 88888-8888',
      notes: 'Startup em crescimento',
      status: 'active' as const,
      createdAt: new Date('2024-03-20')
    },
    {
      id: '3',
      name: 'Enterprise Solutions',
      email: 'it@enterprise.com',
      company: 'Enterprise Solutions Corp',
      phone: '+55 11 77777-7777',
      notes: 'Grande corporação, contrato anual',
      status: 'active' as const,
      createdAt: new Date('2024-02-10')
    },
    {
      id: '4',
      name: 'DevStudio',
      email: 'team@devstudio.dev',
      company: 'DevStudio',
      phone: '+55 11 66666-6666',
      notes: 'Atingiu limite de instalações',
      status: 'suspended' as const,
      createdAt: new Date('2024-05-01')
    }
  ],
  installations: [
    {
      id: '1',
      apiKeyId: '1',
      apiKey: 'ak_1234567890abcdef1234567890abcdef',
      clientName: 'TechCorp Ltd',
      ipAddress: '192.168.1.100',
      userAgent: 'Docker/20.10.7',
      location: 'São Paulo, BR',
      timestamp: new Date('2024-06-09T10:30:00'),
      success: true
    },
    {
      id: '2',
      apiKeyId: '2',
      apiKey: 'ak_fedcba0987654321fedcba0987654321',
      clientName: 'StartupXYZ',
      ipAddress: '10.0.0.50',
      userAgent: 'Docker/24.0.2',
      location: 'Rio de Janeiro, BR',
      timestamp: new Date('2024-06-09T09:15:00'),
      success: true
    },
    {
      id: '3',
      apiKeyId: '4',
      apiKey: 'ak_567890abcdef1234567890abcdef1234',
      clientName: 'DevStudio',
      ipAddress: '172.16.0.10',
      userAgent: 'Docker/23.0.1',
      location: 'Belo Horizonte, BR',
      timestamp: new Date('2024-06-09T08:45:00'),
      success: false
    }
  ]
};

interface APIKeyStore {
  apiKeys: APIKey[];
  clients: Client[];
  installations: Installation[];
  addAPIKey: (apiKeyData: Omit<APIKey, 'id' | 'createdAt' | 'lastUsed' | 'key'>) => void;
  updateAPIKey: (id: string, updates: Partial<APIKey>) => void;
  revokeAPIKey: (id: string) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addInstallation: (installationData: Omit<Installation, 'id' | 'timestamp'>) => void;
  getDashboardMetrics: () => DashboardMetrics;
  getInstallationsByDay: () => InstallationsByDay[];
  validateAPIKey: (key: string, ipAddress?: string) => ValidationResponse;
}

export const useAPIKeyStore = create<APIKeyStore>()(
  persist(
    (set, get) => ({
      ...initialData,

      addAPIKey: (apiKeyData) => set((state) => {
        const newAPIKey: APIKey = {
          ...apiKeyData,
          id: generateId(),
          key: generateAPIKey(),
          createdAt: new Date(),
          lastUsed: null
        };
        return { apiKeys: [...state.apiKeys, newAPIKey] };
      }),

      updateAPIKey: (id, updates) => set((state) => ({
        apiKeys: state.apiKeys.map((key) => 
          key.id === id ? { ...key, ...updates } : key
        )
      })),

      revokeAPIKey: (id) => set((state) => ({
        apiKeys: state.apiKeys.map((key) => 
          key.id === id ? { ...key, isActive: false } : key
        )
      })),

      addClient: (client) => set((state) => ({ 
        clients: [...state.clients, client] 
      })),

      updateClient: (id, updates) => set((state) => ({
        clients: state.clients.map(client =>
          client.id === id ? { ...client, ...updates } : client
        )
      })),

      addInstallation: (installationData) => set((state) => {
        const newInstallation: Installation = {
          ...installationData,
          id: generateId(),
          timestamp: new Date()
        };
        return { installations: [newInstallation, ...state.installations] };
      }),

      getDashboardMetrics: () => {
        const state = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return {
          totalActiveKeys: state.apiKeys.filter(key => key.isActive).length,
          installationsToday: state.installations.filter(inst => 
            inst.timestamp >= today && inst.success
          ).length,
          activeClients: state.clients.filter(client => client.status === 'active').length,
          failedValidations: state.installations.filter(inst => !inst.success).length
        };
      },

      getInstallationsByDay: () => {
        const state = get();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        });

        return last30Days.map(date => ({
          date,
          installations: state.installations.filter(inst => {
            const timestamp = inst.timestamp instanceof Date ? inst.timestamp : new Date(inst.timestamp);
            return timestamp.toISOString().split('T')[0] === date && inst.success;
          }).length
        }));
      },

      validateAPIKey: (key, ipAddress) => {
        const state = get();
        const apiKey = state.apiKeys.find(k => k.key === key);
        
        if (!apiKey) {
          return { success: false, message: 'Chave API inválida' };
        }
        
        if (!apiKey.isActive) {
          return { success: false, message: 'Chave API revogada' };
        }
        
        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
          return { success: false, message: 'Chave API expirada' };
        }
        
        if (apiKey.currentInstallations >= apiKey.maxInstallations) {
          return { success: false, message: 'Limite de instalações atingido' };
        }
        
        return { 
          success: true, 
          message: 'Chave válida',
          installationsLeft: apiKey.maxInstallations - apiKey.currentInstallations - 1
        };
      }
    }),
    {
      name: 'api-key-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        apiKeys: state.apiKeys,
        clients: state.clients,
        installations: state.installations
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.apiKeys = hydrateDates<APIKey[]>(state.apiKeys);
          state.clients = hydrateDates<Client[]>(state.clients);
          state.installations = hydrateDates<Installation[]>(state.installations);
        }
      }
    }
  )
);

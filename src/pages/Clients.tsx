import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building, Mail, Phone } from 'lucide-react';
import { useAPIKeyStore } from '../stores/apiKeyStore';
import { CreateClientModal } from '../components/Clients/CreateClientModal';
import { EditClientModal } from '../components/Clients/EditClientModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Clients() {
  const { clients, apiKeys } = useAPIKeyStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Força uma atualização do estado para garantir que os dados estejam hidratados
      setIsLoading(false);
    } catch (err) {
      setError('Erro ao carregar os dados dos clientes. Por favor, tente novamente.');
      console.error('Erro ao carregar clientes:', err);
    }
  }, []);

  const getClientStats = (clientId: string) => {
    try {
      const clientKeys = apiKeys.filter(key => key.clientId === clientId);
      const activeKeys = clientKeys.filter(key => key.isActive).length;
      const totalInstallations = clientKeys.reduce((sum, key) => sum + key.currentInstallations, 0);
      
      return { activeKeys, totalInstallations, totalKeys: clientKeys.length };
    } catch (err) {
      console.error('Erro ao calcular estatísticas do cliente:', err);
      return { activeKeys: 0, totalInstallations: 0, totalKeys: 0 };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'suspended':
        return <Badge variant="secondary">Suspenso</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Bloqueado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  if (error) {
    return (
      <AppLayout title="Gerenciamento de Clientes">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </AppLayout>
    );
  }

  if (isLoading) {
    return (
      <AppLayout title="Gerenciamento de Clientes">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="Gerenciamento de Clientes" 
      subtitle={`${clients.length} clientes cadastrados no sistema`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {clients.filter(c => c.status === 'active').length} ativos, {clients.filter(c => c.status === 'suspended').length} suspensos
            </span>
          </div>
          <CreateClientModal />
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => {
            const stats = getClientStats(client.id);
            
            return (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                      {getStatusBadge(client.status)}
                    </div>
                    <EditClientModal client={client} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {client.company && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="mr-2 h-4 w-4" />
                        {client.company}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="mr-2 h-4 w-4" />
                      {client.email}
                    </div>
                    {client.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="mr-2 h-4 w-4" />
                        {client.phone}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{stats.activeKeys}</p>
                        <p className="text-xs text-gray-500">Chaves Ativas</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{stats.totalInstallations}</p>
                        <p className="text-xs text-gray-500">Instalações</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-600">{stats.totalKeys}</p>
                        <p className="text-xs text-gray-500">Total Chaves</p>
                      </div>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600">{client.notes}</p>
                    </div>
                  )}

                  <div className="border-t pt-3 text-xs text-gray-500">
                    Cliente desde {client.createdAt.toLocaleDateString('pt-BR')}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {clients.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cliente</h3>
            <p className="mt-1 text-sm text-gray-500">Comece criando um novo cliente.</p>
            <div className="mt-6">
              <CreateClientModal />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

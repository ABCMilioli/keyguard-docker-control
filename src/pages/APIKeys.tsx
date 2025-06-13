import React, { useState, useEffect } from 'react';
import { AppLayout } from '../components/Layout/AppLayout';
import { APIKeyTable } from '../components/APIKeys/APIKeyTable';
import { CreateAPIKeyModal } from '../components/APIKeys/CreateAPIKeyModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useAPIKeyStore } from '../stores/apiKeyStore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function APIKeys() {
  const { apiKeys } = useAPIKeyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Força uma atualização do estado para garantir que os dados estejam hidratados
      setIsLoading(false);
    } catch (err) {
      setError('Erro ao carregar as chaves API. Por favor, tente novamente.');
      console.error('Erro ao carregar chaves API:', err);
    }
  }, []);

  const filteredKeys = apiKeys.filter(key => {
    try {
      const matchesSearch = key.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           key.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && key.isActive) ||
                           (statusFilter === 'inactive' && !key.isActive);

      return matchesSearch && matchesStatus;
    } catch (err) {
      console.error('Erro ao filtrar chaves:', err);
      return false;
    }
  });

  if (error) {
    return (
      <AppLayout title="Gerenciamento de API Keys">
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
      <AppLayout title="Gerenciamento de API Keys">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="Gerenciamento de API Keys" 
      subtitle={`${apiKeys.length} chaves cadastradas no sistema`}
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por cliente ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Apenas Ativas</SelectItem>
                <SelectItem value="inactive">Apenas Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CreateAPIKeyModal />
        </div>

        {/* Table */}
        <APIKeyTable apiKeys={filteredKeys} />

        {filteredKeys.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma chave API encontrada com os filtros aplicados.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

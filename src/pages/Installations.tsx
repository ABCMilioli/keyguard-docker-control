
import React, { useState } from 'react';
import { AppLayout } from '../components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Monitor, Clock } from 'lucide-react';
import { useAPIKeyStore } from '../stores/apiKeyStore';

export default function Installations() {
  const { installations } = useAPIKeyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInstallations = installations.filter(installation => {
    const matchesSearch = installation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         installation.ipAddress.includes(searchTerm) ||
                         installation.apiKey.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'success' && installation.success) ||
                         (statusFilter === 'failed' && !installation.success);

    return matchesSearch && matchesStatus;
  });

  const successRate = installations.length > 0 
    ? Math.round((installations.filter(i => i.success).length / installations.length) * 100)
    : 0;

  return (
    <AppLayout 
      title="Log de Instalações" 
      subtitle={`${installations.length} tentativas registradas - ${successRate}% de sucesso`}
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{installations.length}</p>
                </div>
                <Monitor className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sucessos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {installations.filter(i => i.success).length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Falhas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {installations.filter(i => !i.success).length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold">{successRate}%</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por cliente, IP ou chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por resultado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Resultados</SelectItem>
              <SelectItem value="success">Apenas Sucessos</SelectItem>
              <SelectItem value="failed">Apenas Falhas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Installations Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline de Instalações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInstallations.map((installation) => (
                <div key={installation.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    installation.success 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {installation.success ? '✓' : '✗'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{installation.clientName}</p>
                        <p className="text-sm text-gray-500 font-mono">
                          {installation.apiKey.substring(0, 12)}...
                        </p>
                      </div>
                      <Badge variant={installation.success ? "default" : "destructive"}>
                        {installation.success ? "Sucesso" : "Falha"}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Monitor className="mr-1 h-4 w-4" />
                        {installation.ipAddress}
                      </div>
                      {installation.location && (
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {installation.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {installation.timestamp.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    
                    {installation.userAgent && (
                      <p className="mt-1 text-xs text-gray-400 font-mono">
                        {installation.userAgent}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredInstallations.length === 0 && (
              <div className="text-center py-12">
                <Monitor className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma instalação encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não há registros que correspondam aos filtros aplicados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

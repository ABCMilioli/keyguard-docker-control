
import React from 'react';
import { AppLayout } from '../components/Layout/AppLayout';
import { MetricCard } from '../components/Dashboard/MetricCard';
import { InstallationsChart } from '../components/Dashboard/InstallationsChart';
import { Key, Users, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAPIKeyStore } from '../stores/apiKeyStore';

export default function Dashboard() {
  const { getDashboardMetrics, getInstallationsByDay, installations, apiKeys } = useAPIKeyStore();
  const metrics = getDashboardMetrics();
  const chartData = getInstallationsByDay();
  
  const recentInstallations = installations.slice(0, 5);
  const alerts = apiKeys.filter(key => 
    key.maxInstallations - key.currentInstallations <= 2 && key.isActive
  );

  return (
    <AppLayout 
      title="Dashboard" 
      subtitle="Visão geral do sistema de distribuição Docker"
    >
      <div className="space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Chaves Ativas"
            value={metrics.totalActiveKeys}
            change={{ value: 12, type: 'increase' }}
            icon={Key}
            color="blue"
          />
          <MetricCard
            title="Instalações Hoje"
            value={metrics.installationsToday}
            change={{ value: 5, type: 'increase' }}
            icon={Activity}
            color="green"
          />
          <MetricCard
            title="Clientes Ativos"
            value={metrics.activeClients}
            change={{ value: 8, type: 'increase' }}
            icon={Users}
            color="blue"
          />
          <MetricCard
            title="Validações Negadas"
            value={metrics.failedValidations}
            change={{ value: 3, type: 'decrease' }}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InstallationsChart data={chartData} />
          
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInstallations.map((installation) => (
                  <div key={installation.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-sm">{installation.clientName}</p>
                      <p className="text-xs text-gray-500">{installation.ipAddress}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={installation.success ? "default" : "destructive"}>
                        {installation.success ? "Sucesso" : "Falha"}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {installation.timestamp.toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Alertas do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((apiKey) => (
                  <div key={apiKey.id} className="text-sm text-yellow-800">
                    <span className="font-medium">{apiKey.clientName}</span> está próximo do limite de instalações
                    ({apiKey.currentInstallations}/{apiKey.maxInstallations})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

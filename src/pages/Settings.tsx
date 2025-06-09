
import React from 'react';
import { AppLayout } from '../components/Layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, Shield, Database, Mail } from 'lucide-react';

export default function Settings() {
  return (
    <AppLayout 
      title="Configurações do Sistema" 
      subtitle="Gerencie as configurações globais do sistema de API Keys"
    >
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="mr-2 h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultInstallations">Limite Padrão de Instalações</Label>
                <Input
                  id="defaultInstallations"
                  type="number"
                  defaultValue="50"
                  placeholder="50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultExpiration">Expiração Padrão (dias)</Label>
                <Input
                  id="defaultExpiration"
                  type="number"
                  defaultValue="365"
                  placeholder="365"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoExpire">Expiração Automática</Label>
                <p className="text-sm text-gray-500">
                  Desabilitar automaticamente chaves expiradas
                </p>
              </div>
              <Switch id="autoExpire" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Configurações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rateLimiting">Rate Limiting</Label>
                <p className="text-sm text-gray-500">
                  Limitar tentativas de validação por IP
                </p>
              </div>
              <Switch id="rateLimiting" defaultChecked />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Máximo de Tentativas por Hora</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  defaultValue="100"
                  placeholder="100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="blockDuration">Duração do Bloqueio (minutos)</Label>
                <Input
                  id="blockDuration"
                  type="number"
                  defaultValue="60"
                  placeholder="60"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ipWhitelist">Lista Branca de IPs</Label>
                <p className="text-sm text-gray-500">
                  Permitir apenas IPs específicos
                </p>
              </div>
              <Switch id="ipWhitelist" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Configurações de Notificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email do Administrador</Label>
              <Input
                id="adminEmail"
                type="email"
                defaultValue="admin@exemplo.com"
                placeholder="admin@exemplo.com"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alertLimitReached">Alertas de Limite Atingido</Label>
                <p className="text-sm text-gray-500">
                  Notificar quando chaves atingirem 90% do limite
                </p>
              </div>
              <Switch id="alertLimitReached" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alertExpiration">Alertas de Expiração</Label>
                <p className="text-sm text-gray-500">
                  Notificar 7 dias antes da expiração
                </p>
              </div>
              <Switch id="alertExpiration" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="alertFailedValidations">Alertas de Validações Falhadas</Label>
                <p className="text-sm text-gray-500">
                  Notificar sobre tentativas suspeitas
                </p>
              </div>
              <Switch id="alertFailedValidations" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Gerenciamento de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Exportar Dados
              </Button>
              
              <Button variant="outline">
                <Database className="mr-2 h-4 w-4" />
                Backup Manual
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoBackup">Backup Automático</Label>
                <p className="text-sm text-gray-500">
                  Backup diário dos dados do sistema
                </p>
              </div>
              <Switch id="autoBackup" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retentionPeriod">Período de Retenção (dias)</Label>
              <Input
                id="retentionPeriod"
                type="number"
                defaultValue="90"
                placeholder="90"
              />
              <p className="text-sm text-gray-500">
                Logs de instalação serão mantidos por este período
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">
            Salvar Configurações
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

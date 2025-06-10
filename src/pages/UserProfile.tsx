import React from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Lock, Mail } from 'lucide-react';

export default function UserProfile() {
  return (
    <AppLayout
      title="Perfil do Usuário"
      subtitle="Gerencie suas informações pessoais e credenciais de acesso"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais e credenciais de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seção de Informações Pessoais */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            {/* Seção de Senha */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Digite sua senha atual"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Digite a nova senha"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirme a nova senha"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button variant="outline">Cancelar</Button>
              <Button>Salvar Alterações</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 
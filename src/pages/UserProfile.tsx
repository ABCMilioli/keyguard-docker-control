import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/Layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Lock, Mail } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { updateProfile, isLoading } = useProfile();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData(prev => ({
      ...prev,
      nome: user.nome,
      email: user.email
    }));
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Erro',
        description: 'Usuário não encontrado.',
        variant: 'destructive',
      });
      return;
    }

    // Validação de senha
    if (formData.novaSenha && formData.novaSenha !== formData.confirmarSenha) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const updateData = {
        nome: formData.nome,
        email: formData.email,
        ...(formData.novaSenha ? {
          senhaAtual: formData.senhaAtual,
          novaSenha: formData.novaSenha
        } : {})
      };

      const updatedUser = await updateProfile(user.id, updateData);
      setUser(updatedUser);

      // Limpa os campos de senha após atualização
      setFormData(prev => ({
        ...prev,
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      }));
    } catch (error) {
      // Erro já é tratado no hook
    }
  };

  if (!user) {
    return null;
  }

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
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
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
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                        value={formData.senhaAtual}
                        onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
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
                        value={formData.novaSenha}
                        onChange={(e) => handleInputChange('novaSenha', e.target.value)}
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
                        value={formData.confirmarSenha}
                        onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setFormData({
                      nome: user.nome,
                      email: user.email,
                      senhaAtual: '',
                      novaSenha: '',
                      confirmarSenha: ''
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 
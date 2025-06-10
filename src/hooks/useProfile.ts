import { useState } from 'react';
import { API_URLS } from '@/config/api';
import { useToast } from '@/hooks/use-toast';

interface UpdateProfileData {
  nome: string;
  email: string;
  senhaAtual?: string;
  novaSenha?: string;
}

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateProfile = async (userId: string, data: UpdateProfileData) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.updateProfile(userId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao atualizar perfil');
      }

      toast({
        title: 'Sucesso!',
        description: 'Perfil atualizado com sucesso.',
      });

      return responseData.user;
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
  };
} 
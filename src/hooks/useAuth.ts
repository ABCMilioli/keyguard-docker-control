import { useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { useToast } from './use-toast';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { toast } = useToast();

  const logout = () => {
    // Limpa o usuário do estado global
    setUser(null);

    // Mostra mensagem de sucesso
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });

    // Redireciona para a página de login
    navigate('/login');
  };

  return {
    logout
  };
} 
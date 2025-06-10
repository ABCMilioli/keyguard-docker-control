import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    // Redireciona para o login, mas mantém a URL original como state
    // para redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 
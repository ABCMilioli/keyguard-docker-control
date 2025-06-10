import { useState, useEffect } from 'react';
import { API_URLS } from '@/config/api';

export function useAdminStatus() {
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await fetch(`${API_URLS.adminStatus}`);
        const data = await response.json();
        setAdminExists(data.adminExists);
      } catch (err) {
        setError('Erro ao verificar status do admin');
        console.error('Erro ao verificar status do admin:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { adminExists, isLoading, error };
} 
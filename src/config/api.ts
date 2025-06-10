// Obtém as configurações do ambiente
const API_HOST = import.meta.env.VITE_API_HOST;
const USE_TLS = true; // Forçando HTTPS para produção

// Se API_HOST não estiver definido, não construímos a URL base com undefined
const API_BASE_URL = API_HOST 
  ? `https://${API_HOST}/api/v1`
  : '/api/v1'; // Fallback para rota relativa

export const API_URLS = {
  register: `${API_BASE_URL}/users/register`,
  login: `${API_BASE_URL}/users/login`,
  validateKey: `${API_BASE_URL}/validar`,
  adminStatus: `${API_BASE_URL}/admin/status`,
  updateProfile: (userId: string) => `${API_BASE_URL}/users/${userId}/profile`
}; 
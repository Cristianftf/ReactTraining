// apiService.ts
import type { User, UserDto, LoginCredentials } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// ========== 🔐 UTILIDADES DE AUTENTICACIÓN ==========
const getAuthToken = (): string | null => localStorage.getItem('token');

const decodeJWT = (token: string): any | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// ========== ⚠️ MANEJO GLOBAL DE ERRORES ==========
const handleApiError = async (response: Response): Promise<never> => {
  let message = 'Error en la solicitud';
  try {
    const data = await response.json();
    message = data.message || data.error || response.statusText;
  } catch {
    message = response.statusText || message;
  }
  throw new Error(message);
};

// ========== 🌐 FUNCIONES BASE PARA FETCH ==========
const fetchWithAuth = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) await handleApiError(response);

  // Si la respuesta no tiene contenido (204) o no es JSON, devolvemos undefined o el texto crudo
  if (response.status === 204) return undefined as unknown as T;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      // si no es JSON válido, devolvemos texto como fallback
      return text as unknown as T;
    }
  }

  return response.json() as Promise<T>;
};

// ========== 🔒 API DE AUTENTICACIÓN ==========
export const authApi = {
  /**
   * Inicia sesión en el sistema
   */
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    const data = await fetchWithAuth<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const decoded = decodeJWT(data.token);
    if (!decoded) throw new Error('Token inválido recibido del servidor');

    // Construimos el usuario desde el token (sin llamar de nuevo al backend)
    const user: User = {
      id: decoded.id || decoded.sub || 0,
      name: decoded.name || '',
      email: decoded.email || credentials.email,
      rol: decoded.rol || 'user',
      password: ''
    };

    return { token: data.token, user };
  },

  /**
   * Registra un nuevo usuario
   */
  register: async (userData: UserDto): Promise<User> => {
    return fetchWithAuth<User>('/api/users/add', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// ========== 👥 API DE USUARIOS ==========
export const usersApi = {
  getAll: (): Promise<User[]> => fetchWithAuth<User[]>('/api/users'),

  create: (userData: UserDto): Promise<User> =>
    fetchWithAuth<User>('/api/users/add', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  update: (id: number, userData: UserDto): Promise<User> =>
    fetchWithAuth<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  delete: (id: number): Promise<void> =>
    fetchWithAuth<void>(`/api/users/${id}`, {
      method: 'DELETE',
    }),
};

// ========== 📊 API DE ESTADÍSTICAS ==========
export const statsApi = {
  getOverview: (): Promise<{
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    recentSignups: number;
  }> => fetchWithAuth('/api/stats/overview'),

  getChartData: async (): Promise<
    Array<{ name: string; usuarios: number; admins: number }>
  > => {
    const data = await fetchWithAuth<any[]>('/api/stats/charts');
    return data.map((item) => ({
      name: item.monthName || item.name,
      usuarios: item.userCount || item.usuarios,
      admins: item.adminCount || item.admins,
    }));
  },
};

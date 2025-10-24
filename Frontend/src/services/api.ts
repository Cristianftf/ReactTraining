// apiService.ts
import type { User, UserDto, LoginCredentials } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const getAuthToken = (): string | null => localStorage.getItem('token');

export const decodeJWT = (token: string): any | null => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const handleApiError = async (response: Response): Promise<never> => {
  let message = 'Error en la solicitud';
  let body: any = null;
  try {
    body = await response.json();
    message = body.message || body.error || response.statusText;
  } catch {
    message = response.statusText || message;
  }
  const err: any = new Error(message);
  err.status = response.status;
  err.body = body;
  throw err;
};

const fetchWithAuth = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const baseHeaders: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  const headers: HeadersInit = { ...baseHeaders, ...authHeaders };

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
  if (!response.ok) await handleApiError(response);

  if (response.status === 204) return undefined as unknown as T;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
  }
  return response.json() as Promise<T>;
};

// ========== 🔒 API DE AUTENTICACIÓN ==========
export const authApi = {
  /**
   * Inicia sesión en el sistema (no usa fetchWithAuth porque todavía no hay token)
   */
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      let message = 'Error en login';
      try { const data = await response.json(); message = data.message || data.error || response.statusText; } catch {}
      throw new Error(message);
    }

    const data = await response.json() as { token: string };
    const decoded = decodeJWT(data.token);
    if (!decoded) throw new Error('Token inválido recibido del servidor');

    // Construimos el usuario desde el token (claims añadidos por backend)
    const user: User = {
      id: Number(decoded.id) || Number(decoded.sub) || 0,
      name: decoded.name || '',
      email: decoded.email || credentials.email,
      rol: (decoded.rol || 'user').toString() === 'admin' ? 'admin' : 'user',
      password: ''
    };

    return { token: data.token, user };
  },

  /**
   * Registra un nuevo usuario
   */
  register: async (userData: UserDto): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) await handleApiError(response);
    // backend devuelve un mensaje de éxito como texto; no necesitamos retornarlo aquí
    return;
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
  // 🔹 Endpoint corregido
  const data = await fetchWithAuth<any[]>('/api/stats/chart');

  // 🔹 Adaptamos los nombres al formato que espera Recharts
  return data.map((item) => ({
    name: item.month || item.monthName || 'Desconocido',
    usuarios: item.userCount ?? 0,
    admins: item.adminCount ?? 0,
  }));
},

};

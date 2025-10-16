// API Service - Centralizes all API calls and configuration
import type { User, UserDto, LoginCredentials } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = 'Error en la solicitud';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || response.statusText;
  } catch {
    errorMessage = response.statusText || errorMessage;
  }
  
  throw new Error(errorMessage);
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    await handleApiError(response);
  }
  
  return response;
};

// Decode JWT to get user info
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
    const response = await fetchWithAuth('/apiu/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    // Decode JWT to get user info
    const decoded = decodeJWT(data.token);
    
    // Fetch full user details
    const userResponse = await fetchWithAuth('/api/users');
    const users: User[] = await userResponse.json();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return {
      token: data.token,
      user,
    };
  },
  
  register: async (userData: UserDto): Promise<User> => {
    const response = await fetchWithAuth('/api/users/add', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    return response.json();
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetchWithAuth('/api/users');
    return response.json();
  },
  
  create: async (userData: UserDto): Promise<User> => {
    const response = await fetchWithAuth('/api/users/add', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.json();
  },
  
  update: async (id: number, userData: UserDto): Promise<User> => {
    const response = await fetchWithAuth(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.json();
  },
  
  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stats API
export const statsApi = {
  getOverview: async (): Promise<{
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    recentSignups: number;
  }> => {
    const response = await fetchWithAuth('/api/stats/overview');
    return response.json();
  },
  
  getChartData: async (): Promise<Array<{
    name: string;
    usuarios: number;
    admins: number;
  }>> => {
    const response = await fetchWithAuth('/api/stats/charts');
    const data = await response.json();
    
    // Transform backend response to match frontend expectations
    return data.map((item: any) => ({
      name: item.monthName || item.name,
      usuarios: item.userCount || item.usuarios,
      admins: item.adminCount || item.admins,
    }));
  },
};
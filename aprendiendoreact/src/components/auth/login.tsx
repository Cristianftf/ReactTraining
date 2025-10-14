// src/components/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:8000/api/auth/login', // Ajusta la URL a tu backend
        {
          username,
          password,
        }
      );

      const { token } = response.data;

      // Guardar el token (por ejemplo, en localStorage)
      localStorage.setItem('authToken', token);

      // Redirigir o actualizar estado global (ej: con Context o Redux)
      alert('¡Login exitoso!');
      // Aquí podrías redirigir al dashboard, por ejemplo:
      // navigate('/dashboard');
    } catch (err: any) {
      console.error('Error en login:', err);
      if (err.response?.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError('Error al conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default Login;
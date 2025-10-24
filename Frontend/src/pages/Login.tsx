import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../types';
import './login.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!credentials.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      setLoginError('Email o contraseña incorrectos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setLoginError('');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon-large">
                <div className="logo-gradient"></div>
              </div>
            </div>
            <h1 className="login-title">Bienvenido</h1>
            <p className="login-subtitle">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {loginError && (
              <div className="login-error-banner">
                <p>{loginError}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FiMail size={16} />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FiLock size={16} />
                <span>Contraseña</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <FiLogIn size={20} />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="demo-credentials">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="forgot-password">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiShield, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../types';
import './login.css';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'user',
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      
      setSuccessMessage('¡Registro exitoso! Redirigiendo al login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setRegisterError(error.message || 'Error al registrar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof RegisterData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setRegisterError('');
    setSuccessMessage('');
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
            <h1 className="login-title">Crear Cuenta</h1>
            <p className="login-subtitle">Completa el formulario para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {registerError && (
              <div className="login-error-banner">
                <p>{registerError}</p>
              </div>
            )}

            {successMessage && (
              <div className="login-success-banner">
                <p>{successMessage}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <FiUser size={16} />
                <span>Nombre completo</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Juan Pérez"
                autoComplete="name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FiMail size={16} />
                <span>Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <FiLock size={16} />
                <span>Confirmar contraseña</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rol" className="form-label">
                <FiShield size={16} />
                <span>Rol</span>
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="form-input"
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <FiUserPlus size={20} />
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="demo-credentials">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="forgot-password">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
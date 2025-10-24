import { useState, useEffect } from 'react';
import { FiX, FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';
import type { User, UserDto } from '../../types';
import './userModal.css';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: UserDto, id?: number) => Promise<void>;
  user?: User | null;
  mode: 'create' | 'edit';
}

export function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState<UserDto>({
    name: '',
    email: '',
    password: '',
    rol: 'user'
  });
  const [errors, setErrors] = useState<Partial<UserDto>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        rol: user.rol
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        rol: 'user'
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserDto> = {};

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

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData, user?.id);
      onClose();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof UserDto]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">
              <FiUser size={24} />
            </div>
            <div>
              <h2 className="modal-title">
                {mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
              </h2>
              <p className="modal-subtitle">
                {mode === 'create' 
                  ? 'Completa los datos para crear un nuevo usuario'
                  : 'Actualiza la información del usuario'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <FiUser size={16} />
              <span>Nombre completo</span>
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Ej: Juan Pérez"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <FiMail size={16} />
              <span>Email</span>
              <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FiLock size={16} />
              <span>Contraseña</span>
              {mode === 'create' && <span className="required">*</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder={mode === 'edit' ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            {mode === 'edit' && !errors.password && (
              <span className="form-hint">Deja este campo vacío si no deseas cambiar la contraseña</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="rol" className="form-label">
              <FiShield size={16} />
              <span>Rol</span>
              <span className="required">*</span>
            </label>
            <select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="form-select"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
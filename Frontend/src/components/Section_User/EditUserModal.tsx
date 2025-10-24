// src/components/UserFormModal.tsx
import React, { useState, useEffect } from 'react';
import { User } from '../../types';

interface UserFormModalProps {
  userToEdit?: User | null;
  // onSave acepta tanto creación (sin id, password opcional) como edición (incluye id)
  onSave: (user: { name: string; email: string; rol: User['rol']; id?: number; password?: string }) => void;
  onClose: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ userToEdit, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<User['rol']>(() => (userToEdit ? userToEdit.rol : 'user'));





  //esto es para
  //inicializar los campos del formulario si se está editando un usuario
  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRol(userToEdit.rol);
    }
  }, [userToEdit]);





  //esto es para manejar el submit del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !rol) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const userData = userToEdit
      ? { ...userToEdit, name, email, rol }
      : { name, email, rol };

    onSave(userData);
    onClose();
  };







  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Rol</label>
          <select value={rol} onChange={(e) => setRol(e.target.value as User['rol'])}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>

          <div className="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

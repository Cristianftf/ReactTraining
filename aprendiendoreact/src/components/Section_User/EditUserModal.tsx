// src/components/UserFormModal.tsx
import React, { useState, useEffect } from 'react';
import { User } from '../../types';

interface UserFormModalProps {
  userToEdit?: User | null;
  onSave: (user: Omit<User, 'id'> | User) => void;
  onClose: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ userToEdit, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRol(userToEdit.rol);
    }
  }, [userToEdit]);

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
          <input value={rol} onChange={(e) => setRol(e.target.value)} />

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

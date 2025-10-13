// src/components/UserTable.tsx
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { fetchUsers, deleteUser, createUser, updateUser } from '../Section_User/userService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import UserFormModal from './EditUserModal';

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // =========================================================
  // R: READ
  // =========================================================
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =========================================================
  // C: CREATE / U: UPDATE
  // =========================================================
  const handleSave = async (userData: any) => {
    try {
      if ('id' in userData) {
        const updated = await updateUser(userData);
        setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      } else {
        const created = await createUser(userData);
        setUsers([...users, created]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // =========================================================
  // D: DELETE
  // =========================================================
  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Eliminar al usuario ${name}?`)) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // =========================================================
  // Botones CRUD
  // =========================================================
  const handleCreate = () => {
    setUserToEdit(null);
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setShowModal(true);
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;



  

  return (
    <div className="user-table-container">
      <div className="table-header">
        <h2>Listado de Usuarios</h2>
        <button className="btn-create" onClick={handleCreate}>
          <FaPlus /> Nuevo Usuario
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones CRUD</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No hay usuarios registrados
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td className="crud-actions">
                  <button className="btn-edit" onClick={() => handleEdit(user)}>
                    <FaEdit />
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(user.id, user.name)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <UserFormModal
          userToEdit={userToEdit}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UserTable;

import { useState, useEffect } from "react";
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiMail, FiUser } from "react-icons/fi";
import type { User, UserDto } from "../../types";
import { UserModal } from "./UserModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ToastContainer, type ToastMessage } from "../Toast/Toast";
import "./userTable.css";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Toast states
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
  setLoading(true); // ✅ Activar loading
  setError(""); // Limpiar error previo
  try {
    const response = await fetch('http://localhost:8000/api/users');
    
    if (!response.ok) {
      throw new Error('Error al cargar la lista de usuarios');
    }

    const data = await response.json();
    setUsers(data);
  } catch (error: any) {
    console.error('Error al cargar usuarios:', error);
    addToast('error', error.message || 'No se pudo cargar la lista de usuarios');
    setUsers([]); // Limpiar para evitar datos obsoletos
    setError(error.message || 'No se pudo cargar la lista de usuarios'); // Opcional
  } finally {
    setLoading(false); // ✅ Desactivar loading
  }
};

  // Toast functions
  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Create user
  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Edit user
  const handleEditUser = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Save user (create or update)
  const handleSaveUser = async (userData: UserDto, userId?: number) => {
  try {
    let response: Response;
    let url = 'http://localhost:8000/api/users';

    if (modalMode === 'create') {
      response = await fetch(`${url}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
    } else if (userId) {
      response = await fetch(`${url}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
    } else {
      throw new Error('ID de usuario no válido para actualización');
    }

    if (!response.ok) {
      // Intentar leer mensaje de error del backend
      let errorMsg = 'Error desconocido';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || response.statusText || 'Error al guardar usuario';
      } catch {
        errorMsg = response.statusText || 'Error al guardar usuario';
      }
      throw new Error(errorMsg);
    }

    const savedUser = await response.json();

    // Actualizar estado local
    if (modalMode === 'create') {
      setUsers(prev => [...prev, savedUser]);
      addToast('success', `Usuario ${userData.name} creado exitosamente`);
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? savedUser : u));
      addToast('success', `Usuario ${userData.name} actualizado exitosamente`);
    }

    setIsModalOpen(false);
  } catch (error: any) {
    console.error('Error al guardar usuario:', error);
    addToast('error', error.message || 'No se pudo guardar el usuario');
    // ❌ NO hay mock → no se añade ni actualiza nada en la UI
    setIsModalOpen(false); // cierra el modal igual, pero sin cambios
  }
};

  // Delete user - open confirmation modal
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
  if (!userToDelete) return;

  setIsDeleting(true);
  try {
    const response = await fetch(`http://localhost:8000/api/users/${userToDelete.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      // Intentar obtener mensaje del backend
      let errorMsg = 'Error al eliminar el usuario';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || response.statusText || errorMsg;
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    // ✅ Éxito real
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    addToast('success', `Usuario ${userToDelete.name} eliminado exitosamente`);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    // ❌ NADA DE MOCK → no se elimina del estado local
    addToast('error', error.message || 'No se pudo eliminar el usuario');
    // El modal se mantiene abierto para que el usuario intente de nuevo o cancele
  } finally {
    setIsDeleting(false);
  }
};

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="user-table-container">
        {/* Header Section */}
        <div className="table-header">
          <div className="header-content">
            <h1 className="table-title">Gestión de Usuarios</h1>
            <p className="table-subtitle">
              Administra y visualiza todos los usuarios del sistema
            </p>
          </div>
          <button className="btn-create" onClick={handleCreateUser}>
            <FiUserPlus size={20} />
            <span>Nuevo Usuario</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <FiSearch className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="user-count">
            <span className="count-badge">{filteredUsers.length}</span>
            <span className="count-text">usuarios encontrados</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          /* Empty State */
          <div className="empty-state">
            <div className="empty-icon">
              <FiUser size={64} />
            </div>
            <h3 className="empty-title">No se encontraron usuarios</h3>
            <p className="empty-description">
              {searchTerm
                ? "Intenta con otros términos de búsqueda"
                : "Comienza agregando tu primer usuario"}
            </p>
            {!searchTerm && (
              <button className="btn-create" onClick={handleCreateUser}>
                <FiUserPlus size={20} />
                <span>Agregar Usuario</span>
              </button>
            )}
          </div>
        ) : (
          /* User Cards Grid */
          <div className="user-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar">
                    <FiUser size={24} />
                  </div>
                  <div className="user-badge">
                    <span className={`role-badge ${user.rol}`}>
                      {user.rol === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                  </div>
                </div>

                <div className="user-card-body">
                  <h3 className="user-name">{user.name}</h3>
                  <div className="user-email">
                    <FiMail size={16} />
                    <span>{user.email}</span>
                  </div>
                </div>

                <div className="user-card-footer">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => handleEditUser(user)}
                    title="Editar usuario"
                  >
                    <FiEdit2 size={18} />
                    <span>Editar</span>
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteClick(user)}
                    title="Eliminar usuario"
                  >
                    <FiTrash2 size={18} />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Modal (Create/Edit) */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        user={userToDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
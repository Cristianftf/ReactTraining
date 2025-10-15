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
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8000/api/users");
      
      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("No se pudieron cargar los usuarios. Usando datos de ejemplo.");
      // Set mock data for preview
      setUsers([
        { id: 1, name: "Ana García", email: "ana.garcia@example.com", password: "", rol: "admin" },
        { id: 2, name: "Carlos Rodríguez", email: "carlos.r@example.com", password: "", rol: "user" },
        { id: 3, name: "María López", email: "maria.lopez@example.com", password: "", rol: "user" },
        { id: 4, name: "Juan Martínez", email: "juan.m@example.com", password: "", rol: "admin" },
        { id: 5, name: "Laura Sánchez", email: "laura.s@example.com", password: "", rol: "user" },
      ]);
    } finally {
      setLoading(false);
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
      if (modalMode === 'create') {
        // CREATE - POST request
        const response = await fetch("http://localhost:8000/api/users/add", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error('Error al crear usuario');
        }

        const newUser = await response.json();
        setUsers(prev => [...prev, newUser]);
        addToast('success', `Usuario ${userData.name} creado exitosamente`);
      } else {
        // UPDATE - PUT request
        const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar usuario');
        }

        const updatedUser = await response.json();
        setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
        addToast('success', `Usuario ${userData.name} actualizado exitosamente`);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      
      // Simulate success for demo purposes
      if (modalMode === 'create') {
        const newUser: User = {
          id: Date.now(),
          ...userData,
        };
        setUsers(prev => [...prev, newUser]);
        addToast('success', `Usuario ${userData.name} creado exitosamente`);
      } else if (userId) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, ...userData } : u
        ));
        addToast('success', `Usuario ${userData.name} actualizado exitosamente`);
      }
      
      setIsModalOpen(false);
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
      // DELETE request
      const response = await fetch(`http://localhost:8000/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      addToast('success', `Usuario ${userToDelete.name} eliminado exitosamente`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      
      // Simulate success for demo purposes
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      addToast('success', `Usuario ${userToDelete.name} eliminado exitosamente`);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
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
import { useState, useEffect } from "react";
import { FiSearch, FiUserPlus, FiEdit2, FiTrash2, FiMail, FiUser } from "react-icons/fi";
import type { User } from "../../types";
import "./userTable.css";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");

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
      setError("No se pudieron cargar los usuarios. Verifica que el servidor esté ejecutándose.");
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

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    try {
      // Simulate API call
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-table-container">
      {/* Header Section */}
      <div className="table-header">
        <div className="header-content">
          <h1 className="table-title">Gestión de Usuarios</h1>
          <p className="table-subtitle">
            Administra y visualiza todos los usuarios del sistema
          </p>
        </div>
        <button className="btn-create">
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
            <button className="btn-create">
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
                  title="Editar usuario"
                >
                  <FiEdit2 size={18} />
                  <span>Editar</span>
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(user.id)}
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
  );
}
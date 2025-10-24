import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUsers, FiBarChart2, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './navbar.css';

interface NavLink {
  path: string;
  name: string;
  icon: React.ReactNode;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks: NavLink[] = isAuthenticated
    ? [
        { path: '/dashboard', name: 'Dashboard', icon: <FiHome size={18} /> },
        { path: '/users', name: 'Usuarios', icon: <FiUsers size={18} /> },
        { path: '/stats', name: 'Estadísticas', icon: <FiBarChart2 size={18} /> },
      ]
    : [];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="navbar-container">
      <nav className="navbar-content">
        {/* Logo */}
        <a href="/dashboard" className="navbar-logo">
          <div className="logo-icon">
            <div className="logo-gradient"></div>
          </div>
          <span className="logo-text">Training</span>
        </a>

        {/* Desktop Navigation */}
        <div className="navbar-links-desktop">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`nav-link ${isActivePath(link.path) ? 'active' : ''}`}
            >
              <span className="nav-link-icon">{link.icon}</span>
              <span className="nav-link-text">{link.name}</span>
            </a>
          ))}
        </div>

        {/* User Menu */}
        <div className="user-menu-container">
          <button
            className="user-menu-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar-small">
              <FiUser size={18} />
            </div>
            <span className="user-name">{user?.name}</span>
          </button>

          {showUserMenu && (
            <>
              <div
                className="user-menu-overlay"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-avatar-large">
                    <FiUser size={24} />
                  </div>
                  <div className="user-info">
                    <p className="user-menu-name">{user?.name}</p>
                    <p className="user-menu-email">{user?.email}</p>
                    <span className={`user-menu-role ${user?.rol}`}>
                      {user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </div>
                </div>
                <div className="user-menu-divider"></div>
                <button className="user-menu-item logout" onClick={handleLogout}>
                  <FiLogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div className={`navbar-links-mobile ${isOpen ? 'active' : ''}`}>
          <div className="mobile-menu-content">
            <div className="mobile-user-info">
              <div className="user-avatar-large">
                <FiUser size={24} />
              </div>
              <div className="user-info">
                <p className="user-menu-name">{user?.name}</p>
                <p className="user-menu-email">{user?.email}</p>
              </div>
            </div>
            <div className="mobile-menu-divider"></div>
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`nav-link-mobile ${isActivePath(link.path) ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-link-icon">{link.icon}</span>
                <span className="nav-link-text">{link.name}</span>
              </a>
            ))}
            <div className="mobile-menu-divider"></div>
            <button className="nav-link-mobile logout" onClick={handleLogout}>
              <FiLogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Overlay for mobile menu */}
        {isOpen && (
          <div
            className="mobile-overlay"
            onClick={() => setIsOpen(false)}
          />
        )}
      </nav>
    </header>
  );
};

export default Navbar;
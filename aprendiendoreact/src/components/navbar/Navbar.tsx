import { useState } from 'react';
import { FiMenu, FiX, FiHome, FiPackage, FiSettings, FiMail, FiLogIn } from 'react-icons/fi';
import './navbar.css';

interface NavLink {
  path: string;
  name: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { path: '/', name: 'Inicio', icon: <FiHome size={18} /> },
  { path: '/productos', name: 'Productos', icon: <FiPackage size={18} /> },
  { path: '/servicios', name: 'Servicios', icon: <FiSettings size={18} /> },
  { path: '/contacto', name: 'Contacto', icon: <FiMail size={18} /> },
  { path: '/login', name: 'Login', icon: <FiLogIn size={18} /> },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="navbar-container">
      <nav className="navbar-content">
        {/* Logo */}
        <a href="/" className="navbar-logo">
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
              className="nav-link"
            >
              <span className="nav-link-icon">{link.icon}</span>
              <span className="nav-link-text">{link.name}</span>
            </a>
          ))}
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
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="nav-link-mobile"
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-link-icon">{link.icon}</span>
                <span className="nav-link-text">{link.name}</span>
              </a>
            ))}
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
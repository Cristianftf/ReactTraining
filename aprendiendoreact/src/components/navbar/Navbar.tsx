// src/components/Navbar.tsx
import React, { useState } from 'react';
import './Navbar.css'; 


// Define la estructura de los enlaces
interface NavLink {
  path: string;
  name: string;
}

const navLinks: NavLink[] = [
  { path: '/', name: 'Inicio' },
  { path: '/productos', name: 'Productos' },
  { path: '/servicios', name: 'Servicios' },
  { path: '/contacto', name: 'Contacto' },
  {path:'/login',name:'Login'}
];

const Navbar: React.FC = () => {
  // Estado para controlar la apertura/cierre del menú móvil
  const [isOpen, setIsOpen] = useState(false);

  // Función para alternar el estado (abrir/cerrar)
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };







  return (
    <header className="navbar-container">
      
      {/* Logo o Nombre del Sitio */}
      <a href="/" className="navbar-logo">
        Training
      </a>

      {/* Botón de Menú Hamburguesa (solo visible en móvil) */}
      <button 
        className="menu-icon" 
        onClick={toggleMenu} 
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {/* Muestra un icono X si está abierto, el icono de barras si está cerrado */}
        {isOpen ? '✖' : '☰'}
      </button>

      {/* Lista de Enlaces (la parte interactiva y responsiva) */}
      <nav className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              {/* Nota: En una app real de React, usa <Link to={link.path}> de react-router-dom */}
              <a href={link.path} onClick={() => setIsOpen(false)}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
    </header>
  );
};

export default Navbar;
// components/Navbar.tsx
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <a href="/" className="nav-link">Home</a>
        <a href="/profile" className="nav-link">Profil</a>
        <a href="/market" className="nav-link">Market</a>
      </div>
    </nav>
  );
};

export default Navbar;

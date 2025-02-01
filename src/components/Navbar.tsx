// components/Navbar.tsx
import React from 'react';
import './Navbar.css';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/profile" className="nav-link">Profil</Link>
        <Link href="/market" className="nav-link">Market</Link>
      </div>
    </nav>
  );
};

export default Navbar;

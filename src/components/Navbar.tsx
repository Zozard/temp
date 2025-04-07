// components/Navbar.tsx
import React from 'react';
import './Navbar.css';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/profile" className="nav-link">Profile</Link>
        <Link href="/market" className="nav-link">Market</Link>
        <Link href="/mycards" className="nav-link">My Cards</Link>
      </div>
    </nav>
  );
};

export default Navbar;

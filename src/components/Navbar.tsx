// components/Navbar.tsx
import React from "react";
import "./Navbar.css";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link href="/" className="nav-link">
          Home
        </Link>
        <Link href="/market" className="nav-link">
          Market
        </Link>
        <Link href="/mycards" className="nav-link">
          My Cards
        </Link>
        <Link href="/notifications" className="nav-link">
          Notifications
        </Link>
        <Link href="/profile" className="nav-link">
          Profile
        </Link>
        <Link href="/groups" className="nav-link">
          Groups
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

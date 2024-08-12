import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="logo" />
      </div>
      <ul className="navbar-menu">
      <li><Link to="/">홈</Link></li>
        <li><Link to="/destinations">이제 뭐하지?</Link></li>
        <li><Link to="/events">나만의 코스</Link></li>
        <li><Link to="/culture">맞춤형 코스</Link></li>
        <li><Link to="/travel-info">명예의 코스</Link></li>
        <li><Link to="/my-course">나의 코스</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

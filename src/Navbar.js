import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './logo.png';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isRestaurantPage = location.pathname === '/restaurants';
  const isPlacePage = location.pathname === '/place';
  const isSleepPage = location.pathname === '/sleep';
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {isRestaurantPage || isPlacePage || isSleepPage ? (
          <img src={logo} alt="logo" />
        ) : (
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        )}
      </div>
      {!isRestaurantPage && !isPlacePage && !isSleepPage && (
      <ul className="navbar-menu">
        <li><Link to="/events">코스 짜보소</Link></li>
        <li><Link to="/destinations">이제 뭐하노?</Link></li>
        <li><Link to="/culture">이렇게 가보소</Link></li>
        <li><Link to="/travel-info">유튜바 코스</Link></li>
        <li><Link to="/my-course">나의 코스</Link></li>
      </ul>
      )}
    </nav>
  );
}

export default Navbar;

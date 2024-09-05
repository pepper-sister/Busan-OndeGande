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
        <li><Link to="/makingcourse">코스 짜보소</Link></li>
        <li><Link to="/doingnow">이제 뭐하노?</Link></li>
        <li><Link to="/gothis">이렇게 가보소</Link></li>
        <li><Link to="/youtuber">유튜바 코스</Link></li>
      </ul>
      )}
    </nav>
  );
}

export default Navbar;

import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

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
          <a href="/">
            <img src={logo} alt="logo" />
          </a>
        )}
      </div>
      {!isRestaurantPage && !isPlacePage && !isSleepPage && (
        <ul className="navbar-menu">
          <li className={location.pathname === '/makingcourse' ? 'active' : ''}>
            <a href="/makingcourse">코스 짜보이소</a>
          </li>
          <li className={location.pathname === '/doingnow' ? 'active' : ''}>
            <a href="/doingnow">인자 머하노?</a>
          </li>
          <li className={location.pathname === '/gothis' ? 'active' : ''}>
            <a href="/gothis">이래 가보이소</a>
          </li>
          <li className={location.pathname === '/youtuber' ? 'active' : ''}>
            <a href="/youtuber">유튜바 코스</a>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();

  const isRestaurantPage = location.pathname === '/restaurantwindow';
  const isPlacePage = location.pathname === '/placewindow';
  const isSleepPage = location.pathname === '/sleepwindow';

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
          <li className={location.pathname === '/makingcourse' ? 'active' : ''}>
            <Link to="/makingcourse">코스 짜보이소</Link>
          </li>
          <li className={location.pathname === '/doingnow' ? 'active' : ''}>
            <Link to="/doingnow">인자 머하노?</Link>
          </li>
          <li className={location.pathname === '/gothis' ? 'active' : ''}>
            <Link to="/gothis">이래 가보이소</Link>
          </li>
          <li className={location.pathname === '/youtuber' ? 'active' : ''}>
            <Link to="/youtuber">유튜바 코스</Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
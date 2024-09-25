import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from './logo.png';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isRestaurantPage = location.pathname === '/restaurants';
  const isPlacePage = location.pathname === '/place';
  const isSleepPage = location.pathname === '/sleep';

  const handleLinkClick = (path) => {
    if (location.pathname === path) {
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {isRestaurantPage || isPlacePage || isSleepPage ? (
          <img src={logo} alt="logo" />
        ) : (
          <Link to="/" onClick={() => handleLinkClick('/')}>
            <img src={logo} alt="logo" />
          </Link>
        )}
      </div>
      {!isRestaurantPage && !isPlacePage && !isSleepPage && (
      <ul className="navbar-menu">
        <li className={location.pathname === '/makingcourse' ? 'active' : ''}>
        <Link to="/makingcourse" onClick={() => handleLinkClick('/makingcourse')}>코스 짜보이소</Link>
        </li>
        <li className={location.pathname === '/doingnow' ? 'active' : ''}>
        <Link to="/doingnow" onClick={() => handleLinkClick('/doingnow')}>인자 머하노?</Link>
        </li>
        <li className={location.pathname === '/gothis' ? 'active' : ''}>
        <Link to="/gothis" onClick={() => handleLinkClick('/gothis')}>이래 가보이소</Link>
        </li>
        <li className={location.pathname === '/youtuber' ? 'active' : ''}>
        <Link to="/youtuber" onClick={() => handleLinkClick('/youtuber')}>유튜바 코스</Link>
        </li>
      </ul>    
      )}
    </nav>
  );
}

export default Navbar;

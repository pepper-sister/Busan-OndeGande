import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();

  const hiddenPages = ['/restaurants', '/place', '/sleep'];
  const isHiddenPage = hiddenPages.includes(location.pathname);

  const isPopup = window.opener !== null;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
      {isHiddenPage || isPopup ? (
          <img src={logo} alt="logo" />
        ) : (
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        )}
      </div>

      {!isHiddenPage && !isPopup && (
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
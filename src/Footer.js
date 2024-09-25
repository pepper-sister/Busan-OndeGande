import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>ⓒ 2024. Busan's OndeGande All rights reserved.</p>
        <p>Contact: ondegande010203@gmail.com</p>
        <div className="icon-links">
          <span>Icons by:</span>
          <a href="https://kr.freepik.com/icon/chef-hat_1249659">smalllikeart</a>,
          <a href="https://kr.freepik.com/icon/fuji-mountain_6094022">smalllikeart</a>,
          <a href="https://kr.freepik.com/icon/hostel_1252011">smalllikeart</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

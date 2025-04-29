import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="nav-left">
          <nav className="nav">
            <ul>
              <li><a href="/" className="active">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </div>
        <div className="auth-buttons">
          <button className="btn-login">Sign in</button>
          <button className="btn-signup">Sign up</button>
        </div>
      </div>
    </header>
  );
}

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="header-nav">
        <ul className="header-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/men-products">Men's</Link></li>
          <li><Link to="/women-products">Women's</Link></li>
          <li><Link to="/product-input">Add Product</Link></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

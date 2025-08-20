import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ username, isLoggedIn, setIsLoggedIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-profile')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // const toggleCategories = () => {
  //   setIsCategoriesOpen(!isCategoriesOpen);
  // };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const fetchData = async (category) => {
    try {
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
      const response = await fetch(`${BACKEND_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Store the fetched data in localStorage or sessionStorage
      // This will be used by MensProductList and WomenProductList components
      const filteredData = data.filter(product => {
        const productCategory = product.category?.toLowerCase();
        const gender = product.gender?.toLowerCase();
        const tags = product.tags || [];
        
        if (category === 'men') {
          return productCategory === 'men' || 
                 productCategory?.includes('men') || 
                 gender === 'men' || 
                 gender === 'male' ||
                 tags.some(tag => tag.toLowerCase().includes('men'));
        } else if (category === 'women') {
          return productCategory === 'women' || 
                 productCategory?.includes('women') || 
                 gender === 'women' || 
                 gender === 'female' ||
                 tags.some(tag => tag.toLowerCase().includes('women'));
        }
        return true;
      });
      
      sessionStorage.setItem(`${category}Products`, JSON.stringify(filteredData));
      
      // Trigger a custom event to notify components about data update
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { category, products: filteredData } 
      }));
      
    } catch (error) {
      console.error(`Error fetching ${category} products:`, error);
    }
  };

  const handleMenProductsClick = () => {
    fetchData('men');
    navigate('/men-products');
    setIsMenuOpen(false);
  };

  const handlebagsProductsClick = () => {
    fetchData('Bags');
    navigate('/bags');
    setIsMenuOpen(false);
  };

  const handleWomenProductsClick = () => {
    fetchData('women');
    navigate('/women-products');
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-text">
            <span className="logo-primary">SHOP</span>
            <span className="logo-secondary">NOW</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
        </div>

        {/* Navigation */}
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li className="nav-item-dropdown">
              <Link to="/products" className="nav-link">Products</Link>
              <div className="dropdown-menu">
                <Link to="/men-products" className="dropdown-link" onClick={handleMenProductsClick}>Men's Fashion</Link>
                <Link to="/women-products" className="dropdown-link" onClick={handleWomenProductsClick}>Women's Fashion</Link>
                <Link to="/products" className="dropdown-link">All Products</Link>
              </div>
            </li>
            <li className="nav-item-dropdown">
            <li><Link to="/categories" className="nav-link">Categories</Link></li>
              <div className="dropdown-menu">
                <Link to="/bags" className="dropdown-link" onClick={handlebagsProductsClick}>Bags</Link>
                <Link to="/kidwears" className="dropdown-link" onClick={handleWomenProductsClick}>Kidswear</Link>
                <Link to="/electronics" className="dropdown-link">Electronics</Link>
              </div>
              </li>
            <li><Link to="/deals" className="nav-link">Deals</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
          </ul>
        </nav>

        {/* User Actions */}
        <div className="user-actions">
          {isLoggedIn ? (
            <div className="user-profile">
              <button className="user-profile-btn" onClick={toggleUserMenu}>
                <div className="user-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="username">{username}</span>
                <svg className={`dropdown-arrow ${isUserMenuOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              <div className={`user-dropdown ${isUserMenuOpen ? 'open' : ''}`}>
                <div className="user-info">
                  <div className="user-info-avatar">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="user-info-details">
                    <div className="user-info-name">{username}</div>
                    <div className="user-info-status">Online</div>
                  </div>
                </div>
                
                <div className="user-dropdown-links">
                  <Link to="/profile" className="dropdown-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    My Orders
                  </Link>
                  <Link to="/wishlist" className="dropdown-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Wishlist
                  </Link>
                  <Link to="/settings" className="dropdown-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    Settings
                  </Link>
                </div>
                
                <div className="user-dropdown-divider"></div>
                
                <button className="logout-btn" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="action-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
              
              <Link to="/cart" className="action-btn cart-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="cart-count">0</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-overlay" onClick={toggleMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleMenu}>×</button>
            <ul className="mobile-nav-list">
              <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
              <li><Link to="/men-products" onClick={(e) => { e.preventDefault(); handleMenProductsClick(); }}>Men's</Link></li>
              <li><Link to="/women-products" onClick={(e) => { e.preventDefault(); handleWomenProductsClick(); }}>Women's</Link></li>
              <li><Link to="/products" onClick={toggleMenu}>All Products</Link></li>
              <li>
                <Link to="/categories" onClick={toggleMenu}>Categories</Link>
                <ul className="mobile-sub-nav">
                  <li><Link to="/bags" onClick={(e) => { e.preventDefault(); handlebagsProductsClick(); }}>Bags</Link></li>
                  <li><Link to="/kidwears" onClick={(e) => { e.preventDefault(); handleWomenProductsClick(); }}>Kidswear</Link></li>
                  <li><Link to="/electronics" onClick={toggleMenu}>Electronics</Link></li>
                </ul>
              </li>
              <li><Link to="/deals" onClick={toggleMenu}>Deals</Link></li>
              <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
              {isLoggedIn && (
                <>
                  <li><Link to="/profile" onClick={toggleMenu}>My Profile</Link></li>
                  <li><Link to="/orders" onClick={toggleMenu}>My Orders</Link></li>
                  <li><button onClick={() => { handleLogout(); toggleMenu(); }}>Sign Out</button></li>
                </>
              )}
              {!isLoggedIn && (
                <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

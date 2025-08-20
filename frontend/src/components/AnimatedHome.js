import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AnimatedHome.css';

const AnimatedHome = ({ products }) => {
  const [animatedProducts, setAnimatedProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Animate products on load
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 6);
      setAnimatedProducts(shuffled);
    }
  }, [products]);

  const featuredProducts = animatedProducts.slice(0, 3);
  const hopeMessages = [
    "Discover Your Style",
    "Fashion That Inspires",
    "Wear Your Dreams",
    "Confidence in Every Stitch",
    "Where Style Meets Comfort"
  ];

  return (
    <div className="animated-home">
      {/* Hero Section with Animation */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-word">Faith</span>
            <span className="title-word">Fuel</span>
          </h1>
          <p className="hero-subtitle">{hopeMessages[currentSlide]}</p>
          <div className="hero-cta">
            <Link to="/men-products" className="cta-button men-btn">
              <span>Men's Collection</span>
            </Link>
            <Link to="/women-products" className="cta-button women-btn">
              <span>Women's Collection</span>
            </Link>
          </div>
        </div>
        <div className="floating-products">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className={`floating-product product-${index}`}
              style={{
                animationDelay: `${index * 0.5}s`,
                left: `${20 + index * 25}%`,
                top: `${20 + (index % 2) * 30}%`
              }}
            >
              <img 
                src={`${process.env.REACT_APP_BACKEND_URL || ''}${product.image}`} 
                alt={product.name}
                className="floating-image"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Animated Product Grid */}
      <section className="product-showcase">
        <h2 className="section-title">Featured Hope Collection</h2>
        <div className="product-grid">
          {animatedProducts.map((product, index) => (
            <div 
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${index * 0.2}s` }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="product-image-container">
                <img 
                  src={`${process.env.REACT_APP_BACKEND_URL || ''}${product.image}`} 
                  alt={product.name}
                  className="product-image"
                />
                <div className={`product-overlay ${hoveredProduct === product.id ? 'visible' : ''}`}>
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description || 'Stylish and comfortable'}</p>
                  <Link to={`/${product.category === 'Men' ? 'men' : 'women'}-products`} className="view-button">
                    View Collection
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hope Animation Section */}
      <section className="hope-animation">
        <div className="hope-messages">
          {hopeMessages.map((message, index) => (
            <div 
              key={index} 
              className={`hope-message ${index === currentSlide ? 'active' : ''}`}
            >
              {message}
            </div>
          ))}
        </div>
      </section>

      {/* Animated Background Elements */}
      <div className="animated-bg">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>
    </div>
  );
};

export default AnimatedHome;

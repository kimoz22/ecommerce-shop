import React, { useState } from 'react';
import './WomenProductList.css';

// Backend URL for Vercel deployment
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const MensProductList = ({ products, addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Men');
  const [sortBy, setSortBy] = useState('name');

  // Filter women products
   const menProducts = products.filter(product => 
     product.category?.toLowerCase().includes('men') || 
     product.gender?.toLowerCase() === 'Men' ||
     product.tags?.some(tag => tag.toLowerCase().includes('men'))
   )

  // Filter by category
  const filteredProducts = filterCategory === 'all' 
    ? menProducts 
    : menProducts.filter(product => product.category === filterCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  const handleImageClick = (product) => {
    setSelectedProduct(product);
  };

  const closeDialog = () => {
    setSelectedProduct(null);
  };

  const categories = [...new Set(menProducts.map(p => p.category).filter(Boolean))];

  return (
    <div className="women-product-container">
      <div className="women-header">
        <h1>Men's Collection</h1>
        <p className="women-subtitle">Discover the latest trends in Men's fashion</p>
      </div>

      <div className="women-product-grid">
        {sortedProducts.map(product => (
          <div key={product.id} className="women-product-card">
            <div className="product-image-container">
              <img
                src={`${BACKEND_URL}${product.image}`}
                alt={product.name}
                onClick={() => handleImageClick(product)}
                className="product-image"
              />
              {product.badge && (
                <span className="product-badge">{product.badge}</span>
              )}
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>            
              <div className="product-actions">
                <button 
                  onClick={() => {
                   // addToCart(product);
                    window.open(product.linkValue || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                  }}
                  className="add-to-cart-btn"
                >
                  Order Here
                </button>  
                <button 
                  onClick={() => {
                   // addToCart(product);
                    window.open(product.linkshop || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                  }}
                  className="add-to-cart-btn"
                >
                  Visit Shop
                </button>           
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="women-dialog-overlay" onClick={closeDialog}>
          <div className="women-dialog-content" onClick={e => e.stopPropagation()}>
            <button className="close-dialog" onClick={closeDialog}>×</button>
            
            <div className="dialog-product-image">
              <img 
                src={`${BACKEND_URL}${selectedProduct.image}`} 
                alt={selectedProduct.name} 
              />
            </div>
            
            <div className="dialog-product-info">
              <h2>{selectedProduct.name}</h2>                          
              {selectedProduct.details && (
                <div className="product-details">
                  <h4>Product Details</h4>
                  <ul>
                    {Object.entries(selectedProduct.details).map(([key, value]) => (
                      <li key={key}><strong>{key}:</strong> {value}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="dialog-actions">
                <button 
                  onClick={() => {
                   // addToCart(selectedProduct);
                    window.open(selectedProduct.linkValue || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                    closeDialog();
                  }}
                  className="dialog-add-to-cart"
                >
                  Order Here
                </button>
                <button 
                  onClick={() => {
                   // addToCart(selectedProduct);
                    window.open(selectedProduct.linkshop || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                    closeDialog();
                  }}
                  className="dialog-add-to-cart"
                >
                  Visit Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sortedProducts.length === 0 && (
        <div className="no-products">
          <p>No men's products found.</p>
        </div>
      )}
    </div>
  );
};

export default MensProductList;

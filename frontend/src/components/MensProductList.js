import React, { useState, useEffect } from 'react';
import './MensProductList.css';

// Backend URL for local development
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const MensProductList = ({ products, addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Men');
  const [sortBy, setSortBy] = useState('name');
  const [menProducts, setMenProducts] = useState([]);

  useEffect(() => {
    // Load products from sessionStorage or use props
    const loadProducts = () => {
      const storedProducts = sessionStorage.getItem('menProducts');
      if (storedProducts) {
        setMenProducts(JSON.parse(storedProducts));
      } else {
        // Filter men products from props if no stored data
        const filteredProducts = products.filter(product => {
          const category = product.category?.toLowerCase();
          const gender = product.gender?.toLowerCase();
          const tags = product.tags || [];
          
          return category === 'men' || 
                 category?.includes('men') || 
                 gender === 'men' || 
                 gender === 'male' ||
                 tags.some(tag => tag.toLowerCase().includes('men'));
        });
        setMenProducts(filteredProducts);
      }
    };

    loadProducts();

    // Listen for product updates
    const handleProductsUpdate = (event) => {
      if (event.detail.category === 'men') {
        setMenProducts(event.detail.products);
      }
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [products]);

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
    <div className="mens-product-container">
      <div className="mens-header">
        <h1>Men's Collection</h1>
        <p className="mens-subtitle">Discover the latest trends in Men's fashion</p>
      </div>
      <div className="mens-product-grid">
        {sortedProducts.map(product => (
          <div key={product.id} className="mens-product-card">
            <div className="product-image-container">
              <img
                src={`${BACKEND_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                alt={product.name}
                onClick={() => handleImageClick(product)}
                className="product-image"
                onError={(e) => {
                  e.target.src = `${BACKEND_URL}/images/placeholder.jpg`;
                }}
              />
              {product.badge && (
                <span className="product-badge">{product.badge}</span>
              )}
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-actions">
                <button 
                  onClick={() => {
                    window.open(product.linkValue);
                  }}
                  className="add-to-cart-btn"
                >
                  Order Here
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
                src={`${BACKEND_URL}${selectedProduct.image.startsWith('/') ? '' : '/'}${selectedProduct.image}`} 
                alt={selectedProduct.name} 
                onError={(e) => {
                  e.target.src = `${BACKEND_URL}/images/placeholder.jpg`;
                }}
              />
            </div>
            
            <div className="dialog-product-info">
              <h2>{selectedProduct.name}</h2>
              <p className="dialog-description">{selectedProduct.description}</p>
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
                    // window.open(selectedProduct.linkValue || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                     window.open(selectedProduct.linkValue);
                    closeDialog();
                  }}
                  className="dialog-add-to-cart"
                >
                  Order Here
                </button>
                {/* <button 
                  onClick={() => {
                   // addToCart(selectedProduct);
                    window.open(selectedProduct.linkshop || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                    closeDialog();
                  }}
                  className="dialog-add-to-cart"
                >
                  Visit Shop
                </button> */}
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

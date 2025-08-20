import React, { useState, useEffect } from 'react';
import './WomenProductList.css';

// Backend URL for Vercel deployment
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

// Helper function to construct proper image URLs
const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Ensure BACKEND_URL ends with a slash
  const baseUrl = BACKEND_URL.endsWith('/') ? BACKEND_URL : BACKEND_URL + '/';
  
  return baseUrl + cleanPath;
};

const Bags = ({ products, addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Bags');
  const [sortBy, setSortBy] = useState('name');
  const [bagsProducts, setBagsProducts] = useState([]);

  useEffect(() => {
    // Load products from sessionStorage or use props
    const loadProducts = () => {
      const storedProducts = sessionStorage.getItem('bagsProducts');
      if (storedProducts) {
        setBagsProducts(JSON.parse(storedProducts));
      } else {
        // Display all products from products.json
        // Filter for bag-related products based on category
        const bagProducts = products.filter(product => {
          const category = product.category?.toLowerCase();
          return category === 'bags';
        });
        
        // If no bag products found, display all products
        setBagsProducts(bagProducts.length > 0 ? bagProducts : products);
      }
    };

    loadProducts();

    // Listen for product updates
    const handleProductsUpdate = (event) => {
      if (event.detail.category === 'Bags') {
        setBagsProducts(event.detail.products);
      }
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [products]);

  // Filter by category
  const filteredProducts = filterCategory === 'all' 
    ? bagsProducts 
    : bagsProducts.filter(product => product.category === filterCategory);

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

  const categories = [...new Set(bagsProducts.map(p => p.category).filter(Boolean))];

  return (
    <div className="women-product-container">
      <div className="women-header">
        <h1>Bags & Accessories Collection</h1>
        <p className="women-subtitle">Discover stylish bags, purses, and accessories for every occasion</p>
      </div>

      <div className="women-product-grid">
        {sortedProducts.map(product => (
          <div key={product.id} className="women-product-card">
            <div className="product-image-container">
              <img
                src={getImageUrl(product.image)}
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
                src={getImageUrl(selectedProduct.image)} 
                alt={selectedProduct.name} 
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
                    window.open(selectedProduct.linkValue);
                    closeDialog();
                  }}
                  className="dialog-add-to-cart"
                >
                  Order Here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {sortedProducts.length === 0 && (
        <div className="no-products">
          <p>No bags found.</p>
        </div>
      )}
    </div>
  );
};

export default Bags;

import React, { useState, useEffect } from 'react';
import './WomenProductList.css';

// Backend URL for Vercel deployment
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const WomenProductList = ({ products, addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Women');
  const [sortBy, setSortBy] = useState('name');
  const [womenProducts, setWomenProducts] = useState([]);

  useEffect(() => {
    // Load products from sessionStorage or use props
    const loadProducts = () => {
      const storedProducts = sessionStorage.getItem('womenProducts');
      if (storedProducts) {
        setWomenProducts(JSON.parse(storedProducts));
      } else {
        // Filter women products from props if no stored data
        const filteredProducts = products.filter(product => {
          const category = product.category?.toLowerCase();
          const gender = product.gender?.toLowerCase();
          const tags = product.tags || [];
          
          return category === 'women' || 
                 category?.includes('women') || 
                 gender === 'women' || 
                 gender === 'female' ||
                 tags.some(tag => tag.toLowerCase().includes('women'));
        });
        setWomenProducts(filteredProducts);
      }
    };

    loadProducts();

    // Listen for product updates
    const handleProductsUpdate = (event) => {
      if (event.detail.category === 'women') {
        setWomenProducts(event.detail.products);
      }
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, [products]);

  // Filter by category
  const filteredProducts = filterCategory === 'all' 
    ? womenProducts 
    : womenProducts.filter(product => product.category === filterCategory);

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

  const categories = [...new Set(womenProducts.map(p => p.category).filter(Boolean))];

  return (
    <div className="women-product-container">
      <div className="women-header">
        <h1>Women's Collection</h1>
        <p className="women-subtitle">Discover the latest trends in women's fashion</p>
      </div>

      {/* <div className="filter-section">
        <div className="filter-group">
          <label>Category:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div> */}

        {/* <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div> */}

      <div className="women-product-grid">
        {sortedProducts.map(product => (
          <div key={product.id} className="women-product-card">
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
              <div className="product-actions">
               <button 
                  onClick={() => {
                   // addToCart(product);
                    // window.open(product.linkValue || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                    window.open(product.linkValue);
                  }}
                  className="add-to-cart-btn"
                >
                  Order Here
                </button>  
                 {/* <button 
                  onClick={() => {
                   // addToCart(product);
                    window.open(product.linkshop || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                  }}
                  className="add-to-cart-btn"
                >
                  Visit Shop
                </button>            */}
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
                <br/>
               {/* <button 
                  onClick={() => {
                   // addToCart(selectedProduct);
                    window.open(selectedProduct.linkshop || "https://vt.tiktok.com/ZSSbYPSed/", "_blank");
                    closeDialog();
                  }}
                  className="dialog-add-to-cart"
                >Visit Shop
                </button> */}
            </div>
          </div>
        </div>
      )}

      {sortedProducts.length === 0 && (
        <div className="no-products">
          <p>No women's products found.</p>
        </div>
      )}
    </div>
  );
};

export default WomenProductList;

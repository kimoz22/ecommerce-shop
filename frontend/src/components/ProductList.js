import React, { useState } from 'react';

// Backend URL for Vercel deployment
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const ProductList = ({ products, addToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [internalBrowserUrl, setInternalBrowserUrl] = useState(null);

  const handleImageClick = (product) => {
    setSelectedProduct(product);
  };

  const closeDialog = () => {
    setSelectedProduct(null);
  };

  const closeInternalBrowser = () => {
    setInternalBrowserUrl(null);
  };

  return (
    <div className="product-list" style={{
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gap: '10px',
      padding: '10px',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {products.map(product => (
        <div key={product.id} className="product-card" style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <img
            src={`${BACKEND_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
            alt={product.name}
            onClick={() => handleImageClick(product)}
            style={{ width: 'auto', height: '300px', objectFit: 'contain', marginBottom: '12px', marginLeft: 'auto', marginRight: 'auto' }}
            onError={(e) => {
              e.target.src = `${BACKEND_URL}/images/placeholder.jpg`;
            }}
          />
          <h3>{product.name}</h3>
          <button onClick={() => {
            addToCart(product);
            setInternalBrowserUrl(product.linkValue || "https://vt.tiktok.com/ZSShMRRrr/");
          }} style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}>Order Here</button>
        </div>
      ))}

      {selectedProduct && (
        <div className="dialog-overlay" onClick={closeDialog} style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div className="dialog-content" onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflowY: 'auto',
            animation: 'zoomIn 0.3s ease forwards',
          }}>
            <h2>{selectedProduct.name} - Images</h2>
            <div className="image-gallery" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {selectedProduct.images && selectedProduct.images.map((imgSrc, index) => (
                <img
                  key={index}
                  src={`${BACKEND_URL}${imgSrc}`}
                  alt={`${selectedProduct.name} ${index + 1}`}
                  style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', cursor: 'pointer' }}
                />
              ))}
            </div>
            <button onClick={closeDialog} style={{ marginTop: '20px' }}>Close</button>
          </div>
        </div>
      )}

      {internalBrowserUrl && (
        <div className="internal-browser-overlay" onClick={closeInternalBrowser} style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1100,
        }}>
          <div className="internal-browser-content" onClick={e => e.stopPropagation()} style={{
            position: 'relative',
            width: '90%',
            height: '90%',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}>
            <button onClick={closeInternalBrowser} style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1200,
              backgroundColor: '#ff5c5c',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}>×</button>
            <iframe
              src={internalBrowserUrl}
              title="Internal Web Browser"
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
@keyframes zoomIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`;
document.head.appendChild(style);

export default ProductList;

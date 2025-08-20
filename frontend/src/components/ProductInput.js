import React, { useState } from 'react';
import './ProductManagement.css';

const ProductInput = ({ refreshProducts }) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('');
  const [linkValue, setLink] = useState('');
  const [linkshop, setLinkShop] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      setMessage('Name and price are required.');
      return;
    }

    let imagePath = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        // Always use local storage for images
        const uploadEndpoint = `${BACKEND_URL}/api/upload-image`;

        const uploadResponse = await fetch(uploadEndpoint, {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Upload error:', errorText);
          setMessage(`Image upload failed: ${errorText}`);
          return;
        }
        
        const uploadData = await uploadResponse.json();
        imagePath = uploadData.imagePath;
      } catch (error) {
        console.error('Upload error:', error);
        setMessage(`Error uploading image: ${error.message}`);
        return;
      }
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, image: imagePath, category, linkValue, linkshop }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', errorText);
        setMessage(`Failed to add product: ${errorText}`);
        return;
      }
      
      const data = await response.json();
      setMessage(`Product added successfully: ${data.product.name}`);
      setName('');
      setPrice('');
      setImageFile(null);
      setCategory('');
      setLink('');
      setLinkShop('');
      document.getElementById('imageInput').value = '';
      
      if (refreshProducts) {
        refreshProducts();
        setTimeout(() => refreshProducts(), 500);
      }
    } catch (error) {
      console.error('API error:', error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="product-input-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Product Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter product name"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Price:
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="0.00"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Product Image:
            <input
              type="file"
              id="imageInput"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Category:
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Bags">Bags</option>
              <option value="Electronics">Electronics</option>
              <option value="Kidswear">Kidswear</option>
              <option value="Clothing">Clothing</option>
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Product Link:
            <input
              type="text"
              value={linkValue}
              onChange={(e) => setLink(e.target.value)}
              required
              placeholder="https://example.com/product"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Shop Name:
            <input
              type="text"
              value={linkshop}
              onChange={(e) => setLinkShop(e.target.value)}
              required
              placeholder="e.g., Nike, Adidas, Zara"
            />
          </label>
        </div>

        <button type="submit">Add Product</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProductInput;
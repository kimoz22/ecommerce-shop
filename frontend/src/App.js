import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import WomenProductList from './components/WomenProductList';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import ProductInput from './components/ProductInput';
import UserProfile from './components/UserProfile';
import Orders from './components/Orders';
import './App.css';
import MensProductList from './components/MensProductList';
import AnimatedHome from './components/AnimatedHome';
import Bags from './components/Bags';

function App() {  
  const [products, setProducts] = useState([]);
  const [username, setUsername] = useState('Guest');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchProducts = () => {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    console.log('Fetching products from:', `${BACKEND_URL}/api/products`);
    
    fetch(`${BACKEND_URL}/api/products`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Products loaded:', data.length);
        setProducts(data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        // Fallback to local products.json if backend fails
        try {
          const fallbackProducts = require('./products.json');
          console.log('Using fallback products:', fallbackProducts.length);
          setProducts(fallbackProducts);
        } catch {
          setProducts([]);
        }
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Router>
      <div className="App">
        <h1>Faith Fuel</h1>
        <Header username={username} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<AnimatedHome products={products} />} />
            <Route path="/product-input" element={<ProductInput refreshProducts={fetchProducts} />} />
            <Route path="/women-products" element={<WomenProductList products={products} />} />
            <Route path="/men-products" element={<MensProductList products={products} />} />
            <Route path="/bags" element={<Bags products={products} />} />
            <Route path="/profile" element={<UserProfile username={username} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

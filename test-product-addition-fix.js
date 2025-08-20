// Simple test script to verify product addition works
const axios = require('axios');

const testProduct = {
  name: "Test Product",
  price: 99.99,
  image: "/images/test.jpg",
  category: "Test",
  linkValue: "https://test.com",
  linkshop: "Test Shop"
};

async function testProductAddition() {
  try {
    const response = await axios.post('http://localhost:5000/api/products', testProduct);
    console.log('✅ Product added successfully:', response.data);
  } catch (error) {
    console.error('❌ Error adding product:', error.response?.data || error.message);
  }
}

// Run test if server is running
testProductAddition();

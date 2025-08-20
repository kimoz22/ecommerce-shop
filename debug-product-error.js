// Debug script to identify product addition errors
const axios = require('axios');

// Test different scenarios
const testCases = [
  {
    name: "Test Product - Valid",
    price: "99.99",
    category: "Mens",
    description: "Test product",
    linkValue: "https://example.com",
    linkshop: "Test Shop"
  },
  {
    name: "Test Product - Missing Price",
    category: "Mens",
    description: "Should fail"
  },
  {
    name: "Test Product - Invalid Price",
    price: "invalid",
    category: "Mens"
  }
];

async function runTests() {
  console.log('🧪 Running product addition tests...\n');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`Test ${i + 1}:`, testCase.name);
    
    try {
      const response = await axios.post('http://localhost:5000/api/products', testCase);
      console.log('✅ Success:', response.data);
    } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
    }
    
    console.log('---');
  }
}

// Check products.json structure
function checkProductsFile() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const productsPath = path.join(__dirname, 'backend', 'products.json');
    const data = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(data);
    
    console.log('📊 Current products count:', products.length);
    console.log('📁 products.json is valid JSON');
    
    if (products.length > 0) {
      console.log('📝 Sample product structure:', {
        id: products[0].id,
        name: products[0].name,
        price: products[0].price,
        category: products[0].category
      });
    }
  } catch (error) {
    console.error('❌ products.json error:', error.message);
  }
}

// Run diagnostics
checkProductsFile();
console.log('\n');
runTests();

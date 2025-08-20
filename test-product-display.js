// Test script to verify product display functionality
const fetch = require('node-fetch');

async function testProductDisplay() {
  console.log('Testing product display functionality...');
  
  // Test backend API
  try {
    const backendUrl = 'https://faithfuel-backend.vercel.app/api/products';
    console.log(`Testing backend: ${backendUrl}`);
    
    const response = await fetch(backendUrl);
    const products = await response.json();
    
    console.log(`✅ Backend API working - Found ${products.length} products`);
    
    // Verify products have required fields
    const validProducts = products.filter(p => 
      p.id && p.name && p.price && p.image && p.category
    );
    
    console.log(`✅ Valid products: ${validProducts.length}`);
    
    // Check for any missing images
    const missingImages = products.filter(p => !p.image);
    if (missingImages.length > 0) {
      console.log(`⚠️ Products with missing images: ${missingImages.length}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing backend:', error.message);
    return false;
  }
}

// Run test
testProductDisplay().then(success => {
  if (success) {
    console.log('🎉 Product display should work correctly!');
  } else {
    console.log('❌ Product display needs debugging');
  }
});

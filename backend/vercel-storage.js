const { put, list } = require('@vercel/blob');

// Store products in Vercel Blob Storage instead of local file
const PRODUCTS_BLOB_NAME = 'products.json';

async function saveProductsToBlob(products) {
  try {
    const productsJson = JSON.stringify(products, null, 2);
    const blob = await put(PRODUCTS_BLOB_NAME, productsJson, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });
    console.log('Products saved to blob storage:', blob.url);
    return blob.url;
  } catch (error) {
    console.error('Error saving products to blob:', error);
    throw error;
  }
}

async function loadProductsFromBlob() {
  try {
    // List all blobs to find our products.json
    const blobs = await list();
    const productsBlob = blobs.blobs.find(blob => blob.pathname === PRODUCTS_BLOB_NAME);
    
    if (!productsBlob) {
      console.log('No products.json found in blob storage, returning empty array');
      return [];
    }

    // Fetch the content from the blob URL
    const response = await fetch(productsBlob.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const productsData = await response.json();
    console.log('Loaded products from blob storage:', productsData.length, 'products');
    return productsData;
  } catch (error) {
    console.error('Error loading products from blob:', error);
    return [];
  }
}

module.exports = {
  saveProductsToBlob,
  loadProductsFromBlob
};

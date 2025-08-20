// Local storage utilities for products and images
const STORAGE_KEY = 'localProducts';
const IMAGE_STORAGE_KEY = 'localProductImages';

export const getLocalProducts = () => {
  const products = localStorage.getItem(STORAGE_KEY);
  return products ? JSON.parse(products) : [];
};

export const saveLocalProduct = (product) => {
  const products = getLocalProducts();
  products.push(product);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return product;
};

export const updateLocalProduct = (id, updatedProduct) => {
  const products = getLocalProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
  }
  return null;
};

export const deleteLocalProduct = (id) => {
  const products = getLocalProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
  return filteredProducts;
};

export const generateProductId = () => {
  const products = getLocalProducts();
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

// Image handling
export const saveImageToLocal = (base64Image, productId) => {
  const images = getLocalImages();
  images[productId] = base64Image;
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
  return base64Image;
};

export const getLocalImages = () => {
  const images = localStorage.getItem(IMAGE_STORAGE_KEY);
  return images ? JSON.parse(images) : {};
};

export const getImageForProduct = (productId) => {
  const images = getLocalImages();
  return images[productId] || null;
};

// Utility to convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

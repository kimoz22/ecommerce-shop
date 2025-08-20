const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { put } = require('@vercel/blob');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://faithfuel-shop.vercel.app', 'https://faithfuel-backend.vercel.app', 'http://localhost:5000','http://localhost:3000', 'https://*.vercel.app'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const usersFile = path.join(__dirname, 'users.json');
const productsFile = path.join(__dirname, 'products.json');

// Load initial products data
let productsData = [];
let usersData = [];

// Load data on startup
try {
  const productsDataRaw = fs.readFileSync(productsFile, 'utf8');
  productsData = JSON.parse(productsDataRaw);
} catch (err) {
  console.log('Could not load products.json, using empty array');
  productsData = [];
}

try {
  const usersDataRaw = fs.readFileSync(usersFile, 'utf8');
  usersData = JSON.parse(usersDataRaw);
} catch (err) {
  console.log('Could not load users.json, using empty array');
  usersData = [];
}

//To Setup Meddleware CORS 



// Multer setup for image uploads
// Local storage (for development)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public/images'));
  },
  filename: function (req, file, cb) {
    // Save with original filename only, no random suffix
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Memory storage (for Vercel Blob)
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ storage: memoryStorage });

// Helper function to read users (works in both local and serverless)
function readUsers() {
  // In serverless environment, return in-memory data
  if (process.env.VERCEL) {
    return usersData;
  }
  // In local environment, use file system
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper function to write users (works in both local and serverless)
function writeUsers(users) {
  // In serverless environment, update in-memory data
  if (process.env.VERCEL) {
    usersData = users;
    return;
  }
  // In local environment, use file system
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing users file:', err);
  }
}

// Helper function to read products (works in both local and serverless)
function readProducts() {
  // In serverless environment, return in-memory data
  if (process.env.VERCEL) {
    return productsData;
  }
  // In local environment, use file system
  try {
    const data = fs.readFileSync(productsFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper function to write products (works in both local and serverless)
function writeProducts(products) {
  // In serverless environment, use Vercel Blob Storage
  if (process.env.VERCEL) {
    const { saveProductsToBlob } = require('./vercel-storage');
    saveProductsToBlob(products).catch(console.error);
    productsData = products;
    return;
  }
  // In local environment, use file system
  try {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Error writing products file:', err);
  }
}

const commonBreachedPasswords = [
  '123456',
  'password',
  '123456789',
  '12345678',
  '12345',
  '111111',
  '1234567',
  'sunshine',
  'qwerty',
  'iloveyou',
  'princess',
  'admin',
  'welcome',
  '666666',
  'abc123'
];

function isPasswordStrong(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
}

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, address, contactNo, userName, password } = req.body;

  if (!firstName || !lastName || !address || !contactNo || !userName || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (commonBreachedPasswords.includes(password)) {
    return res.status(400).json({ message: 'Password is too common and has been found in data breaches. Please choose a stronger password.' });
  }

  if (!isPasswordStrong(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.' });
  }

  const users = readUsers();

  const existingUser = users.find(u => u.userName === userName);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { firstName, lastName, address, contactNo, userName, password: hashedPassword };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/login', async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const users = readUsers();

  const user = users.find(u => u.userName === userName);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    res.status(200).json({ message: 'Login successful', user: { userName: user.userName, firstName: user.firstName } });
  } catch (err) {
    res.status(500).json({ message: 'Error during login' });
  }
});

// Image upload endpoint - Local storage (for development)
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  const imagePath = '/images/' + req.file.filename;

  // Optionally, update products.json with new image path if product ID is provided
  const { productId } = req.body;
  if (productId) {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(productId));
    if (product) {
      product.image = imagePath;
      writeProducts(products);
    }
  }

  res.status(200).json({ message: 'Image uploaded successfully', imagePath });
});

// Image upload endpoint - Local storage only (removed Vercel Blob Storage)

app.get('/api/products', (req, res) => {
  try {
    // In serverless environment, return in-memory data
    if (process.env.VERCEL) {
      res.json(productsData);
      return;
    }
    
    // In local environment, use file system
    const data = fs.readFileSync(productsFile, 'utf8');
    const products = JSON.parse(data);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load product data' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, category, linkValue, linkshop } = req.body;
    
    // Validate required fields
    if (!name || !price) {
      return res.status(400).json({ 
        message: 'Name and price are required',
        received: { name: !!name, price: !!price }
      });
    }
    
    // Validate price is a number
    const priceNumber = Number(price);
    if (isNaN(priceNumber) || priceNumber < 0) {
      return res.status(400).json({ 
        message: 'Price must be a valid positive number',
        receivedPrice: price 
      });
    }
    
    // Read existing products using the helper function
    const products = readProducts();
    
    // Generate new ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Create new product
    const newProduct = {
      id: newId,
      name: name.trim(),
      price: priceNumber,
      image: image || '',
      category: category || '',
      linkValue: linkValue || '',
      linkshop: linkshop || ''
    };
    
    // Add new product
    products.push(newProduct);
    
    // Write back using the helper function
    writeProducts(products);
    
    res.status(201).json({ 
      message: 'Product added successfully', 
      product: newProduct 
    });
    
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ 
      message: 'Failed to add product',
      error: err.message 
    });
  }
});

// Export the app for Vercel serverless deployment
module.exports = app;

// Only start the server if this file is executed directly (for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

const { put } = require('@vercel/blob');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// New upload endpoint for Vercel Blob Storage
app.post('/api/upload-image-blob', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${req.file.originalname}`;
    
    // Upload to Vercel Blob Storage
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    });

    const imageUrl = blob.url;

    // Optionally update products.json
    const { productId } = req.body;
    if (productId) {
      const products = readProducts();
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        product.image = imageUrl;
        writeProducts(products);
      }
    }

    res.status(200).json({ 
      message: 'Image uploaded successfully', 
      imagePath: imageUrl 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Error uploading image', 
      error: error.message 
    });
  }
});

const app = require('./server');

module.exports = (req, res) => {
  // Simple test endpoint to verify Vercel deployment
  if (req.url === '/test') {
    return res.status(200).json({ message: 'Vercel backend is working!' });
  }
  
  // For all other requests, pass them to the main app
  return app(req, res);
};

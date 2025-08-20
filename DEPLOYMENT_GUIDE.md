# Fix "Unexpected token '<', "<!DOCTYPE "... is not valid JSON" Error

## Problem Description
This error occurs when the frontend tries to parse HTML (like an error page) as JSON. This typically happens when:
1. The API endpoint is incorrect
2. The server returns a 404 or 500 error page
3. CORS issues prevent proper communication
4. Environment variables are not properly configured

## Solution Steps

### 1. Update Environment Variables
After deploying to Vercel, update these files with your actual URLs:

**frontend/.env.production**
```
REACT_APP_BACKEND_URL=https://your-backend.vercel.app
```

**backend/server.js** - Update CORS configuration:
```javascript
const corsOptions = {
  origin: ['https://your-frontend.vercel.app'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 2. Vercel Configuration
The vercel.json file has been updated to properly route API requests:
- Added explicit route for `/upload-image`
- Fixed API routing to ensure requests reach the backend

### 3. Error Handling
Enhanced error handling in ProductInput.js:
- Added proper response validation
- Better error messages for debugging
- Console logging for troubleshooting

### 4. Testing Checklist
1. Deploy both frontend and backend to Vercel
2. Set environment variables in Vercel dashboard
3. Test adding a product without image
4. Test adding a product with image
5. Check browser console for any errors

### 5. Common Issues
- **404 on API calls**: Check if backend URL is correct
- **CORS errors**: Update CORS origins in backend/server.js
- **Image upload fails**: Ensure `/public/images` directory exists
- **JSON parse error**: Check server logs for actual error

### 6. Quick Fix Commands
```bash
# After deployment, update these URLs:
# In Vercel dashboard > Settings > Environment Variables
REACT_APP_BACKEND_URL=https://your-backend.vercel.app

# In backend/server.js, update CORS:
origin: ['https://your-frontend.vercel.app']

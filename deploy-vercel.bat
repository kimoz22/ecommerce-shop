@echo off
echo === Deploying Ecommerce App to Vercel ===
echo.
echo Step 1: Installing Vercel CLI...
npm install -g vercel
echo.
echo Step 2: Deploying to Vercel...
vercel --prod
echo.
echo === Deployment Complete! ===
echo Your app should now be live on Vercel!
pause

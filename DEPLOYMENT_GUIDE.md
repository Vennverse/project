# 🚀 Netlify Deployment Guide

## 📋 Prerequisites
- Node.js 18+ installed
- Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)

## 🔧 Step 1: Prepare Your Project

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Test Build Locally
```bash
npm run build
```
This creates a `dist` folder with your static files.

### 1.3 Test Locally
```bash
npm run preview
```
Visit `http://localhost:4173` to test the built version.

## 🌐 Step 2: Deploy to Netlify

### Option A: Git-based Deployment (Recommended)

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy automatically

### Option B: Manual Deployment

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to the deploy area
   - Your site will be live immediately

## ⚙️ Step 3: Configure Environment Variables (Optional)

For production features, add these environment variables in Netlify:

1. **Go to Site Settings → Environment Variables**

2. **Add Variables:**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

## 🔧 Step 4: Configure Netlify Functions (For Full Features)

1. **Enable Functions**
   - In Netlify dashboard: Site Settings → Functions
   - Functions directory: `netlify/functions`

2. **Add Serverless Functions**
   The following functions are already included:
   - `auth.js` - Authentication
   - `businesses.js` - Business listings
   - `admin.js` - Admin functions
   - `advertisements.js` - Ad management
   - `stripe-payment.js` - Payment processing

## 📱 Step 5: Test Your Deployment

### Demo Features Available:
- ✅ User registration and login
- ✅ Business browsing and filtering
- ✅ Business detail pages
- ✅ Admin dashboard (use admin@demo.com)
- ✅ Advertisement creation
- ✅ Premium subscription pages
- ✅ Responsive design

### Test Accounts:
- **Regular User:** Any email/password
- **Admin User:** admin@demo.com / any password

## 🎯 Step 6: Custom Domain (Optional)

1. **Add Custom Domain**
   - Site Settings → Domain management
   - Add your domain
   - Configure DNS records

2. **Enable HTTPS**
   - Automatically enabled by Netlify
   - SSL certificate provided free

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check Node.js version (use 18+)
   - Clear node_modules: `rm -rf node_modules && npm install`

2. **Functions Not Working**
   - Ensure `netlify.toml` is in root directory
   - Check function syntax in `netlify/functions/`

3. **Environment Variables**
   - Redeploy after adding environment variables
   - Use `VITE_` prefix for frontend variables

### Build Commands:
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📊 Performance Optimization

Your site is already optimized with:
- ✅ Static site generation
- ✅ Code splitting
- ✅ Image optimization
- ✅ Minified CSS/JS
- ✅ Gzip compression
- ✅ CDN delivery via Netlify

## 🎉 You're Live!

Your B2B marketplace is now deployed on Netlify with:
- Professional business listings
- User authentication
- Admin dashboard
- Advertisement system
- Premium subscriptions
- Mobile-responsive design

**Next Steps:**
1. Test all features on your live site
2. Add your custom domain
3. Configure payment processing
4. Set up email notifications
5. Connect to database for production data

Your site URL will be: `https://your-site-name.netlify.app`
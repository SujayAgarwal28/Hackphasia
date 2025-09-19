# 🚀 Deployment & Troubleshooting Guide - Hackphasia

## 📋 Table of Contents
1. [Development Setup](#development-setup)
2. [Production Deployment](#production-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring & Debugging](#monitoring--debugging)
7. [FAQ](#frequently-asked-questions)

## 🛠️ Development Setup

### System Requirements
```bash
# Minimum Requirements
- Node.js 18.0+ (LTS recommended)
- npm 9.0+ or yarn 1.22+
- RAM: 4GB minimum, 8GB recommended
- Storage: 2GB free space
- Modern browser with WebGL support

# Recommended Development Environment
- Visual Studio Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
  - Tailwind CSS IntelliSense
```

### Quick Development Setup
```bash
# 1. Clone and navigate to project
git clone https://github.com/SujayAgarwal28/Hackphasia.git
cd Hackphasia

# 2. Install dependencies
npm install

# 3. Verify installation
npm run typecheck

# 4. Start development server
npm run dev

# Expected output:
# ✅ VITE v4.5.14 ready in 371 ms
# ➜  Local:   http://localhost:5174/
# ➜  Network: use --host to expose
```

### Development Environment Verification
```bash
# Check Node.js version
node --version  # Should be 18.0.0 or higher

# Check npm version  
npm --version   # Should be 9.0.0 or higher

# Verify TensorFlow.js compatibility
npm list @tensorflow/tfjs

# Test browser compatibility
# Open http://localhost:5174 and check browser console for errors
```

## 🌐 Production Deployment

### Build Process
```bash
# 1. Create production build
npm run build

# Expected output structure:
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [ML models]/
├── index.html
├── manifest.json
└── sw.js (service worker)

# 2. Verify build
npm run preview
# Test at http://localhost:4173
```

### Deployment Platforms

#### 1. Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Configure environment variables in Vercel dashboard:
# - VITE_FIREBASE_API_KEY
# - VITE_OPENAI_API_KEY
# - VITE_MAP_API_KEY
```

#### 2. Netlify Deployment
```bash
# Build settings in netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Environment variables to set:
# - VITE_FIREBASE_API_KEY
# - VITE_FIREBASE_AUTH_DOMAIN
# - VITE_FIREBASE_PROJECT_ID
```

#### 3. Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy

# firebase.json configuration:
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  }
}
```

#### 4. Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Build and run Docker container
docker build -t hackphasia .
docker run -p 3000:80 hackphasia
```

## ⚙️ Environment Configuration

### Environment Variables

#### Required Variables
```env
# .env.production
VITE_APP_TITLE="Hackphasia - Emergency Health System"
VITE_APP_VERSION="1.0.0"
VITE_API_BASE_URL="https://api.hackphasia.com"
```

#### Optional Cloud Features
```env
# Firebase Configuration (optional - enables cloud sync)
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"

# OpenAI Integration (optional - enhances AI features)
VITE_OPENAI_API_KEY="sk-your_openai_api_key"
VITE_OPENAI_MODEL="gpt-3.5-turbo"

# Map Services (optional - enhanced mapping)
VITE_MAPBOX_ACCESS_TOKEN="pk.your_mapbox_token"
VITE_GOOGLE_MAPS_API_KEY="your_google_maps_key"
```

#### Feature Flags
```env
# Feature toggles
VITE_ENABLE_VOICE_INPUT=true
VITE_ENABLE_CAMERA_ASSESSMENT=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_ADVANCED_ML=true
VITE_ENABLE_FIREBASE_SYNC=false
VITE_ENABLE_ANALYTICS=true
```

### Configuration Validation
```typescript
// Environment validation script
const validateConfig = () => {
  const required = ['VITE_APP_TITLE', 'VITE_APP_VERSION']
  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    throw new Error('Configuration validation failed')
  }
  
  console.log('✅ Configuration validated successfully')
}
```

## 🚨 Common Issues & Solutions

### Build Issues

#### Issue: "Module not found" errors
```bash
# Problem: Missing dependencies or path issues
# Solution:
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Issue: TypeScript compilation errors
```bash
# Problem: Type checking failures
# Solution:
npm run typecheck
# Fix type errors in reported files
# Common fixes:
# - Add proper type annotations
# - Update @types packages
# - Check tsconfig.json configuration
```

#### Issue: Vite build failures
```bash
# Problem: Vite bundling issues
# Solution:
rm -rf dist
npm run build -- --force
# Check for:
# - Large bundle sizes
# - Dynamic imports
# - Asset loading issues
```

### Runtime Issues

#### Issue: AI models not loading
```typescript
// Problem: TensorFlow.js model loading failures
// Solution: Check model paths and browser compatibility

// Debug model loading:
const debugModelLoading = async () => {
  try {
    console.log('Loading AI model...')
    const model = await tf.loadLayersModel('/models/health_model.json')
    console.log('✅ Model loaded successfully:', model)
  } catch (error) {
    console.error('❌ Model loading failed:', error)
    // Fallback to simpler model or mock predictions
  }
}
```

#### Issue: Geolocation not working
```typescript
// Problem: Location services blocked or unavailable
// Solution: Implement fallback location detection

const getLocationWithFallback = async () => {
  try {
    const position = await getCurrentPosition()
    return position
  } catch (error) {
    console.warn('GPS unavailable, using IP-based location')
    return await getLocationFromIP()
  }
}
```

#### Issue: Performance problems on mobile
```typescript
// Problem: Slow performance on mobile devices
// Solution: Optimize resource loading

// Lazy load heavy components
const HeavyComponent = lazy(() => 
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
)

// Optimize AI inference
const optimizeInference = (inputData) => {
  // Batch predictions for efficiency
  // Reduce model precision if needed
  // Use web workers for heavy computations
}
```

### Deployment Issues

#### Issue: 404 errors on refresh (SPA routing)
```nginx
# nginx.conf - Fix for single-page application routing
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Issue: Environment variables not working in production
```bash
# Problem: Environment variables not loaded
# Solution: Verify build-time variable injection

# Check if variables are properly prefixed with VITE_
echo $VITE_FIREBASE_API_KEY

# Verify in build output
npm run build
grep -r "VITE_" dist/
```

#### Issue: CORS errors in production
```typescript
// Problem: Cross-origin requests blocked
// Solution: Configure proper CORS headers

// For Express.js backend:
app.use(cors({
  origin: ['https://your-domain.com', 'https://localhost:5174'],
  credentials: true
}))
```

## 🔧 Performance Optimization

### Bundle Size Optimization
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer dist/assets/*.js

# Common optimizations:
# - Remove unused dependencies
# - Use dynamic imports for large components
# - Optimize image assets
# - Enable gzip compression
```

### AI Model Optimization
```typescript
// Optimize TensorFlow.js models
const optimizeModel = async () => {
  // Use quantized models for faster inference
  const quantizedModel = await tf.loadLayersModel('/models/quantized_model.json')
  
  // Warm up model with dummy input
  const dummyInput = tf.zeros([1, 25])
  await quantizedModel.predict(dummyInput)
  dummyInput.dispose()
  
  return quantizedModel
}
```

### Caching Strategy
```typescript
// Implement intelligent caching
class SmartCache {
  private cache = new Map()
  private readonly TTL = {
    hospitals: 30 * 60 * 1000,    // 30 minutes
    predictions: 5 * 60 * 1000,   // 5 minutes
    userSession: 60 * 60 * 1000   // 1 hour
  }
  
  set(key: string, data: any, type: keyof typeof this.TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: this.TTL[type]
    })
  }
  
  get(key: string) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }
    this.cache.delete(key)
    return null
  }
}
```

## 🔍 Monitoring & Debugging

### Error Tracking
```typescript
// Implement comprehensive error tracking
class ErrorTracker {
  static track(error: Error, context: string) {
    console.error(`[${context}] Error:`, error)
    
    // Send to monitoring service in production
    if (import.meta.env.PROD) {
      this.sendToMonitoring({
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }
  }
  
  private static sendToMonitoring(errorData: any) {
    // Integration with Sentry, LogRocket, etc.
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(console.error)
  }
}
```

### Performance Monitoring
```typescript
// Monitor application performance
class PerformanceMonitor {
  static measureAIInference = async (modelFn: Function, inputData: any) => {
    const start = performance.now()
    const result = await modelFn(inputData)
    const duration = performance.now() - start
    
    console.log(`AI Inference took ${duration.toFixed(2)}ms`)
    
    if (duration > 1000) {
      console.warn('Slow AI inference detected')
    }
    
    return result
  }
  
  static measurePageLoad = () => {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      console.log(`Page loaded in ${loadTime}ms`)
    })
  }
}
```

### Health Checks
```typescript
// Application health monitoring
const healthCheck = {
  async checkAIModels() {
    try {
      const testInput = new Array(25).fill(0.5)
      await AIHealthService.assessPatient(testInput)
      return { status: 'healthy', service: 'AI Models' }
    } catch (error) {
      return { status: 'unhealthy', service: 'AI Models', error: error.message }
    }
  },
  
  async checkDatabase() {
    try {
      await HospitalDatabase.getAllHospitals()
      return { status: 'healthy', service: 'Database' }
    } catch (error) {
      return { status: 'unhealthy', service: 'Database', error: error.message }
    }
  },
  
  async checkGeolocation() {
    try {
      await GeolocationService.getCurrentLocation()
      return { status: 'healthy', service: 'Geolocation' }
    } catch (error) {
      return { status: 'unhealthy', service: 'Geolocation', error: error.message }
    }
  }
}
```

## ❓ Frequently Asked Questions

### Q: The application is slow on mobile devices. How can I improve performance?
**A:** 
1. Enable service worker caching
2. Use lazy loading for heavy components
3. Optimize AI model inference with quantized models
4. Reduce image sizes and use WebP format
5. Enable gzip compression on your server

### Q: AI predictions seem inaccurate. What should I check?
**A:**
1. Verify model files are loading correctly
2. Check input data normalization
3. Ensure feature engineering matches training data
4. Validate confidence scores are above 0.75
5. Check for data preprocessing errors

### Q: How do I add a new hospital to the system?
**A:**
```typescript
// Add hospital programmatically
const newHospital = {
  name: "New Emergency Hospital",
  location: {
    lat: 12.9716,
    lng: 77.5946,
    address: "123 Health Street, Bangalore",
    city: "Bangalore",
    country: "IN"
  },
  // ... other hospital data
}

await HospitalDatabase.addHospital(newHospital)
```

### Q: How do I enable Firebase integration?
**A:**
1. Create a Firebase project
2. Add environment variables to `.env`
3. Set `VITE_ENABLE_FIREBASE_SYNC=true`
4. Deploy Firestore security rules
5. Test synchronization in development

### Q: The map is not showing the correct location. How do I fix this?
**A:**
1. Check browser geolocation permissions
2. Verify GeolocationService is working
3. Update city bounds in the database
4. Check for coordinate system mismatches
5. Implement IP-based location fallback

### Q: How do I customize the AI model for my region?
**A:**
1. Collect regional health data
2. Retrain models with local patterns
3. Update feature engineering pipeline
4. Test model accuracy with local validation data
5. Deploy updated model files

### Q: What's the difference between local and Firebase modes?
**A:**
- **Local Mode**: Data stored in browser, faster access, no internet required
- **Firebase Mode**: Cloud storage, real-time sync, persistent across devices
- **Hybrid Mode**: Local-first with cloud backup and synchronization

### Q: How do I contribute to the project?
**A:**
1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and React best practices
4. Add tests for new functionality
5. Submit a pull request with detailed description

---

## 📞 Support & Contact

For additional support:
- 📧 **Email**: support@hackphasia.com
- 💬 **GitHub Issues**: [Create an issue](https://github.com/SujayAgarwal28/Hackphasia/issues)
- 📖 **Documentation**: Check `/docs` folder for detailed guides
- 🌐 **Community**: Join our developer community discussions

**Remember**: This system is designed for emergency scenarios. Always prioritize user safety and data privacy in your deployments.
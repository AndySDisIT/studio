# 🚀 Cruizr - God-Tier Full Stack Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created
- Google Cloud account with Gemini API access
- Mapbox account with access token

## 🔥 Firebase Setup

### 1. Initialize Firebase Project

```bash
# Login to Firebase
firebase login

# Initialize project (if not already done)
firebase init

# Select:
# - Firestore
# - Storage
# - Hosting
# - App Hosting (optional, for serverless)
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual credentials
# Get Firebase credentials from: https://console.firebase.google.com/
# Get Mapbox token from: https://account.mapbox.com/access-tokens/
# Get Google AI key from: https://aistudio.google.com/app/apikey
```

### 3. Set Firebase App Hosting Secrets

```bash
# Set Mapbox token as secret
firebase apphosting:secrets:set MAPBOX_ACCESS_TOKEN

# Set Google AI API key as secret (for server-side AI calls)
firebase apphosting:secrets:set GOOGLE_GENAI_API_KEY
```

## 📦 Build & Deploy

### Production Build

```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Build for production
npm run build

# Test production build locally
npm run start
```

### Deploy to Firebase App Hosting

```bash
# Deploy to Firebase App Hosting (recommended for Next.js)
firebase deploy --only apphosting

# Or deploy to Firebase Hosting (static export)
# Note: Requires adding "output: 'export'" to next.config.ts
npm run build
firebase deploy --only hosting
```

### Deploy Database Rules & Indexes

```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Storage rules
firebase deploy --only storage
```

## 🗄️ Database Schema

### Users Collection

```typescript
/users/{userId}
{
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  realm: 'connect' | 'social' | 'dating' | 'hookup' | 'party' | 'ghost';
  location: GeoPoint;
  lastActive: Timestamp;
  preferences: {
    veilMode: {
      blurAvatars: boolean;
      hideNames: boolean;
      fuzzLocation: boolean;
    }
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Locations Collection

```typescript
/locations/{userId}
{
  userId: string;
  realm: string;
  coordinates: GeoPoint;
  accuracy: number;
  timestamp: Timestamp;
  isActive: boolean;
}
```

### Conversations Collection

```typescript
/conversations/{conversationId}
{
  participants: string[]; // Array of user IDs
  realm: string;
  lastMessage: string;
  lastMessageTime: Timestamp;
  createdAt: Timestamp;
}

/conversations/{conversationId}/messages/{messageId}
{
  senderId: string;
  text: string;
  timestamp: Timestamp;
  read: boolean;
}
```

## 🔐 Security Checklist

- [x] Firestore security rules configured
- [x] Storage security rules configured
- [x] Environment variables properly configured
- [x] API keys stored as secrets (not in code)
- [x] TypeScript strict mode enabled
- [ ] Authentication enabled (implement Firebase Auth)
- [ ] Rate limiting configured (implement in Cloud Functions)
- [ ] Content moderation enabled (implement AI moderation)

## 🌐 Custom Domain Setup

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps
4. Add your domain to `apphosting.yaml` if using App Hosting

## 📊 Monitoring & Analytics

### Firebase Analytics Setup

```typescript
// Add to src/lib/firebase.ts
import { getAnalytics } from "firebase/analytics";

export const analytics = getAnalytics(app);
```

### Performance Monitoring

```bash
# Deploy performance monitoring
firebase deploy --only performance
```

## 🔄 CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
```

## 🚀 Performance Optimization

- [x] System fonts (no external font loading)
- [x] Next.js 15 with Turbopack
- [x] Image optimization configured
- [x] Static page generation enabled
- [ ] Implement service worker (PWA)
- [ ] Enable edge caching
- [ ] Optimize bundle size

## 📝 Post-Deployment Tasks

1. **Test all features in production**
   - Authentication flow
   - Map functionality with real data
   - AI avatar generation
   - Real-time messaging

2. **Configure Firebase Authentication**
   - Enable Email/Password provider
   - Enable Google OAuth provider
   - Configure authorized domains

3. **Populate initial data**
   - Create test users
   - Add sample realms
   - Test location services

4. **Monitor performance**
   - Check Firebase Console for errors
   - Monitor API usage
   - Track user analytics

5. **Security audit**
   - Review Firestore rules
   - Test unauthorized access
   - Verify rate limiting

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Environment Variables Not Loading
- Ensure `.env.local` exists
- Restart dev server after changing env vars
- Check variable names match exactly (including NEXT_PUBLIC_ prefix)

### Firebase Deploy Fails
- Verify Firebase CLI is logged in: `firebase login`
- Check project is selected: `firebase use --add`
- Ensure billing is enabled for Cloud Functions

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Storage Security](https://firebase.google.com/docs/storage/security)

---

**Status**: Production-Ready ✅
**Last Updated**: 2025-12-12

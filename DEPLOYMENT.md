# Deployment Guide - Cruizr App

This guide provides comprehensive instructions for deploying the Cruizr application to Firebase App Hosting with proper CI/CD integration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Firebase Project Setup](#firebase-project-setup)
- [Getting Required API Keys](#getting-required-api-keys)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [Deployment Process](#deployment-process)
- [Troubleshooting](#troubleshooting)
- [Environment Variables Reference](#environment-variables-reference)

## Prerequisites

Before starting the deployment process, ensure you have:

- ✅ A Google account
- ✅ Node.js 20+ installed locally
- ✅ Git installed locally
- ✅ GitHub account with repository access
- ✅ Firebase CLI installed (`npm install -g firebase-tools`)
- ✅ Access to create Firebase projects

## Firebase Project Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "cruizr-app")
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and click **"Create project"**
6. Wait for the project to be created

### 2. Enable Firebase App Hosting

1. In your Firebase project console, click on **"App Hosting"** in the left sidebar
2. If prompted, upgrade to the Blaze (pay-as-you-go) plan
   - Don't worry: Firebase has a generous free tier
   - You'll only pay for usage beyond the free tier
3. Click **"Get Started"** to enable App Hosting

### 3. Register Your Web App

1. In the Firebase console, click the **web icon** (</>) to add a web app
2. Enter an app nickname (e.g., "Cruizr Web")
3. Check **"Also set up Firebase Hosting"** if prompted
4. Click **"Register app"**
5. **Save the Firebase configuration** - you'll need these values later:
   ```javascript
   {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   }
   ```

### 4. Initialize Firebase in Your Local Repository

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project directory
cd /path/to/cruizr
firebase init

# Select the following options:
# - Firestore (for future database features)
# - Hosting (for web hosting)
# - Storage (for file uploads)

# Choose "Use an existing project" and select your project
# Accept the default firestore.rules and firestore.indexes.json
# Choose ".next" as your public directory (important!)
# Configure as a single-page app: Yes
# Set up automatic builds with GitHub: No (we'll use GitHub Actions instead)
```

## Getting Required API Keys

### 1. Mapbox Access Token

Mapbox is required for map features in the app.

1. Go to [Mapbox](https://www.mapbox.com/)
2. Click **"Sign up"** or **"Log in"**
3. Once logged in, go to [Account → Access Tokens](https://account.mapbox.com/access-tokens/)
4. Click **"Create a token"**
5. Give it a name (e.g., "Cruizr App")
6. Select the following scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
7. Click **"Create token"**
8. **Copy and save the token** - you won't be able to see it again!

### 2. Google AI API Key (Gemini)

Google AI is required for AI-powered features using Genkit.

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **"Get API Key"**
3. Select your Firebase project or create a new Google Cloud project
4. Click **"Create API key"**
5. **Copy and save the API key**

**Important Notes:**
- The Google AI API key is used for Gemini model access
- Free tier includes 60 requests per minute
- Monitor your usage in the [Google Cloud Console](https://console.cloud.google.com/)

### 3. Firebase Configuration Values

You already obtained these when registering your web app in step 3 of "Firebase Project Setup". If you need to retrieve them again:

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** → **Project settings**
4. Scroll down to **"Your apps"**
5. Click on your web app
6. You'll see all the configuration values

## GitHub Secrets Configuration

To enable CI/CD deployment, you need to add secrets to your GitHub repository.

### 1. Access Repository Secrets

1. Go to your GitHub repository
2. Click **"Settings"** (top navigation)
3. In the left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**

### 2. Add Required Secrets

Add the following secrets one by one by clicking "New repository secret" for each:

#### Mapbox Secret
- **Name:** `MAPBOX_ACCESS_TOKEN`
- **Value:** Your Mapbox access token from step 1

#### Google AI Secret
- **Name:** `GOOGLE_GENAI_API_KEY`
- **Value:** Your Google AI API key from step 2

#### Firebase Configuration Secrets
- **Name:** `FIREBASE_API_KEY`
- **Value:** The `apiKey` from your Firebase config

- **Name:** `FIREBASE_AUTH_DOMAIN`
- **Value:** The `authDomain` from your Firebase config

- **Name:** `FIREBASE_PROJECT_ID`
- **Value:** The `projectId` from your Firebase config

- **Name:** `FIREBASE_STORAGE_BUCKET`
- **Value:** The `storageBucket` from your Firebase config

- **Name:** `FIREBASE_MESSAGING_SENDER_ID`
- **Value:** The `messagingSenderId` from your Firebase config

- **Name:** `FIREBASE_APP_ID`
- **Value:** The `appId` from your Firebase config

#### Firebase Service Account Secret

This is required for GitHub Actions to deploy to Firebase.

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** → **Project settings**
4. Click the **"Service accounts"** tab
5. Click **"Generate new private key"**
6. Save the downloaded JSON file securely
7. Open the JSON file and **copy its entire contents**
8. In GitHub, create a new secret:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** The entire JSON content from the file

### 3. Verify All Secrets Are Added

After adding all secrets, you should have 9 secrets total:
- ✅ `MAPBOX_ACCESS_TOKEN`
- ✅ `GOOGLE_GENAI_API_KEY`
- ✅ `FIREBASE_API_KEY`
- ✅ `FIREBASE_AUTH_DOMAIN`
- ✅ `FIREBASE_PROJECT_ID`
- ✅ `FIREBASE_STORAGE_BUCKET`
- ✅ `FIREBASE_MESSAGING_SENDER_ID`
- ✅ `FIREBASE_APP_ID`
- ✅ `FIREBASE_SERVICE_ACCOUNT`

## Deployment Process

### Automatic Deployment (Recommended)

Once GitHub secrets are configured, deployment is automatic:

1. **Push to main branch:**
   ```bash
   git push origin main
   ```

2. **GitHub Actions will automatically:**
   - Install dependencies
   - Run type checking
   - Run linting
   - Build the application
   - Deploy to Firebase App Hosting

3. **Monitor deployment:**
   - Go to your repository on GitHub
   - Click the **"Actions"** tab
   - Watch the workflow progress in real-time

4. **View deployed app:**
   - After successful deployment, check your Firebase console
   - The app will be available at: `https://your-project-id.web.app`

### Manual Deployment

If you need to deploy manually:

```bash
# Build the application locally
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Or deploy everything (hosting, firestore, storage)
firebase deploy
```

## Troubleshooting

### Build Failures

#### Error: "Module not found"
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Error: "Environment variable not defined"
- Ensure all GitHub secrets are configured correctly
- Check that secret names match exactly (case-sensitive)
- Verify the workflow YAML file references the correct secret names

### Deployment Failures

#### Error: "Permission denied"
- Verify the `FIREBASE_SERVICE_ACCOUNT` secret contains valid JSON
- Ensure the service account has sufficient permissions
- Try regenerating the service account key

#### Error: "Project not found"
- Verify `FIREBASE_PROJECT_ID` matches your actual Firebase project ID
- Check the Firebase console to confirm the project exists

### Runtime Issues

#### Maps not loading
- Verify `MAPBOX_ACCESS_TOKEN` is set correctly
- Check the Mapbox token has the required scopes
- Check browser console for specific error messages

#### AI features not working
- Verify `GOOGLE_GENAI_API_KEY` is valid
- Check you haven't exceeded API rate limits
- Review the [Google AI Studio quota limits](https://ai.google.dev/pricing)

### Getting Help

If you encounter issues not covered here:

1. Check the [Firebase documentation](https://firebase.google.com/docs)
2. Review GitHub Actions logs for detailed error messages
3. Check Firebase console logs under **"Functions"** or **"Hosting"**
4. Search existing [GitHub issues](https://github.com/AndySDisIT/studio/issues)
5. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details

## Environment Variables Reference

### Required for Development

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...  # From Mapbox
GOOGLE_GENAI_API_KEY=AIza...                # From Google AI Studio
```

### Required for Production

```env
# All development variables plus:
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Yes | Mapbox API token for map rendering and geocoding |
| `GOOGLE_GENAI_API_KEY` | Yes | Google AI API key for Gemini model access |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase authentication domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase project identifier |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase storage bucket URL |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase Cloud Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase web app identifier |

### Security Notes

- **Never commit** `.env.local` or `.env*.local` files to git
- Use `.env.example` as a template (safe to commit)
- Rotate API keys regularly for security
- Use Firebase security rules to protect data
- Monitor API usage to detect unauthorized access

---

## Next Steps

After successful deployment:

1. ✅ Set up custom domain (optional)
2. ✅ Configure Firebase Authentication
3. ✅ Set up Firestore database
4. ✅ Enable Firebase Analytics
5. ✅ Set up error monitoring (Sentry, etc.)
6. ✅ Configure CDN for assets

For more information, see [QUICKSTART.md](./QUICKSTART.md) for local development instructions.

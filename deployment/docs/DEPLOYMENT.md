# Cruizr Full-Stack Deployment Guide

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Deployment Architecture](#deployment-architecture)
- [Deployment Scripts](#deployment-scripts)
- [Environment Configuration](#environment-configuration)
- [Docker Deployment](#docker-deployment)
- [Firebase Deployment](#firebase-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

## Overview

This guide provides complete instructions for deploying the Cruizr application - a Next.js-based social discovery platform with GPS-based user discovery, realm selection, and AI-powered features.

### Technology Stack
- **Frontend:** Next.js 15.3.3, React 18, TypeScript
- **Styling:** Tailwind CSS with custom theme
- **Maps:** Mapbox GL
- **AI:** Google Genkit
- **Hosting:** Firebase App Hosting
- **Containerization:** Docker
- **CI/CD:** GitHub Actions

## Prerequisites

### Required Software
1. **Node.js** (v20.x or higher)
   ```powershell
   node --version
   ```

2. **npm** (comes with Node.js)
   ```powershell
   npm --version
   ```

3. **Firebase CLI**
   ```powershell
   npm install -g firebase-tools
   firebase --version
   ```

4. **Docker** (optional, for containerized deployment)
   ```powershell
   docker --version
   docker-compose --version
   ```

5. **Git**
   ```powershell
   git --version
   ```

### Required Accounts & API Keys
1. **Firebase Project**
   - Create project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firebase App Hosting
   - Generate service account credentials

2. **Mapbox Account**
   - Sign up at [Mapbox](https://www.mapbox.com/)
   - Generate access token

3. **Google AI Studio** (for Genkit)
   - Get API key from [AI Studio](https://aistudio.google.com/app/apikey)

## Quick Start

### 1. Clone and Setup
```powershell
# Clone the repository
git clone https://github.com/AndySDisIT/studio.git
cd studio

# Install dependencies
npm ci
```

### 2. Configure Environment
```powershell
# Copy environment template
Copy-Item .env.example .env.local

# Edit .env.local with your actual credentials
notepad .env.local
```

### 3. Local Development
```powershell
# Start development server
npm run dev

# Or use Docker
docker-compose up cruizr-dev
```

### 4. Deploy to Firebase
```powershell
# Deploy to development
.\deployment\scripts\deploy.ps1 -Environment development

# Deploy to production
.\deployment\scripts\deploy.ps1 -Environment production
```

## Deployment Architecture

### Environment Structure
```
├── Development (localhost:9002)
│   └── For local testing and development
├── Staging (cruizr-staging.web.app)
│   └── For QA and pre-production testing
└── Production (cruizr-prod.web.app)
    └── Live production environment
```

### File Structure
```
studio/
├── deployment/
│   ├── scripts/
│   │   ├── deploy.ps1              # Main deployment orchestrator
│   │   ├── setup-environment.ps1   # Environment configuration
│   │   ├── build-docker.ps1        # Docker build automation
│   │   ├── deploy-firebase.ps1     # Firebase deployment
│   │   ├── test-deployment.ps1     # Deployment verification
│   │   └── rollback.ps1            # Rollback functionality
│   ├── config/
│   │   ├── development.env         # Dev environment config
│   │   ├── staging.env             # Staging environment config
│   │   └── production.env          # Production environment config
│   ├── docs/
│   │   └── DEPLOYMENT.md          # This file
│   └── logs/                      # Deployment logs
├── .github/
│   └── workflows/
│       ├── build-test.yml         # CI pipeline
│       ├── deploy-dev.yml         # Dev deployment
│       ├── deploy-staging.yml     # Staging deployment
│       └── deploy-prod.yml        # Production deployment
├── Dockerfile                     # Production Docker image
├── Dockerfile.dev                 # Development Docker image
├── docker-compose.yml             # Docker Compose configuration
└── .env.example                   # Environment variable template
```

## Deployment Scripts

### Main Deployment Script
**Location:** `deployment/scripts/deploy.ps1`

**Usage:**
```powershell
# Full deployment with all checks
.\deployment\scripts\deploy.ps1 -Environment production

# Skip tests (faster deployment)
.\deployment\scripts\deploy.ps1 -Environment staging -SkipTests

# Skip build (use existing build)
.\deployment\scripts\deploy.ps1 -Environment development -SkipBuild

# Deploy with Docker
.\deployment\scripts\deploy.ps1 -Environment production -UseDocker

# Verbose output
.\deployment\scripts\deploy.ps1 -Environment development -Verbose
```

**Parameters:**
- `-Environment`: Target environment (development/staging/production)
- `-SkipTests`: Skip test execution
- `-SkipBuild`: Skip build process
- `-UseDocker`: Use Docker for deployment
- `-Verbose`: Enable verbose logging

### Environment Setup Script
**Location:** `deployment/scripts/setup-environment.ps1`

**Usage:**
```powershell
.\deployment\scripts\setup-environment.ps1 -Environment production
```

This script:
- Creates environment-specific configuration
- Validates environment variables
- Sets up NODE_ENV
- Creates missing configuration files

### Docker Build Script
**Location:** `deployment/scripts/build-docker.ps1`

**Usage:**
```powershell
# Build Docker image
.\deployment\scripts\build-docker.ps1 -Environment production -Tag v1.0.0

# Build and push to registry
.\deployment\scripts\build-docker.ps1 -Environment production -Tag v1.0.0 -Push

# Specify custom registry
.\deployment\scripts\build-docker.ps1 -Environment production -Registry gcr.io -ProjectId my-project
```

**Parameters:**
- `-Environment`: Target environment
- `-Tag`: Docker image tag
- `-Push`: Push to container registry
- `-Registry`: Container registry URL
- `-ProjectId`: GCP project ID

### Firebase Deployment Script
**Location:** `deployment/scripts/deploy-firebase.ps1`

**Usage:**
```powershell
# Deploy to Firebase
.\deployment\scripts\deploy-firebase.ps1 -Environment production

# Deploy only hosting (skip functions, etc.)
.\deployment\scripts\deploy-firebase.ps1 -Environment production -OnlyHosting

# Force deployment
.\deployment\scripts\deploy-firebase.ps1 -Environment production -Force

# Specify custom project ID
.\deployment\scripts\deploy-firebase.ps1 -Environment production -ProjectId my-firebase-project
```

### Deployment Verification Script
**Location:** `deployment/scripts/test-deployment.ps1`

**Usage:**
```powershell
# Test deployment
.\deployment\scripts\test-deployment.ps1 -Environment production

# Test custom URL
.\deployment\scripts\test-deployment.ps1 -Url https://my-app.web.app
```

This script tests:
- URL accessibility
- Page content verification
- API endpoint availability
- Response time
- SSL certificate validity

### Rollback Script
**Location:** `deployment/scripts/rollback.ps1`

**Usage:**
```powershell
# List available backups
.\deployment\scripts\rollback.ps1 -Environment production -ListBackups

# Rollback to latest backup
.\deployment\scripts\rollback.ps1 -Environment production

# Rollback to specific backup
.\deployment\scripts\rollback.ps1 -Environment production -BackupTimestamp 20240124_143022

# Force rollback without confirmation
.\deployment\scripts\rollback.ps1 -Environment production -Force
```

## Environment Configuration

### Configuration Files
Each environment has its own configuration file in `deployment/config/`:
- `development.env` - Development environment
- `staging.env` - Staging environment
- `production.env` - Production environment

### Required Environment Variables

#### Application Settings
```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

#### Next.js Configuration
```env
NEXT_PUBLIC_APP_NAME=Cruizr
NEXT_PUBLIC_API_URL=https://api.cruizr.app
NEXT_TELEMETRY_DISABLED=1
```

#### Mapbox (Required)
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
```

#### Google Genkit AI (Required)
```env
GOOGLE_GENKIT_API_KEY=AIza...
```

#### Firebase Configuration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cruizr.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cruizr-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cruizr-prod.appspot.com
```

### Setting Up Environment Variables

1. **Local Development:**
   ```powershell
   Copy-Item .env.example .env.local
   # Edit .env.local with actual values
   ```

2. **Deployment Environments:**
   ```powershell
   # Edit the appropriate config file
   notepad deployment\config\production.env
   ```

3. **GitHub Actions:**
   - Go to repository Settings > Secrets and variables > Actions
   - Add required secrets:
     - `MAPBOX_ACCESS_TOKEN`
     - `GOOGLE_GENKIT_API_KEY`
     - `FIREBASE_SERVICE_ACCOUNT_PROD`
     - `FIREBASE_PROJECT_ID_PROD`

## Docker Deployment

### Building Docker Images

#### Development Image
```powershell
# Build development image
docker build -t cruizr-dev -f Dockerfile.dev .

# Run development container
docker run -p 9002:9002 --env-file .env.local cruizr-dev
```

#### Production Image
```powershell
# Build production image
docker build -t cruizr-app .

# Run production container
docker run -p 3000:3000 --env-file .env.production cruizr-app
```

### Using Docker Compose

#### Start Development Environment
```powershell
# Start development services
docker-compose up cruizr-dev

# Start in background
docker-compose up -d cruizr-dev
```

#### Start Production Environment (Local Testing)
```powershell
# Start production services
docker-compose --profile production up cruizr-prod

# Start in background
docker-compose --profile production up -d cruizr-prod
```

#### Useful Commands
```powershell
# Stop services
docker-compose down

# View logs
docker-compose logs -f cruizr-dev

# Rebuild images
docker-compose build --no-cache
```

### Pushing to Container Registry

#### Google Container Registry (GCR)
```powershell
# Authenticate
gcloud auth configure-docker

# Build and tag
docker build -t gcr.io/my-project/cruizr-app:v1.0.0 .

# Push
docker push gcr.io/my-project/cruizr-app:v1.0.0
```

## Firebase Deployment

### Prerequisites
1. **Install Firebase CLI:**
   ```powershell
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```powershell
   firebase login
   ```

3. **Select Project:**
   ```powershell
   firebase use your-project-id
   ```

### Manual Deployment

#### Build Application
```powershell
# Install dependencies
npm ci

# Build for production
npm run build
```

#### Deploy to Firebase
```powershell
# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy with specific project
firebase deploy -P your-project-id
```

### Automated Deployment
Use the PowerShell scripts for automated deployment:
```powershell
# Complete deployment pipeline
.\deployment\scripts\deploy.ps1 -Environment production
```

### Firebase Configuration
The app uses `apphosting.yaml` for Firebase App Hosting configuration:
```yaml
runConfig:
  maxInstances: 1
  env:
    - variable: NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      secret: MAPBOX_ACCESS_TOKEN
```

## CI/CD Pipeline

### GitHub Actions Workflows

#### Build and Test (`build-test.yml`)
Triggers on: Pull requests and pushes to main/develop

Steps:
1. Lint code
2. Type check
3. Build application
4. Test Docker build

#### Development Deployment (`deploy-dev.yml`)
Triggers on: Push to develop branch

Steps:
1. Build application
2. Deploy to Firebase development project

#### Staging Deployment (`deploy-staging.yml`)
Triggers on: Push to staging branch

Steps:
1. Build application
2. Deploy to Firebase staging project

#### Production Deployment (`deploy-prod.yml`)
Triggers on: Push to main branch or version tags

Steps:
1. Type check
2. Lint
3. Build application
4. Deploy to Firebase production project
5. Create deployment summary

### Setting Up CI/CD

1. **Configure GitHub Secrets:**
   - `MAPBOX_ACCESS_TOKEN`
   - `GOOGLE_GENKIT_API_KEY`
   - `FIREBASE_SERVICE_ACCOUNT_DEV`
   - `FIREBASE_SERVICE_ACCOUNT_STAGING`
   - `FIREBASE_SERVICE_ACCOUNT_PROD`
   - `FIREBASE_PROJECT_ID_DEV`
   - `FIREBASE_PROJECT_ID_STAGING`
   - `FIREBASE_PROJECT_ID_PROD`

2. **Create Branch Protection Rules:**
   - Require PR reviews for main branch
   - Require status checks to pass
   - Require branches to be up to date

3. **Configure Environments in GitHub:**
   - Create environments: development, staging, production
   - Add environment-specific secrets
   - Configure deployment protection rules

## Monitoring and Logging

### Deployment Logs
All deployment logs are stored in `deployment/logs/`:
```
deployment/logs/
├── deploy_production_20240124_143022.log
├── deploy_staging_20240124_120033.log
└── rollback_production_20240124_150044.log
```

### Viewing Logs
```powershell
# View latest deployment log
Get-Content deployment\logs\deploy_production_*.log -Tail 50

# Monitor log in real-time
Get-Content deployment\logs\deploy_production_*.log -Wait
```

### Firebase Logs
```powershell
# View Firebase function logs
firebase functions:log

# View hosting logs
firebase hosting:channel:list
```

### Docker Logs
```powershell
# View container logs
docker logs cruizr-app

# Follow logs
docker logs -f cruizr-app

# View last 100 lines
docker logs --tail 100 cruizr-app
```

## Rollback Procedures

### Automatic Rollback
Use the rollback script:
```powershell
# List available backups
.\deployment\scripts\rollback.ps1 -Environment production -ListBackups

# Rollback to latest backup
.\deployment\scripts\rollback.ps1 -Environment production
```

### Manual Rollback

#### Using Git
```powershell
# Check git history
git log --oneline -10

# Checkout previous commit
git checkout <commit-hash>

# Redeploy
.\deployment\scripts\deploy.ps1 -Environment production
```

#### Using Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to Hosting
3. View deployment history
4. Select previous version
5. Click "Rollback"

### Emergency Rollback
```powershell
# Quick rollback without confirmation
.\deployment\scripts\rollback.ps1 -Environment production -Force

# Or revert last commit and redeploy
git revert HEAD
git push origin main
```

## Troubleshooting

### Common Issues

#### Issue: Build Fails with "Module not found"
**Solution:**
```powershell
# Clear cache and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

#### Issue: Docker build fails
**Solution:**
```powershell
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t cruizr-app .
```

#### Issue: Firebase deployment fails
**Solution:**
```powershell
# Relogin to Firebase
firebase logout
firebase login

# Check project access
firebase projects:list
```

#### Issue: Environment variables not loading
**Solution:**
```powershell
# Verify .env file exists
Test-Path .env.local

# Check file content
Get-Content .env.local

# Ensure no spaces around '='
# Correct: API_KEY=value
# Wrong: API_KEY = value
```

#### Issue: Port already in use
**Solution:**
```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 3000

# Kill process (replace PID)
Stop-Process -Id <PID> -Force
```

### Getting Help

1. **Check Logs:**
   ```powershell
   # Deployment logs
   Get-Content deployment\logs\*.log -Tail 100

   # Docker logs
   docker logs cruizr-app --tail 100

   # Firebase logs
   firebase hosting:channel:list
   ```

2. **Verify Configuration:**
   ```powershell
   # Check environment
   .\deployment\scripts\setup-environment.ps1 -Environment production

   # Verify Firebase project
   firebase use
   ```

3. **Test Deployment:**
   ```powershell
   # Run verification tests
   .\deployment\scripts\test-deployment.ps1 -Environment production
   ```

4. **Contact Support:**
   - Create issue on GitHub repository
   - Check Firebase status page
   - Review Next.js documentation

## Best Practices

### Before Deployment
1. ✅ Test locally
2. ✅ Run linter and type check
3. ✅ Update environment variables
4. ✅ Review changes in staging
5. ✅ Create backup

### During Deployment
1. ✅ Use deployment scripts
2. ✅ Monitor logs
3. ✅ Verify each step
4. ✅ Test immediately after deployment

### After Deployment
1. ✅ Run verification tests
2. ✅ Check application functionality
3. ✅ Monitor error logs
4. ✅ Document any issues
5. ✅ Keep backup for rollback

### Security
1. 🔒 Never commit secrets
2. 🔒 Use environment variables
3. 🔒 Rotate API keys regularly
4. 🔒 Enable Firebase security rules
5. 🔒 Use HTTPS in production

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Mapbox Documentation](https://docs.mapbox.com/)

## Support

For issues or questions:
- GitHub Issues: https://github.com/AndySDisIT/studio/issues
- Firebase Support: https://firebase.google.com/support

---

**Last Updated:** 2024-12-24
**Version:** 1.0.0

# Cruizr Deployment Infrastructure

## Overview

This directory contains the complete deployment infrastructure for the Cruizr application, including PowerShell scripts, Docker configurations, CI/CD pipelines, and comprehensive documentation.

## 📁 Directory Structure

```
deployment/
├── scripts/                    # PowerShell deployment automation
│   ├── deploy.ps1             # Main deployment orchestrator
│   ├── setup.ps1              # Initial environment setup
│   ├── setup-environment.ps1  # Environment configuration
│   ├── build-docker.ps1       # Docker build automation
│   ├── deploy-firebase.ps1    # Firebase deployment
│   ├── test-deployment.ps1    # Deployment verification
│   └── rollback.ps1           # Rollback functionality
├── config/                     # Environment configurations
│   ├── development.env        # Development environment
│   ├── staging.env            # Staging environment
│   └── production.env         # Production environment
├── docs/                       # Documentation
│   ├── QUICKSTART.md          # 5-minute quick start guide
│   ├── DEPLOYMENT.md          # Complete deployment guide
│   └── TROUBLESHOOTING.md     # Troubleshooting guide
├── logs/                       # Deployment logs (auto-created)
└── backups/                    # Deployment backups (auto-created)
```

## 🚀 Quick Start

### First Time Setup
```powershell
# Run the initial setup script
.\deployment\scripts\setup.ps1
```

This will:
- Check prerequisites
- Create directory structure
- Set up environment files
- Install dependencies
- Configure Firebase (optional)

### Deploy Application
```powershell
# Deploy to development
.\deployment\scripts\deploy.ps1 -Environment development

# Deploy to production
.\deployment\scripts\deploy.ps1 -Environment production
```

## 📚 Documentation

### For New Users
Start with the **[Quick Start Guide](docs/QUICKSTART.md)** - get running in 5 minutes.

### For Complete Setup
Read the **[Full Deployment Guide](docs/DEPLOYMENT.md)** for comprehensive instructions covering:
- Prerequisites and requirements
- Environment configuration
- Docker deployment
- Firebase deployment
- CI/CD pipeline setup
- Monitoring and logging
- Best practices

### When Things Go Wrong
Check the **[Troubleshooting Guide](docs/TROUBLESHOOTING.md)** for solutions to common issues:
- Build failures
- Docker issues
- Firebase problems
- Environment variable issues
- Network problems
- Performance optimization

## 🛠️ PowerShell Scripts

### Main Deployment Script
**File:** `scripts/deploy.ps1`

Complete deployment orchestrator that handles the entire deployment pipeline.

```powershell
# Full production deployment
.\deployment\scripts\deploy.ps1 -Environment production

# Quick development deployment (skip tests)
.\deployment\scripts\deploy.ps1 -Environment development -SkipTests

# Deploy with Docker
.\deployment\scripts\deploy.ps1 -Environment production -UseDocker

# Verbose logging
.\deployment\scripts\deploy.ps1 -Environment staging -Verbose
```

**Features:**
- Prerequisites checking
- Environment setup
- Build automation
- Testing integration
- Firebase deployment
- Verification testing
- Detailed logging

### Setup Scripts

#### Initial Setup
**File:** `scripts/setup.ps1`

First-time environment setup script.

```powershell
.\deployment\scripts\setup.ps1
```

**Features:**
- Prerequisite verification
- Directory structure creation
- Environment file generation
- Dependency installation
- Firebase configuration
- Build testing

#### Environment Configuration
**File:** `scripts/setup-environment.ps1`

Configure environment-specific settings.

```powershell
.\deployment\scripts\setup-environment.ps1 -Environment production
```

**Features:**
- Environment file creation
- Variable validation
- NODE_ENV configuration
- Configuration summary

### Build Scripts

#### Docker Build
**File:** `scripts/build-docker.ps1`

Automated Docker image building.

```powershell
# Build for production
.\deployment\scripts\build-docker.ps1 -Environment production -Tag v1.0.0

# Build and push to registry
.\deployment\scripts\build-docker.ps1 -Environment production -Tag v1.0.0 -Push

# Custom registry
.\deployment\scripts\build-docker.ps1 -Registry gcr.io -ProjectId my-project
```

**Features:**
- Multi-environment support
- Image tagging
- Registry push
- Build testing
- Image inspection

### Deployment Scripts

#### Firebase Deployment
**File:** `scripts/deploy-firebase.ps1`

Deploy to Firebase App Hosting.

```powershell
# Standard deployment
.\deployment\scripts\deploy-firebase.ps1 -Environment production

# Hosting only
.\deployment\scripts\deploy-firebase.ps1 -Environment production -OnlyHosting

# Custom project
.\deployment\scripts\deploy-firebase.ps1 -ProjectId custom-project-id
```

**Features:**
- Firebase authentication
- Project selection
- Deployment backup
- Deployment verification
- Deployment information

### Testing Scripts

#### Deployment Verification
**File:** `scripts/test-deployment.ps1`

Verify deployment is working correctly.

```powershell
# Test production deployment
.\deployment\scripts\test-deployment.ps1 -Environment production

# Test custom URL
.\deployment\scripts\test-deployment.ps1 -Url https://custom-url.com
```

**Tests:**
- URL accessibility
- Page content verification
- API endpoint checks
- Response time testing
- SSL certificate validation
- Comprehensive test summary

### Recovery Scripts

#### Rollback
**File:** `scripts/rollback.ps1`

Rollback to previous deployment.

```powershell
# List available backups
.\deployment\scripts\rollback.ps1 -Environment production -ListBackups

# Rollback to latest
.\deployment\scripts\rollback.ps1 -Environment production

# Rollback to specific backup
.\deployment\scripts\rollback.ps1 -Environment production -BackupTimestamp 20240124_143022

# Force rollback
.\deployment\scripts\rollback.ps1 -Environment production -Force
```

**Features:**
- Backup listing
- Automatic rollback
- Git history review
- Firebase rollback support
- Rollback reporting

## 🐳 Docker Configuration

### Production Dockerfile
**File:** `../Dockerfile`

Multi-stage production build optimized for size and performance.

**Stages:**
1. **deps** - Install production dependencies
2. **builder** - Build the application
3. **runner** - Minimal runtime image

**Build:**
```powershell
docker build -t cruizr-app .
```

### Development Dockerfile
**File:** `../Dockerfile.dev`

Development image with hot-reloading support.

**Build:**
```powershell
docker build -t cruizr-dev -f Dockerfile.dev .
```

### Docker Compose
**File:** `../docker-compose.yml`

Orchestrate development and production containers.

**Services:**
- `cruizr-dev` - Development service with hot-reload
- `cruizr-prod` - Production service (profile: production)

**Usage:**
```powershell
# Development
docker-compose up cruizr-dev

# Production
docker-compose --profile production up cruizr-prod
```

## ⚙️ Environment Configuration

### Configuration Files
Located in `config/`:
- `development.env` - Local development settings
- `staging.env` - Staging environment settings
- `production.env` - Production environment settings

### Required Variables
```env
# Application
NODE_ENV=production
PORT=3000

# Mapbox (Required)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token

# Google Genkit AI (Required)
GOOGLE_GENKIT_API_KEY=your_key

# Firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Setup
```powershell
# Copy template
Copy-Item .env.example .env.local

# Edit with actual values
notepad .env.local
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflows
Located in `../.github/workflows/`:

#### Build and Test
**File:** `build-test.yml`

Runs on: Pull requests and pushes to main/develop

**Jobs:**
- Lint code
- Type checking
- Application build
- Docker build test

#### Development Deployment
**File:** `deploy-dev.yml`

Runs on: Push to develop branch

**Deploys to:** Development Firebase project

#### Staging Deployment
**File:** `deploy-staging.yml`

Runs on: Push to staging branch

**Deploys to:** Staging Firebase project

#### Production Deployment
**File:** `deploy-prod.yml`

Runs on: Push to main branch or version tags

**Deploys to:** Production Firebase project with full validation

### Required Secrets
Configure in GitHub repository settings:
- `MAPBOX_ACCESS_TOKEN`
- `GOOGLE_GENKIT_API_KEY`
- `FIREBASE_SERVICE_ACCOUNT_DEV`
- `FIREBASE_SERVICE_ACCOUNT_STAGING`
- `FIREBASE_SERVICE_ACCOUNT_PROD`
- `FIREBASE_PROJECT_ID_DEV`
- `FIREBASE_PROJECT_ID_STAGING`
- `FIREBASE_PROJECT_ID_PROD`

## 📊 Monitoring and Logs

### Deployment Logs
All deployment activities are logged to `logs/`:

```
logs/
├── deploy_production_20240124_143022.log
├── deploy_staging_20240124_120033.log
└── rollback_production_20240124_150044.log
```

### View Logs
```powershell
# Latest log
Get-Content deployment\logs\deploy_production_*.log -Tail 50

# Follow log
Get-Content deployment\logs\deploy_production_*.log -Wait

# Search for errors
Get-Content deployment\logs\*.log | Select-String "ERROR"
```

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use `.env.example` as template
- ✅ Store secrets in GitHub Secrets
- ✅ Rotate API keys regularly

### Deployment
- ✅ Use HTTPS in production
- ✅ Enable Firebase security rules
- ✅ Configure proper CORS
- ✅ Implement rate limiting
- ✅ Regular security audits

### Access Control
- ✅ Limit Firebase project access
- ✅ Use service accounts for CI/CD
- ✅ Enable branch protection rules
- ✅ Require PR reviews for production

## 🆘 Support and Resources

### Documentation
- **Quick Start:** [docs/QUICKSTART.md](docs/QUICKSTART.md)
- **Full Guide:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Troubleshooting:** [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

### Getting Help
1. Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
2. Review deployment logs in `logs/`
3. Run verification tests: `.\deployment\scripts\test-deployment.ps1`
4. Create GitHub issue with logs and error details

## 📝 Checklist for New Deployments

### Before First Deployment
- [ ] Install prerequisites (Node.js, Firebase CLI, Docker)
- [ ] Run `.\deployment\scripts\setup.ps1`
- [ ] Configure `.env.local` with API keys
- [ ] Update `deployment/config/*.env` files
- [ ] Set up Firebase projects
- [ ] Configure GitHub Secrets
- [ ] Test build locally: `npm run build`

### Before Each Deployment
- [ ] Pull latest code: `git pull`
- [ ] Update dependencies if needed: `npm ci`
- [ ] Test locally: `npm run dev`
- [ ] Review changes: `git diff`
- [ ] Update environment variables if needed
- [ ] Run linter: `npm run lint`
- [ ] Run type check: `npm run typecheck`

### During Deployment
- [ ] Use appropriate environment flag
- [ ] Monitor deployment logs
- [ ] Watch for errors or warnings
- [ ] Note any unusual behavior

### After Deployment
- [ ] Run verification: `.\deployment\scripts\test-deployment.ps1`
- [ ] Test key features manually
- [ ] Check application logs
- [ ] Verify API endpoints
- [ ] Monitor error rates
- [ ] Document any issues

## 🔄 Version History

### Version 1.0.0 (2024-12-24)
- Initial deployment infrastructure
- Complete PowerShell automation scripts
- Docker containerization support
- CI/CD pipeline with GitHub Actions
- Comprehensive documentation
- Multi-environment support
- Rollback functionality
- Automated testing and verification

## 📞 Contact

For issues or questions:
- **GitHub Issues:** https://github.com/AndySDisIT/studio/issues
- **Firebase Support:** https://firebase.google.com/support

---

**Last Updated:** 2024-12-24  
**Maintained by:** Cruizr Development Team

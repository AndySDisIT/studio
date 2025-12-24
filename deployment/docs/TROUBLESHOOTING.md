# Cruizr Deployment Troubleshooting Guide

## Table of Contents
- [Prerequisites Issues](#prerequisites-issues)
- [Build Issues](#build-issues)
- [Docker Issues](#docker-issues)
- [Firebase Issues](#firebase-issues)
- [Environment Variable Issues](#environment-variable-issues)
- [Network and Connectivity Issues](#network-and-connectivity-issues)
- [Performance Issues](#performance-issues)
- [Debugging Tools and Commands](#debugging-tools-and-commands)

---

## Prerequisites Issues

### PowerShell Execution Policy Error
**Error:**
```
File cannot be loaded because running scripts is disabled on this system
```

**Solution:**
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or bypass for specific script
powershell.exe -ExecutionPolicy Bypass -File .\deployment\scripts\deploy.ps1
```

### Node.js Not Found
**Error:**
```
'node' is not recognized as an internal or external command
```

**Solution:**
```powershell
# Install Node.js from https://nodejs.org/
# Verify installation
node --version
npm --version

# If installed, add to PATH
$env:Path += ";C:\Program Files\nodejs\"
```

### Firebase CLI Not Found
**Error:**
```
'firebase' is not recognized as an internal or external command
```

**Solution:**
```powershell
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version

# If still not found, check global npm path
npm config get prefix

# Add npm global path to PATH
$env:Path += ";$env:APPDATA\npm"
```

---

## Build Issues

### Build Fails with "Out of Memory"
**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```powershell
# Increase Node.js memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"

# Then run build
npm run build

# Or modify package.json build script:
# "build": "NODE_OPTIONS=--max-old-space-size=4096 next build"
```

### TypeScript Errors During Build
**Error:**
```
Type error: Property 'x' does not exist on type 'Y'
```

**Solution:**
```powershell
# Check TypeScript version
npm list typescript

# Run type check separately
npm run typecheck

# If you need to ignore errors temporarily (not recommended for production)
# Already configured in next.config.ts:
# typescript: { ignoreBuildErrors: true }

# Better: Fix the actual errors
```

### Module Not Found Errors
**Error:**
```
Module not found: Can't resolve 'some-module'
```

**Solution:**
```powershell
# Clear cache and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm cache clean --force
npm install

# If specific module issue
npm install some-module --save

# Check for typos in import statements
```

### Build Hangs or Takes Too Long
**Symptoms:** Build process seems frozen

**Solution:**
```powershell
# Kill the process
Ctrl+C

# Clear Next.js cache
Remove-Item .next -Recurse -Force

# Rebuild
npm run build

# Use turbopack for faster builds (dev only)
npm run dev  # Already uses turbopack
```

---

## Docker Issues

### Docker Daemon Not Running
**Error:**
```
Cannot connect to the Docker daemon
```

**Solution:**
```powershell
# Start Docker Desktop
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait for Docker to start
Start-Sleep -Seconds 30

# Verify Docker is running
docker info
```

### Docker Build Fails with "No Space Left"
**Error:**
```
no space left on device
```

**Solution:**
```powershell
# Clean up Docker system
docker system prune -a --volumes

# Remove unused images
docker image prune -a

# Remove stopped containers
docker container prune

# Check disk space
docker system df
```

### Permission Denied in Docker
**Error:**
```
permission denied while trying to connect to the Docker daemon socket
```

**Solution (Windows):**
```powershell
# Run PowerShell as Administrator
# Add your user to docker-users group
net localgroup docker-users $env:USERNAME /add

# Restart Docker Desktop
Restart-Computer
```

### Docker Build Fails at npm ci
**Error:**
```
npm ERR! Cannot read property 'resolve' of undefined
```

**Solution:**
```dockerfile
# In Dockerfile, ensure proper node_modules handling
# Clear cache during build
RUN npm ci --only=production && npm cache clean --force
```

### Container Exits Immediately
**Symptoms:** Container starts then stops

**Solution:**
```powershell
# Check container logs
docker logs cruizr-app

# Run container in interactive mode
docker run -it cruizr-app /bin/sh

# Check if required files exist
docker run cruizr-app ls -la

# Verify environment variables
docker run cruizr-app env
```

---

## Firebase Issues

### Authentication Failed
**Error:**
```
HTTP Error: 401, Unauthorized
```

**Solution:**
```powershell
# Logout and login again
firebase logout
firebase login

# Use service account (CI/CD)
$env:GOOGLE_APPLICATION_CREDENTIALS="path\to\service-account.json"
firebase deploy

# Check logged-in accounts
firebase login:list
```

### Project Not Found
**Error:**
```
Error: Could not find project
```

**Solution:**
```powershell
# List available projects
firebase projects:list

# Use specific project
firebase use your-project-id

# Verify current project
firebase use

# Check .firebaserc file
Get-Content .firebaserc
```

### Deployment Quota Exceeded
**Error:**
```
Deployment quota exceeded
```

**Solution:**
```powershell
# Wait for quota reset (usually 24 hours)
# Or upgrade Firebase plan

# Deploy only specific targets
firebase deploy --only hosting

# Check Firebase Console for quota limits
```

### Build Hook Failed
**Error:**
```
Build failed: Error during build
```

**Solution:**
```powershell
# Check build logs in Firebase Console
firebase hosting:channel:list

# Test build locally first
npm run build

# Ensure all environment variables are set in apphosting.yaml
# Check apphosting.yaml configuration
```

### Firebase Functions Not Deployed
**Issue:** Functions not updating after deployment

**Solution:**
```powershell
# Deploy functions specifically
firebase deploy --only functions

# Delete and redeploy specific function
firebase functions:delete functionName
firebase deploy --only functions:functionName

# Check function logs
firebase functions:log
```

---

## Environment Variable Issues

### Environment Variables Not Loading
**Symptoms:** App runs but features don't work

**Solution:**
```powershell
# Verify .env file exists and is named correctly
Test-Path .env.local

# Check file content
Get-Content .env.local

# Ensure NEXT_PUBLIC_ prefix for client-side variables
# NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=value  # ✓ Correct
# MAPBOX_ACCESS_TOKEN=value              # ✗ Wrong (server-side only)

# Restart development server after changes
```

### Missing API Keys
**Error:**
```
API key not found or invalid
```

**Solution:**
```powershell
# Check if all required keys are set
$requiredKeys = @(
    'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
    'GOOGLE_GENKIT_API_KEY'
)

foreach ($key in $requiredKeys) {
    if (-not (Get-Content .env.local | Select-String $key)) {
        Write-Host "Missing: $key" -ForegroundColor Red
    }
}

# Get new keys:
# Mapbox: https://account.mapbox.com/access-tokens/
# Google AI: https://aistudio.google.com/app/apikey
```

### Environment-Specific Variables Not Applied
**Issue:** Wrong environment config used

**Solution:**
```powershell
# Explicitly set NODE_ENV
$env:NODE_ENV = "production"

# Use correct env file
Copy-Item deployment\config\production.env .env.production

# Verify environment
node -e "console.log(process.env.NODE_ENV)"

# Check which .env files Next.js loads (in order):
# .env.$(NODE_ENV).local
# .env.local
# .env.$(NODE_ENV)
# .env
```

---

## Network and Connectivity Issues

### Port Already in Use
**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```powershell
# Find process using the port
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Kill the process (replace <PID>)
Stop-Process -Id <PID> -Force

# Or use different port
$env:PORT = 3001
npm run dev
```

### Cannot Connect to Localhost
**Issue:** App doesn't load at http://localhost:3000

**Solution:**
```powershell
# Check if server is running
Get-Process -Name node -ErrorAction SilentlyContinue

# Check firewall settings
New-NetFirewallRule -DisplayName "Node.js" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Try 127.0.0.1 instead of localhost
# Open: http://127.0.0.1:3000

# Check if another service is proxying
netstat -ano | findstr :3000
```

### API Request Timeout
**Error:**
```
Request failed with timeout
```

**Solution:**
```powershell
# Increase timeout in next.config.ts
# export const config = {
#   api: {
#     responseLimit: false,
#     bodyParser: {
#       sizeLimit: '10mb',
#     },
#   },
# }

# Check network connectivity
Test-NetConnection google.com

# Verify API endpoint is accessible
Invoke-WebRequest -Uri "https://api.example.com" -TimeoutSec 30
```

---

## Performance Issues

### Slow Build Times
**Issue:** Builds take too long

**Solution:**
```powershell
# Use standalone build (already configured)
# output: 'standalone' in next.config.ts

# Clear Next.js cache
Remove-Item .next -Recurse -Force

# Disable source maps for faster builds (production)
# In next.config.ts:
# productionBrowserSourceMaps: false

# Use SWC instead of Babel (default in Next.js 15)

# Enable experimental features in next.config.ts:
# experimental: {
#   optimizeCss: true,
#   optimizePackageImports: ['lucide-react']
# }
```

### Large Bundle Size
**Issue:** Build output is too large

**Solution:**
```powershell
# Analyze bundle
npm install --save-dev @next/bundle-analyzer

# Add to next.config.ts:
# const withBundleAnalyzer = require('@next/bundle-analyzer')({
#   enabled: process.env.ANALYZE === 'true',
# })
# module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
$env:ANALYZE = "true"
npm run build

# Optimize imports
# Use dynamic imports for large components:
# const Map = dynamic(() => import('./Map'), { ssr: false })
```

### Slow Page Load
**Issue:** Pages load slowly in production

**Solution:**
```powershell
# Enable compression (Firebase handles this automatically)

# Optimize images
# Use next/image component (already used)

# Check Network tab in browser DevTools
# Look for:
# - Large assets
# - Slow API calls
# - Unoptimized images

# Implement caching headers in next.config.ts:
# async headers() {
#   return [
#     {
#       source: '/static/:path*',
#       headers: [
#         { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
#       ],
#     },
#   ]
# }
```

---

## Debugging Tools and Commands

### Deployment Debugging
```powershell
# Run deployment with verbose output
.\deployment\scripts\deploy.ps1 -Environment development -Verbose

# Check deployment logs
Get-Content deployment\logs\deploy_*.log | Select-String "ERROR"

# Test individual deployment steps
.\deployment\scripts\setup-environment.ps1 -Environment development
.\deployment\scripts\build-docker.ps1 -Environment development
.\deployment\scripts\test-deployment.ps1 -Environment development
```

### Docker Debugging
```powershell
# Inspect container
docker inspect cruizr-app

# Execute commands in container
docker exec -it cruizr-app /bin/sh

# Check container resources
docker stats cruizr-app

# View detailed logs
docker logs cruizr-app --timestamps --follow

# Check container filesystem
docker exec cruizr-app ls -la /app
```

### Firebase Debugging
```powershell
# Check Firebase status
firebase status

# View hosting sites
firebase hosting:sites:list

# Check deployment history
firebase hosting:clone

# Test Firebase emulators
firebase emulators:start

# View real-time logs
firebase functions:log --follow
```

### Network Debugging
```powershell
# Test connectivity
Test-NetConnection localhost -Port 3000

# Check DNS resolution
Resolve-DnsName cruizr-prod.web.app

# Trace route
tracert cruizr-prod.web.app

# Check SSL certificate
$url = "https://cruizr-prod.web.app"
$req = [System.Net.HttpWebRequest]::Create($url)
$req.GetResponse()
```

### Application Debugging
```powershell
# Enable debug mode
$env:DEBUG = "*"
npm run dev

# Check Next.js build info
npm run build
# Look for output in .next/build-manifest.json

# Test production build locally
npm run build
npm run start

# Check for JavaScript errors in browser console
# Open DevTools (F12) > Console tab
```

### Environment Debugging
```powershell
# Check all environment variables
Get-ChildItem env:

# Check specific variable
$env:NODE_ENV

# Verify .env loading
node -e "require('dotenv').config(); console.log(process.env)"

# Test environment setup script
.\deployment\scripts\setup-environment.ps1 -Environment production
```

---

## Quick Diagnostic Checklist

When deployment fails, check:

1. ✅ Prerequisites installed (Node, Firebase CLI, Docker)
2. ✅ Environment variables configured
3. ✅ Build completes successfully locally
4. ✅ Firebase authentication valid
5. ✅ Correct Firebase project selected
6. ✅ Docker daemon running (if using Docker)
7. ✅ Network connectivity
8. ✅ Sufficient disk space
9. ✅ No port conflicts
10. ✅ API keys valid and not expired

## Getting Additional Help

### Check Documentation
- Deployment Guide: `deployment/docs/DEPLOYMENT.md`
- Next.js Docs: https://nextjs.org/docs
- Firebase Docs: https://firebase.google.com/docs

### Run Diagnostic Commands
```powershell
# System info
Get-ComputerInfo | Select-Object WindowsVersion, OsArchitecture

# Check prerequisites
node --version
npm --version
firebase --version
docker --version

# Test deployment components
.\deployment\scripts\test-deployment.ps1 -Environment development
```

### Enable Verbose Logging
```powershell
# Deploy with verbose output
.\deployment\scripts\deploy.ps1 -Environment development -Verbose

# Firebase verbose mode
firebase deploy --debug

# Docker build with progress
docker build --progress=plain -t cruizr-app .
```

### Contact Support
- Create GitHub Issue: https://github.com/AndySDisIT/studio/issues
- Include:
  - Error message
  - Deployment logs
  - Environment (OS, Node version, etc.)
  - Steps to reproduce

---

**Last Updated:** 2024-12-24
**Version:** 1.0.0

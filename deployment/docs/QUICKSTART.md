# Cruizr Deployment Quick Start

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 20.x or higher
- npm (comes with Node.js)
- Firebase CLI (`npm install -g firebase-tools`)

### Step 1: Clone and Install (1 minute)
```powershell
git clone https://github.com/AndySDisIT/studio.git
cd studio
npm ci
```

### Step 2: Configure Environment (2 minutes)
```powershell
# Copy environment template
Copy-Item .env.example .env.local

# Edit with your API keys
notepad .env.local
```

**Required Keys:**
- Mapbox Token: https://account.mapbox.com/access-tokens/
- Google AI Key: https://aistudio.google.com/app/apikey

### Step 3: Run Locally (1 minute)
```powershell
npm run dev
```

Open http://localhost:9002

### Step 4: Deploy to Firebase (1 minute)
```powershell
# Login to Firebase
firebase login

# Deploy
.\deployment\scripts\deploy.ps1 -Environment development
```

## ✨ That's It!

Your Cruizr app is now deployed!

## Next Steps

### Local Development
```powershell
# Start development server
npm run dev

# Run with Docker
docker-compose up cruizr-dev

# Type check
npm run typecheck

# Lint
npm run lint
```

### Deploy to Different Environments
```powershell
# Development
.\deployment\scripts\deploy.ps1 -Environment development

# Staging
.\deployment\scripts\deploy.ps1 -Environment staging

# Production
.\deployment\scripts\deploy.ps1 -Environment production
```

### Docker Deployment
```powershell
# Build Docker image
.\deployment\scripts\build-docker.ps1 -Environment production

# Run Docker container
docker-compose --profile production up cruizr-prod
```

### Verify Deployment
```powershell
# Test deployment
.\deployment\scripts\test-deployment.ps1 -Environment production
```

### Rollback if Needed
```powershell
# List backups
.\deployment\scripts\rollback.ps1 -Environment production -ListBackups

# Rollback
.\deployment\scripts\rollback.ps1 -Environment production
```

## 📁 Project Structure

```
studio/
├── src/                          # Application source code
│   ├── app/                      # Next.js app directory
│   ├── components/               # React components
│   ├── ai/                       # Genkit AI flows
│   └── lib/                      # Utilities
├── deployment/                   # Deployment infrastructure
│   ├── scripts/                  # PowerShell deployment scripts
│   │   ├── deploy.ps1           # Main deployment
│   │   ├── build-docker.ps1     # Docker builds
│   │   ├── deploy-firebase.ps1  # Firebase deployment
│   │   ├── test-deployment.ps1  # Verification
│   │   └── rollback.ps1         # Rollback
│   ├── config/                   # Environment configs
│   └── docs/                     # Documentation
├── .github/workflows/            # CI/CD pipelines
├── Dockerfile                    # Production image
├── Dockerfile.dev                # Development image
├── docker-compose.yml            # Docker Compose
└── .env.example                  # Environment template
```

## 🔑 Environment Variables

### Required for Development
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token
GOOGLE_GENKIT_API_KEY=your_key
```

### Optional Features
```env
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
NEXT_PUBLIC_ENABLE_VEILMODE=true
```

## 🎯 Common Commands

### Development
```powershell
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # TypeScript check
```

### Deployment Scripts
```powershell
# Full deployment
.\deployment\scripts\deploy.ps1 -Environment production

# Skip tests (faster)
.\deployment\scripts\deploy.ps1 -Environment staging -SkipTests

# With Docker
.\deployment\scripts\deploy.ps1 -Environment production -UseDocker

# Verbose output
.\deployment\scripts\deploy.ps1 -Environment development -Verbose
```

### Docker Commands
```powershell
# Development
docker-compose up cruizr-dev

# Production (local)
docker-compose --profile production up cruizr-prod

# Build only
docker-compose build

# Stop all
docker-compose down
```

## 🐛 Troubleshooting

### Build Fails
```powershell
# Clear cache and rebuild
Remove-Item node_modules -Recurse -Force
Remove-Item .next -Recurse -Force
npm ci
npm run build
```

### Docker Issues
```powershell
# Clean Docker system
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Port In Use
```powershell
# Find and kill process
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

### Firebase Auth Issues
```powershell
# Relogin
firebase logout
firebase login
```

## 📚 Documentation

- **Full Deployment Guide:** `deployment/docs/DEPLOYMENT.md`
- **Troubleshooting:** `deployment/docs/TROUBLESHOOTING.md`
- **Firebase Setup:** See `apphosting.yaml`
- **Docker Config:** See `Dockerfile` and `docker-compose.yml`

## 🔒 Security Checklist

- [ ] Never commit `.env` files
- [ ] Rotate API keys regularly
- [ ] Use environment variables for secrets
- [ ] Enable Firebase security rules
- [ ] Use HTTPS in production
- [ ] Set up proper CORS

## 🎨 Features

- **Realm Selection:** 6 social realms (Professional, Social, Dating, Hook Up, Party, Ghost)
- **GPS Discovery:** Real-time user location on map
- **VeilMode™:** Privacy controls for users
- **AI-Powered:** Google Genkit for smart features
- **Real-time Maps:** Mapbox GL integration
- **Responsive UI:** Tailwind CSS with custom theme

## 🌐 Deployment URLs

Update these in `deployment/config/*.env`:

- **Development:** http://localhost:9002
- **Staging:** https://cruizr-staging.web.app
- **Production:** https://cruizr-prod.web.app

## 💡 Pro Tips

1. **Use Scripts:** Always use PowerShell scripts for deployment
2. **Test Locally:** Build and test locally before deploying
3. **Check Logs:** Monitor deployment logs in `deployment/logs/`
4. **Backup First:** Scripts create automatic backups
5. **Verify After:** Run test script after deployment
6. **Keep Secrets:** Use `.env.local` for local development
7. **Use Profiles:** Docker Compose has dev and prod profiles

## 🚨 Need Help?

1. Check `deployment/docs/TROUBLESHOOTING.md`
2. Run diagnostics: `.\deployment\scripts\test-deployment.ps1`
3. Check logs: `Get-Content deployment\logs\*.log`
4. Create GitHub issue

## 📞 Support

- **GitHub Issues:** https://github.com/AndySDisIT/studio/issues
- **Firebase Support:** https://firebase.google.com/support
- **Next.js Docs:** https://nextjs.org/docs

---

**Ready to deploy? Run:**
```powershell
.\deployment\scripts\deploy.ps1 -Environment production
```

**Happy Deploying! 🎉**

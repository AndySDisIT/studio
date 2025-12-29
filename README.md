# Cruizr - Social Discovery Platform

A Next.js-based social discovery application with GPS-based user discovery, realm selection, and AI-powered features deployed on Firebase App Hosting.

## Features

- 🌍 **GPS-Based Discovery:** Real-time user location and discovery using Mapbox
- 🎭 **Realm Selection:** 6 unique realms (Professional, Social, Dating, Hook Up, Party, Ghost)
- 🔒 **VeilMode™ Privacy:** Advanced privacy controls
- 🤖 **AI-Powered:** Google Genkit integration for smart features
- 🎨 **Modern UI:** Tailwind CSS with custom Cruizr theme
- 🚀 **Production Ready:** Full deployment infrastructure with Docker and CI/CD

## Quick Start

```powershell
# Install dependencies
npm ci

# Configure environment
Copy-Item .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002)

## Deployment

### Using PowerShell Scripts (Recommended)
```powershell
# Deploy to development
.\deployment\scripts\deploy.ps1 -Environment development

# Deploy to production
.\deployment\scripts\deploy.ps1 -Environment production
```

### Using Docker
```powershell
# Development
docker-compose up cruizr-dev

# Production
docker-compose --profile production up cruizr-prod
```

### Manual Deployment
```powershell
npm run build
firebase deploy
```

## Documentation

- 📖 **[Full Deployment Guide](deployment/docs/DEPLOYMENT.md)** - Complete deployment instructions
- 🚀 **[Quick Start Guide](deployment/docs/QUICKSTART.md)** - Get running in 5 minutes
- 🔧 **[Troubleshooting](deployment/docs/TROUBLESHOOTING.md)** - Common issues and solutions

## Project Structure

```
studio/
├── src/                    # Application source code
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── ai/                # Genkit AI flows
│   └── lib/               # Utilities
├── deployment/            # Deployment infrastructure
│   ├── scripts/          # PowerShell deployment scripts
│   ├── config/           # Environment configurations
│   └── docs/             # Documentation
├── .github/workflows/     # CI/CD pipelines
├── Dockerfile             # Production Docker image
└── docker-compose.yml     # Docker Compose configuration
```

## Technology Stack

- **Framework:** Next.js 15.3.3
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Mapbox GL
- **AI:** Google Genkit
- **Hosting:** Firebase App Hosting
- **Containerization:** Docker
- **CI/CD:** GitHub Actions

## Development

```powershell
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type check
```

## License

Private project - All rights reserved

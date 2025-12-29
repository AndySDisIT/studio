# Cruizr Deployment Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Development Flow                            │
└─────────────────────────────────────────────────────────────────────┘

Developer
    │
    ├──> Local Development
    │    ├─> npm run dev (Port 9002)
    │    └─> docker-compose up cruizr-dev
    │
    ├──> Git Commit & Push
    │    │
    │    └──> GitHub Repository
    │         │
    │         ├──> Branch: develop → Development Environment
    │         ├──> Branch: staging → Staging Environment
    │         └──> Branch: main → Production Environment
    │
    └──> Manual Deployment
         └─> PowerShell Scripts
             └─> deployment/scripts/deploy.ps1


┌─────────────────────────────────────────────────────────────────────┐
│                    Deployment Pipeline Flow                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Source Code  │
│  (GitHub)    │
└──────┬───────┘
       │
       v
┌──────────────────────────────────────────────────────────────────┐
│                     GitHub Actions CI/CD                          │
│  ┌────────────┐  ┌──────────┐  ┌────────┐  ┌──────────────┐   │
│  │   Lint     │─>│TypeCheck │─>│ Build  │─>│   Deploy     │   │
│  │  (ESLint)  │  │   (tsc)  │  │ (Next) │  │ (Firebase)   │   │
│  └────────────┘  └──────────┘  └────────┘  └──────────────┘   │
└──────────────────────────────┬───────────────────────────────────┘
                               │
                               v
                    ┌──────────────────┐
                    │ Firebase Hosting │
                    │   App Hosting    │
                    └─────────┬────────┘
                              │
              ┌───────────────┼───────────────┐
              v               v               v
        Development       Staging        Production
        (localhost)   (staging.web.app) (prod.web.app)


┌─────────────────────────────────────────────────────────────────────┐
│                   PowerShell Deployment Flow                         │
└─────────────────────────────────────────────────────────────────────┘

deploy.ps1
    │
    ├──> 1. Test-Prerequisites
    │    ├─> Check Node.js
    │    ├─> Check npm
    │    ├─> Check Firebase CLI
    │    └─> Check Docker (if needed)
    │
    ├──> 2. Invoke-EnvironmentSetup
    │    ├─> Load environment variables
    │    ├─> Validate configuration
    │    └─> Set NODE_ENV
    │
    ├──> 3. Invoke-BuildProcess
    │    ├─> Option A: npm build
    │    │   ├─> npm ci
    │    │   ├─> npm run typecheck
    │    │   ├─> npm run lint
    │    │   └─> npm run build
    │    │
    │    └─> Option B: Docker build
    │        ├─> build-docker.ps1
    │        └─> Docker image creation
    │
    ├──> 4. Invoke-Tests (if not skipped)
    │    └─> npm test
    │
    ├──> 5. Invoke-Deployment
    │    ├─> deploy-firebase.ps1
    │    │   ├─> Firebase login
    │    │   ├─> Set project
    │    │   ├─> Create backup
    │    │   └─> firebase deploy
    │    │
    │    └─> Deployment info
    │
    └──> 6. Invoke-DeploymentVerification
         └─> test-deployment.ps1
             ├─> URL accessibility
             ├─> Content verification
             ├─> API endpoints
             ├─> Response time
             └─> SSL certificate


┌─────────────────────────────────────────────────────────────────────┐
│                      Docker Architecture                             │
└─────────────────────────────────────────────────────────────────────┘

Dockerfile (Production)
    │
    ├──> Stage 1: deps
    │    ├─> node:20-alpine
    │    ├─> Copy package files
    │    └─> npm ci --only=production
    │
    ├──> Stage 2: builder
    │    ├─> Copy dependencies
    │    ├─> Copy source code
    │    ├─> npm ci (all deps)
    │    └─> npm run build
    │
    └──> Stage 3: runner
         ├─> Copy build artifacts
         ├─> Create non-root user
         ├─> Expose port 3000
         └─> node server.js

Dockerfile.dev (Development)
    │
    └──> Single Stage
         ├─> node:20-alpine
         ├─> Install all dependencies
         ├─> Copy source
         ├─> Expose port 9002
         └─> npm run dev


┌─────────────────────────────────────────────────────────────────────┐
│                     Environment Structure                            │
└─────────────────────────────────────────────────────────────────────┘

Environments
    │
    ├──> Development
    │    ├─> URL: http://localhost:9002
    │    ├─> Firebase: cruizr-dev
    │    ├─> Debug: Enabled
    │    └─> Purpose: Local development & testing
    │
    ├──> Staging
    │    ├─> URL: https://cruizr-staging.web.app
    │    ├─> Firebase: cruizr-staging
    │    ├─> Debug: Enabled
    │    └─> Purpose: QA & pre-production testing
    │
    └──> Production
         ├─> URL: https://cruizr-prod.web.app
         ├─> Firebase: cruizr-prod
         ├─> Debug: Disabled
         └─> Purpose: Live production environment


┌─────────────────────────────────────────────────────────────────────┐
│                    Configuration Management                          │
└─────────────────────────────────────────────────────────────────────┘

Environment Variables
    │
    ├──> .env.example (Template)
    │    └─> Reference for all variables
    │
    ├──> .env.local (Local Development)
    │    └─> Used by npm run dev
    │
    ├──> deployment/config/development.env
    │    └─> Development deployment settings
    │
    ├──> deployment/config/staging.env
    │    └─> Staging deployment settings
    │
    └──> deployment/config/production.env
         └─> Production deployment settings


┌─────────────────────────────────────────────────────────────────────┐
│                      Rollback Process                                │
└─────────────────────────────────────────────────────────────────────┘

Rollback Required
    │
    ├──> Automatic Backup
    │    ├─> Created before each deployment
    │    ├─> Stored in deployment/backups/
    │    └─> Contains metadata & build info
    │
    ├──> rollback.ps1
    │    ├─> List available backups
    │    ├─> Select backup version
    │    ├─> Review git history
    │    └─> Provide rollback instructions
    │
    └──> Manual Rollback Steps
         ├─> Option A: Git revert
         │   ├─> git checkout <commit>
         │   └─> redeploy
         │
         └─> Option B: Firebase Console
             └─> Select previous version


┌─────────────────────────────────────────────────────────────────────┐
│                    Monitoring & Logging                              │
└─────────────────────────────────────────────────────────────────────┘

Logs Location
    │
    ├──> Deployment Logs
    │    ├─> deployment/logs/
    │    ├─> deploy_ENV_TIMESTAMP.log
    │    └─> rollback_ENV_TIMESTAMP.log
    │
    ├──> Firebase Logs
    │    ├─> Firebase Console
    │    ├─> firebase functions:log
    │    └─> Real-time function logs
    │
    ├──> Docker Logs
    │    ├─> docker logs <container>
    │    └─> Stdout/stderr from containers
    │
    └──> Application Logs
         ├─> Browser Console
         ├─> Next.js build output
         └─> Server logs


┌─────────────────────────────────────────────────────────────────────┐
│                      Security Flow                                   │
└─────────────────────────────────────────────────────────────────────┘

Secrets Management
    │
    ├──> Local Development
    │    ├─> .env.local (git-ignored)
    │    └─> Never committed
    │
    ├──> CI/CD Pipeline
    │    ├─> GitHub Secrets
    │    ├─> Environment-specific
    │    └─> Injected at runtime
    │
    └──> Firebase Deployment
         ├─> Firebase Secrets
         ├─> apphosting.yaml config
         └─> Environment variables


┌─────────────────────────────────────────────────────────────────────┐
│                    Technology Stack                                  │
└─────────────────────────────────────────────────────────────────────┘

Application Layer
    ├─> Next.js 15.3.3 (Framework)
    ├─> React 18 (UI Library)
    ├─> TypeScript (Language)
    └─> Tailwind CSS (Styling)

Service Layer
    ├─> Mapbox GL (Maps)
    ├─> Google Genkit (AI)
    └─> Firebase SDK (Backend)

Deployment Layer
    ├─> Firebase App Hosting
    ├─> Docker (Containerization)
    ├─> GitHub Actions (CI/CD)
    └─> PowerShell (Automation)


┌─────────────────────────────────────────────────────────────────────┐
│                    File Structure                                    │
└─────────────────────────────────────────────────────────────────────┘

studio/
├── src/                          Application source
├── deployment/                   Deployment infrastructure
│   ├── scripts/                 PowerShell scripts
│   ├── config/                  Environment configs
│   ├── docs/                    Documentation
│   ├── logs/                    Deployment logs
│   └── backups/                 Deployment backups
├── .github/workflows/            CI/CD pipelines
├── Dockerfile                    Production image
├── Dockerfile.dev                Development image
├── docker-compose.yml            Compose config
└── .env.example                  Environment template


┌─────────────────────────────────────────────────────────────────────┐
│                      Quick Commands Reference                        │
└─────────────────────────────────────────────────────────────────────┘

Local Development:
    npm run dev                   Start dev server
    npm run build                 Build application
    npm run typecheck             Type checking
    npm run lint                  Linting

Docker:
    docker-compose up cruizr-dev  Development container
    docker-compose up cruizr-prod Production container
    docker-compose down           Stop containers

Deployment:
    .\deployment\scripts\deploy.ps1 -Environment production
    .\deployment\scripts\test-deployment.ps1 -Environment production
    .\deployment\scripts\rollback.ps1 -Environment production

Firebase:
    firebase login                Authenticate
    firebase use <project>        Select project
    firebase deploy               Deploy manually
```

## Key Features

### 1. Multi-Environment Support
- Development, Staging, and Production environments
- Isolated configurations for each environment
- Easy switching between environments

### 2. Automated Deployment
- PowerShell scripts for complete automation
- GitHub Actions for CI/CD
- Docker containerization support

### 3. Comprehensive Testing
- Build verification
- Type checking
- Linting
- Deployment verification
- SSL certificate validation

### 4. Rollback Capability
- Automatic backup creation
- Easy rollback mechanism
- Version history tracking

### 5. Security First
- Environment variable management
- Secrets isolation
- GitHub Secrets integration
- Firebase security rules

### 6. Complete Documentation
- Quick start guide
- Full deployment guide
- Troubleshooting documentation
- Inline script documentation

---

**For detailed information, see:**
- [Quick Start Guide](docs/QUICKSTART.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md)

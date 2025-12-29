# ============================================================================
# Initial Setup Script for Cruizr Deployment
# ============================================================================
# Run this script once to set up your deployment environment
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [switch]$SkipFirebase,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipDocker
)

$ErrorActionPreference = "Stop"

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = 'White'
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    param([string]$Title)
    Write-ColorOutput "`n============================================================================" "Cyan"
    Write-ColorOutput $Title "Cyan"
    Write-ColorOutput "============================================================================`n" "Cyan"
}

Write-Header "Cruizr Deployment Environment Setup"

# Step 1: Check Prerequisites
Write-ColorOutput "Step 1: Checking prerequisites..." "Yellow"

$missing = @()

try {
    $nodeVersion = node --version
    Write-ColorOutput "✓ Node.js $nodeVersion installed" "Green"
} catch {
    $missing += "Node.js"
    Write-ColorOutput "✗ Node.js not found" "Red"
}

try {
    $npmVersion = npm --version
    Write-ColorOutput "✓ npm $npmVersion installed" "Green"
} catch {
    $missing += "npm"
    Write-ColorOutput "✗ npm not found" "Red"
}

if (-not $SkipFirebase) {
    try {
        $firebaseVersion = firebase --version
        Write-ColorOutput "✓ Firebase CLI $firebaseVersion installed" "Green"
    } catch {
        Write-ColorOutput "✗ Firebase CLI not found" "Yellow"
        Write-ColorOutput "  Installing Firebase CLI..." "Cyan"
        npm install -g firebase-tools
        Write-ColorOutput "✓ Firebase CLI installed" "Green"
    }
}

if (-not $SkipDocker) {
    try {
        $dockerVersion = docker --version
        Write-ColorOutput "✓ Docker $dockerVersion installed" "Green"
    } catch {
        Write-ColorOutput "⚠ Docker not found (optional)" "Yellow"
    }
}

if ($missing.Count -gt 0) {
    Write-ColorOutput "`nMissing required tools: $($missing -join ', ')" "Red"
    Write-ColorOutput "Please install them and run this script again." "Red"
    exit 1
}

# Step 2: Create Directory Structure
Write-ColorOutput "`nStep 2: Creating directory structure..." "Yellow"

$dirs = @(
    "deployment\logs",
    "deployment\backups"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-ColorOutput "✓ Created $dir" "Green"
    } else {
        Write-ColorOutput "✓ $dir already exists" "Gray"
    }
}

# Step 3: Setup Environment Files
Write-ColorOutput "`nStep 3: Setting up environment files..." "Yellow"

if (-not (Test-Path ".env.local")) {
    Copy-Item .env.example .env.local
    Write-ColorOutput "✓ Created .env.local from template" "Green"
    Write-ColorOutput "  ⚠ Please edit .env.local with your actual API keys!" "Yellow"
} else {
    Write-ColorOutput "✓ .env.local already exists" "Gray"
}

# Step 4: Install Dependencies
Write-ColorOutput "`nStep 4: Installing dependencies..." "Yellow"
Write-ColorOutput "This may take a few minutes..." "Gray"

npm ci
if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput "✓ Dependencies installed successfully" "Green"
} else {
    Write-ColorOutput "✗ Failed to install dependencies" "Red"
    exit 1
}

# Step 5: Firebase Setup
if (-not $SkipFirebase) {
    Write-ColorOutput "`nStep 5: Firebase setup..." "Yellow"
    
    $doFirebaseSetup = Read-Host "Would you like to set up Firebase now? (yes/no)"
    
    if ($doFirebaseSetup -eq "yes") {
        Write-ColorOutput "Logging into Firebase..." "Cyan"
        firebase login
        
        Write-ColorOutput "`nAvailable Firebase projects:" "Cyan"
        firebase projects:list
        
        $projectId = Read-Host "`nEnter your Firebase project ID (or press Enter to skip)"
        
        if ($projectId) {
            firebase use $projectId
            Write-ColorOutput "✓ Firebase project set to: $projectId" "Green"
        }
    } else {
        Write-ColorOutput "⚠ Skipped Firebase setup" "Yellow"
        Write-ColorOutput "  Run 'firebase login' and 'firebase use <project-id>' later" "Gray"
    }
}

# Step 6: Create Firebase Configuration
Write-ColorOutput "`nStep 6: Checking Firebase configuration..." "Yellow"

if (-not (Test-Path ".firebaserc")) {
    $firebaseRc = @{
        projects = @{
            default = "your-project-id"
            development = "cruizr-dev"
            staging = "cruizr-staging"
            production = "cruizr-prod"
        }
    } | ConvertTo-Json
    
    $firebaseRc | Out-File -FilePath ".firebaserc" -Encoding UTF8
    Write-ColorOutput "✓ Created .firebaserc template" "Green"
    Write-ColorOutput "  ⚠ Please update with your actual project IDs" "Yellow"
} else {
    Write-ColorOutput "✓ .firebaserc already exists" "Gray"
}

if (-not (Test-Path "firebase.json")) {
    $firebaseJson = @{
        hosting = @{
            public = "out"
            ignore = @(
                "firebase.json",
                "**/.*",
                "**/node_modules/**"
            )
            rewrites = @(
                @{
                    source = "**"
                    destination = "/index.html"
                }
            )
        }
    } | ConvertTo-Json -Depth 10
    
    $firebaseJson | Out-File -FilePath "firebase.json" -Encoding UTF8
    Write-ColorOutput "✓ Created firebase.json" "Green"
} else {
    Write-ColorOutput "✓ firebase.json already exists" "Gray"
}

# Step 7: Test Build
Write-ColorOutput "`nStep 7: Testing build (optional)..." "Yellow"
$testBuild = Read-Host "Would you like to test the build now? This will take a few minutes. (yes/no)"

if ($testBuild -eq "yes") {
    Write-ColorOutput "Running build test..." "Cyan"
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColorOutput "✓ Build test successful!" "Green"
    } else {
        Write-ColorOutput "✗ Build test failed" "Red"
        Write-ColorOutput "  This is usually due to missing environment variables" "Yellow"
        Write-ColorOutput "  Please configure .env.local and try again" "Yellow"
    }
}

# Step 8: Summary
Write-Header "Setup Complete!"

Write-ColorOutput "Your Cruizr deployment environment is ready!" "Green"
Write-ColorOutput "`nNext Steps:" "Cyan"
Write-ColorOutput "  1. Edit .env.local with your API keys:" "White"
Write-ColorOutput "     - Mapbox Access Token" "Gray"
Write-ColorOutput "     - Google Genkit API Key" "Gray"
Write-ColorOutput "`n  2. Update .firebaserc with your project IDs" "White"
Write-ColorOutput "`n  3. Start development server:" "White"
Write-ColorOutput "     npm run dev" "Gray"
Write-ColorOutput "`n  4. Or deploy directly:" "White"
Write-ColorOutput "     .\deployment\scripts\deploy.ps1 -Environment development" "Gray"

Write-ColorOutput "`nDocumentation:" "Cyan"
Write-ColorOutput "  - Quick Start: deployment\docs\QUICKSTART.md" "Gray"
Write-ColorOutput "  - Full Guide: deployment\docs\DEPLOYMENT.md" "Gray"
Write-ColorOutput "  - Troubleshooting: deployment\docs\TROUBLESHOOTING.md" "Gray"

Write-ColorOutput "`n============================================================================" "Cyan"
Write-ColorOutput "Setup script completed successfully!" "Green"
Write-ColorOutput "============================================================================`n" "Cyan"

# ============================================================================
# Environment Setup Script for Cruizr
# ============================================================================
# This script sets up the environment configuration for deployment
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment = 'development'
)

$ErrorActionPreference = "Stop"

# ============================================================================
# Global Variables
# ============================================================================
$ScriptRoot = $PSScriptRoot
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptRoot)
$ConfigDir = Join-Path $ProjectRoot "deployment\config"
$EnvFile = Join-Path $ProjectRoot ".env.$Environment"

# ============================================================================
# Functions
# ============================================================================

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = 'White'
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-EnvFileExists {
    if (-not (Test-Path $EnvFile)) {
        Write-ColorOutput "Environment file not found: $EnvFile" "Yellow"
        Write-ColorOutput "Creating from template..." "Cyan"
        
        $exampleFile = Join-Path $ProjectRoot ".env.example"
        if (Test-Path $exampleFile) {
            Copy-Item $exampleFile $EnvFile
            Write-ColorOutput "Created $EnvFile from .env.example" "Green"
            Write-ColorOutput "Please update with actual values before deploying!" "Yellow"
        } else {
            Write-ColorOutput "No .env.example found. Creating basic template..." "Yellow"
            Create-EnvTemplate
        }
    } else {
        Write-ColorOutput "Environment file found: $EnvFile" "Green"
    }
}

function Create-EnvTemplate {
    $template = @"
# Cruizr Environment Configuration - $Environment
# Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Application
NODE_ENV=$Environment
PORT=3000
HOSTNAME=0.0.0.0

# Next.js
NEXT_PUBLIC_APP_NAME=Cruizr
NEXT_PUBLIC_API_URL=https://api.cruizr.app

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Google Genkit AI
GOOGLE_GENKIT_API_KEY=your_google_ai_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Security
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_TELEMETRY_DISABLED=1
"@

    $template | Out-File -FilePath $EnvFile -Encoding UTF8
    Write-ColorOutput "Created environment template: $EnvFile" "Green"
}

function Validate-EnvironmentVariables {
    Write-ColorOutput "Validating environment variables..." "Cyan"
    
    $envContent = Get-Content $EnvFile -Raw
    $requiredVars = @(
        'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
        'GOOGLE_GENKIT_API_KEY'
    )
    
    $missing = @()
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch "$var=\w+") {
            $missing += $var
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-ColorOutput "Warning: The following required variables may not be set:" "Yellow"
        $missing | ForEach-Object { Write-ColorOutput "  - $_" "Yellow" }
        Write-ColorOutput "Please update $EnvFile before deployment!" "Yellow"
    } else {
        Write-ColorOutput "All required environment variables appear to be set" "Green"
    }
}

function Set-EnvironmentForNode {
    Write-ColorOutput "Setting NODE_ENV to $Environment..." "Cyan"
    $env:NODE_ENV = $Environment
    Write-ColorOutput "NODE_ENV set to: $env:NODE_ENV" "Green"
}

function Display-ConfigSummary {
    Write-ColorOutput "`n============================================================================" "Cyan"
    Write-ColorOutput "Environment Configuration Summary" "Cyan"
    Write-ColorOutput "============================================================================" "Cyan"
    Write-ColorOutput "Environment: $Environment" "White"
    Write-ColorOutput "Config File: $EnvFile" "White"
    Write-ColorOutput "Project Root: $ProjectRoot" "White"
    Write-ColorOutput "NODE_ENV: $env:NODE_ENV" "White"
    Write-ColorOutput "============================================================================`n" "Cyan"
}

# ============================================================================
# Main Execution
# ============================================================================

Write-ColorOutput "`n============================================================================" "Cyan"
Write-ColorOutput "Cruizr Environment Setup" "Cyan"
Write-ColorOutput "============================================================================`n" "Cyan"

try {
    # Create config directory if it doesn't exist
    if (-not (Test-Path $ConfigDir)) {
        New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null
        Write-ColorOutput "Created config directory: $ConfigDir" "Green"
    }
    
    # Check and create environment file if needed
    Test-EnvFileExists
    
    # Validate environment variables
    Validate-EnvironmentVariables
    
    # Set NODE_ENV
    Set-EnvironmentForNode
    
    # Display summary
    Display-ConfigSummary
    
    Write-ColorOutput "Environment setup completed successfully!`n" "Green"
    exit 0
}
catch {
    Write-ColorOutput "`nEnvironment setup failed: $_" "Red"
    exit 1
}

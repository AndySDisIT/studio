# ============================================================================
# Cruizr Deployment Script - Main Orchestrator
# ============================================================================
# This script orchestrates the complete deployment process for the Cruizr
# application to Firebase App Hosting with Docker containerization.
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment = 'development',
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipTests,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipBuild,
    
    [Parameter(Mandatory=$false)]
    [switch]$UseDocker,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose
)

# Set error action preference
$ErrorActionPreference = "Stop"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

# ============================================================================
# Global Variables
# ============================================================================
$ScriptRoot = $PSScriptRoot
$ProjectRoot = Split-Path -Parent $ScriptRoot
$DeploymentRoot = Join-Path $ProjectRoot "deployment"
$LogDir = Join-Path $DeploymentRoot "logs"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$LogFile = Join-Path $LogDir "deploy_${Environment}_${Timestamp}.log"

# ============================================================================
# Functions
# ============================================================================

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet('INFO', 'WARNING', 'ERROR', 'SUCCESS')]
        [string]$Level = 'INFO'
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Ensure log directory exists
    if (-not (Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    
    # Write to log file
    Add-Content -Path $LogFile -Value $logMessage
    
    # Write to console with color
    switch ($Level) {
        'INFO'    { Write-Host $logMessage -ForegroundColor Cyan }
        'WARNING' { Write-Host $logMessage -ForegroundColor Yellow }
        'ERROR'   { Write-Host $logMessage -ForegroundColor Red }
        'SUCCESS' { Write-Host $logMessage -ForegroundColor Green }
    }
}

function Test-Prerequisites {
    Write-Log "Checking prerequisites..." "INFO"
    
    $missing = @()
    
    # Check Node.js
    try {
        $nodeVersion = node --version
        Write-Log "Node.js version: $nodeVersion" "INFO"
    } catch {
        $missing += "Node.js"
    }
    
    # Check npm
    try {
        $npmVersion = npm --version
        Write-Log "npm version: $npmVersion" "INFO"
    } catch {
        $missing += "npm"
    }
    
    # Check Firebase CLI
    try {
        $firebaseVersion = firebase --version
        Write-Log "Firebase CLI version: $firebaseVersion" "INFO"
    } catch {
        $missing += "Firebase CLI"
    }
    
    # Check Docker (if Docker deployment is requested)
    if ($UseDocker) {
        try {
            $dockerVersion = docker --version
            Write-Log "Docker version: $dockerVersion" "INFO"
        } catch {
            $missing += "Docker"
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Log "Missing prerequisites: $($missing -join ', ')" "ERROR"
        Write-Log "Please install missing tools before continuing." "ERROR"
        exit 1
    }
    
    Write-Log "All prerequisites met!" "SUCCESS"
}

function Invoke-EnvironmentSetup {
    Write-Log "Setting up environment: $Environment" "INFO"
    
    $setupScript = Join-Path $ScriptRoot "setup-environment.ps1"
    
    if (Test-Path $setupScript) {
        & $setupScript -Environment $Environment
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Environment setup failed" "ERROR"
            exit 1
        }
    } else {
        Write-Log "Setup script not found: $setupScript" "WARNING"
    }
}

function Invoke-BuildProcess {
    if ($SkipBuild) {
        Write-Log "Skipping build process (--SkipBuild flag set)" "WARNING"
        return
    }
    
    Write-Log "Starting build process..." "INFO"
    
    if ($UseDocker) {
        Write-Log "Building with Docker..." "INFO"
        $buildScript = Join-Path $ScriptRoot "build-docker.ps1"
        
        if (Test-Path $buildScript) {
            & $buildScript -Environment $Environment
            if ($LASTEXITCODE -ne 0) {
                Write-Log "Docker build failed" "ERROR"
                exit 1
            }
        } else {
            Write-Log "Docker build script not found" "ERROR"
            exit 1
        }
    } else {
        Write-Log "Building with npm..." "INFO"
        
        Push-Location $ProjectRoot
        try {
            # Install dependencies
            Write-Log "Installing dependencies..." "INFO"
            npm ci
            if ($LASTEXITCODE -ne 0) {
                throw "npm ci failed"
            }
            
            # Run type check
            Write-Log "Running type check..." "INFO"
            npm run typecheck
            if ($LASTEXITCODE -ne 0) {
                throw "Type check failed"
            }
            
            # Run linter
            Write-Log "Running linter..." "INFO"
            npm run lint
            if ($LASTEXITCODE -ne 0) {
                Write-Log "Linting errors found - continuing anyway" "WARNING"
            }
            
            # Build the application
            Write-Log "Building application..." "INFO"
            npm run build
            if ($LASTEXITCODE -ne 0) {
                throw "Build failed"
            }
            
            Write-Log "Build completed successfully!" "SUCCESS"
        }
        catch {
            Write-Log "Build process failed: $_" "ERROR"
            exit 1
        }
        finally {
            Pop-Location
        }
    }
}

function Invoke-Tests {
    if ($SkipTests) {
        Write-Log "Skipping tests (--SkipTests flag set)" "WARNING"
        return
    }
    
    Write-Log "Running tests..." "INFO"
    
    Push-Location $ProjectRoot
    try {
        # Check if test script exists
        $packageJson = Get-Content -Path "package.json" -Raw | ConvertFrom-Json
        
        if ($packageJson.scripts.test) {
            npm test
            if ($LASTEXITCODE -ne 0) {
                Write-Log "Tests failed" "ERROR"
                exit 1
            }
            Write-Log "All tests passed!" "SUCCESS"
        } else {
            Write-Log "No test script found in package.json - skipping" "WARNING"
        }
    }
    catch {
        Write-Log "Test execution failed: $_" "ERROR"
        exit 1
    }
    finally {
        Pop-Location
    }
}

function Invoke-Deployment {
    Write-Log "Starting deployment to Firebase..." "INFO"
    
    $deployScript = Join-Path $ScriptRoot "deploy-firebase.ps1"
    
    if (Test-Path $deployScript) {
        & $deployScript -Environment $Environment
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Firebase deployment failed" "ERROR"
            exit 1
        }
    } else {
        Write-Log "Firebase deployment script not found" "ERROR"
        exit 1
    }
}

function Invoke-DeploymentVerification {
    Write-Log "Verifying deployment..." "INFO"
    
    $testScript = Join-Path $ScriptRoot "test-deployment.ps1"
    
    if (Test-Path $testScript) {
        & $testScript -Environment $Environment
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Deployment verification failed" "WARNING"
        }
    } else {
        Write-Log "Deployment verification script not found" "WARNING"
    }
}

# ============================================================================
# Main Execution
# ============================================================================

Write-Log "============================================================================" "INFO"
Write-Log "Cruizr Deployment Process Started" "INFO"
Write-Log "Environment: $Environment" "INFO"
Write-Log "Docker: $UseDocker" "INFO"
Write-Log "Skip Tests: $SkipTests" "INFO"
Write-Log "Skip Build: $SkipBuild" "INFO"
Write-Log "============================================================================" "INFO"

try {
    # Step 1: Check Prerequisites
    Test-Prerequisites
    
    # Step 2: Setup Environment
    Invoke-EnvironmentSetup
    
    # Step 3: Build Application
    Invoke-BuildProcess
    
    # Step 4: Run Tests
    Invoke-Tests
    
    # Step 5: Deploy to Firebase
    Invoke-Deployment
    
    # Step 6: Verify Deployment
    Invoke-DeploymentVerification
    
    Write-Log "============================================================================" "SUCCESS"
    Write-Log "Deployment completed successfully!" "SUCCESS"
    Write-Log "Log file: $LogFile" "INFO"
    Write-Log "============================================================================" "SUCCESS"
}
catch {
    Write-Log "============================================================================" "ERROR"
    Write-Log "Deployment failed: $_" "ERROR"
    Write-Log "Log file: $LogFile" "INFO"
    Write-Log "============================================================================" "ERROR"
    exit 1
}

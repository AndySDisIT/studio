# ============================================================================
# Firebase Deployment Script for Cruizr
# ============================================================================
# This script deploys the Cruizr application to Firebase App Hosting
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment = 'development',
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = '',
    
    [Parameter(Mandatory=$false)]
    [switch]$OnlyHosting,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# ============================================================================
# Global Variables
# ============================================================================
$ScriptRoot = $PSScriptRoot
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptRoot)

# Environment-specific project IDs (update these)
$ProjectIds = @{
    'development' = 'cruizr-dev'
    'staging'     = 'cruizr-staging'
    'production'  = 'cruizr-prod'
}

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

function Get-FirebaseProjectId {
    if ($ProjectId) {
        return $ProjectId
    }
    
    if ($ProjectIds.ContainsKey($Environment)) {
        return $ProjectIds[$Environment]
    }
    
    Write-ColorOutput "No project ID configured for environment: $Environment" "Yellow"
    Write-ColorOutput "Please provide a project ID using -ProjectId parameter" "Yellow"
    
    # Try to get from firebase.json or .firebaserc
    $firebaseRc = Join-Path $ProjectRoot ".firebaserc"
    if (Test-Path $firebaseRc) {
        try {
            $config = Get-Content $firebaseRc -Raw | ConvertFrom-Json
            if ($config.projects.$Environment) {
                return $config.projects.$Environment
            }
            if ($config.projects.default) {
                return $config.projects.default
            }
        }
        catch {
            Write-ColorOutput "Failed to parse .firebaserc" "Yellow"
        }
    }
    
    throw "Unable to determine Firebase project ID"
}

function Test-FirebaseCLI {
    Write-ColorOutput "Checking Firebase CLI..." "Cyan"
    
    try {
        $version = firebase --version
        Write-ColorOutput "Firebase CLI version: $version" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "Firebase CLI is not installed" "Red"
        Write-ColorOutput "Install with: npm install -g firebase-tools" "Yellow"
        return $false
    }
}

function Invoke-FirebaseLogin {
    Write-ColorOutput "Checking Firebase authentication..." "Cyan"
    
    try {
        $result = firebase login:list 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Already logged in to Firebase" "Green"
        } else {
            Write-ColorOutput "Please log in to Firebase..." "Yellow"
            firebase login
            
            if ($LASTEXITCODE -ne 0) {
                throw "Firebase login failed"
            }
        }
    }
    catch {
        Write-ColorOutput "Please log in to Firebase manually" "Yellow"
        firebase login
    }
}

function Set-FirebaseProject {
    param([string]$ProjectId)
    
    Write-ColorOutput "Setting Firebase project: $ProjectId" "Cyan"
    
    Push-Location $ProjectRoot
    try {
        firebase use $ProjectId
        
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to set Firebase project"
        }
        
        Write-ColorOutput "Firebase project set to: $ProjectId" "Green"
    }
    finally {
        Pop-Location
    }
}

function Invoke-FirebaseDeploy {
    Write-ColorOutput "`nDeploying to Firebase..." "Cyan"
    
    Push-Location $ProjectRoot
    try {
        $deployArgs = @('deploy')
        
        if ($OnlyHosting) {
            $deployArgs += '--only', 'hosting'
        }
        
        if ($Force) {
            $deployArgs += '--force'
        }
        
        Write-ColorOutput "Executing: firebase $($deployArgs -join ' ')" "Gray"
        
        & firebase @deployArgs
        
        if ($LASTEXITCODE -ne 0) {
            throw "Firebase deployment failed with exit code $LASTEXITCODE"
        }
        
        Write-ColorOutput "`nDeployment completed successfully!" "Green"
    }
    catch {
        Write-ColorOutput "Firebase deployment failed: $_" "Red"
        throw
    }
    finally {
        Pop-Location
    }
}

function Show-DeploymentInfo {
    param([string]$ProjectId)
    
    Write-ColorOutput "`n============================================================================" "Cyan"
    Write-ColorOutput "Deployment Information" "Cyan"
    Write-ColorOutput "============================================================================" "Cyan"
    Write-ColorOutput "Environment: $Environment" "White"
    Write-ColorOutput "Project ID: $ProjectId" "White"
    Write-ColorOutput "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" "White"
    
    # Try to get hosting URL
    $hostingUrl = "https://$ProjectId.web.app"
    Write-ColorOutput "Expected URL: $hostingUrl" "White"
    
    Write-ColorOutput "============================================================================" "Cyan"
    Write-ColorOutput "Next Steps:" "Cyan"
    Write-ColorOutput "  1. Visit $hostingUrl to see your deployed app" "White"
    Write-ColorOutput "  2. Run test-deployment.ps1 to verify the deployment" "White"
    Write-ColorOutput "  3. Check Firebase Console for deployment status" "White"
    Write-ColorOutput "============================================================================`n" "Cyan"
}

function Backup-CurrentDeployment {
    param([string]$ProjectId)
    
    Write-ColorOutput "Creating deployment backup..." "Cyan"
    
    $backupDir = Join-Path $ProjectRoot "deployment\backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = Join-Path $backupDir "${Environment}_${timestamp}"
    
    try {
        if (-not (Test-Path $backupDir)) {
            New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
        }
        
        # Create backup metadata
        $metadata = @{
            Environment = $Environment
            ProjectId = $ProjectId
            Timestamp = $timestamp
            BuildPath = (Join-Path $ProjectRoot ".next")
        }
        
        $metadata | ConvertTo-Json | Out-File (Join-Path $backupPath "metadata.json")
        
        Write-ColorOutput "Backup created: $backupPath" "Green"
    }
    catch {
        Write-ColorOutput "Failed to create backup: $_" "Yellow"
    }
}

# ============================================================================
# Main Execution
# ============================================================================

Write-ColorOutput "`n============================================================================" "Cyan"
Write-ColorOutput "Cruizr Firebase Deployment" "Cyan"
Write-ColorOutput "============================================================================`n" "Cyan"

try {
    # Check Firebase CLI
    if (-not (Test-FirebaseCLI)) {
        throw "Firebase CLI not available"
    }
    
    # Get project ID
    $firebaseProjectId = Get-FirebaseProjectId
    Write-ColorOutput "Target Project: $firebaseProjectId" "White"
    
    # Login to Firebase
    Invoke-FirebaseLogin
    
    # Set Firebase project
    Set-FirebaseProject -ProjectId $firebaseProjectId
    
    # Create backup
    Backup-CurrentDeployment -ProjectId $firebaseProjectId
    
    # Deploy to Firebase
    Invoke-FirebaseDeploy
    
    # Show deployment info
    Show-DeploymentInfo -ProjectId $firebaseProjectId
    
    Write-ColorOutput "Firebase deployment completed successfully!`n" "Green"
    exit 0
}
catch {
    Write-ColorOutput "`nFirebase deployment failed: $_" "Red"
    exit 1
}

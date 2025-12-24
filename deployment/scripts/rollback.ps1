# ============================================================================
# Rollback Script for Cruizr
# ============================================================================
# This script provides rollback functionality for failed deployments
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment = 'development',
    
    [Parameter(Mandatory=$false)]
    [string]$BackupTimestamp = '',
    
    [Parameter(Mandatory=$false)]
    [switch]$ListBackups,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# ============================================================================
# Global Variables
# ============================================================================
$ScriptRoot = $PSScriptRoot
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptRoot)
$BackupDir = Join-Path $ProjectRoot "deployment\backups"

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

function Get-AvailableBackups {
    Write-ColorOutput "Searching for backups..." "Cyan"
    
    if (-not (Test-Path $BackupDir)) {
        Write-ColorOutput "No backup directory found: $BackupDir" "Yellow"
        return @()
    }
    
    $backups = Get-ChildItem -Path $BackupDir -Directory | 
               Where-Object { $_.Name -like "${Environment}_*" } |
               Sort-Object Name -Descending
    
    return $backups
}

function Show-AvailableBackups {
    $backups = Get-AvailableBackups
    
    if ($backups.Count -eq 0) {
        Write-ColorOutput "No backups found for environment: $Environment" "Yellow"
        return
    }
    
    Write-ColorOutput "`n============================================================================" "Cyan"
    Write-ColorOutput "Available Backups for $Environment" "Cyan"
    Write-ColorOutput "============================================================================`n" "Cyan"
    
    foreach ($backup in $backups) {
        $metadataPath = Join-Path $backup.FullName "metadata.json"
        
        Write-ColorOutput "Backup: $($backup.Name)" "White"
        Write-ColorOutput "  Created: $($backup.CreationTime)" "Gray"
        
        if (Test-Path $metadataPath) {
            try {
                $metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json
                Write-ColorOutput "  Project ID: $($metadata.ProjectId)" "Gray"
            }
            catch {
                Write-ColorOutput "  (Metadata unavailable)" "Gray"
            }
        }
        Write-ColorOutput ""
    }
    
    Write-ColorOutput "============================================================================`n" "Cyan"
}

function Get-BackupToRestore {
    if ($BackupTimestamp) {
        $backupPath = Join-Path $BackupDir "${Environment}_${BackupTimestamp}"
        
        if (Test-Path $backupPath) {
            return Get-Item $backupPath
        } else {
            throw "Backup not found: $backupPath"
        }
    }
    
    # Get most recent backup
    $backups = Get-AvailableBackups
    
    if ($backups.Count -eq 0) {
        throw "No backups available for environment: $Environment"
    }
    
    $latestBackup = $backups[0]
    Write-ColorOutput "Using most recent backup: $($latestBackup.Name)" "White"
    
    if (-not $Force) {
        $confirm = Read-Host "Confirm rollback to this backup? (yes/no)"
        if ($confirm -ne 'yes') {
            throw "Rollback cancelled by user"
        }
    }
    
    return $latestBackup
}

function Invoke-Rollback {
    param($Backup)
    
    Write-ColorOutput "`nStarting rollback process..." "Cyan"
    Write-ColorOutput "Backup: $($Backup.Name)" "White"
    
    # Read backup metadata
    $metadataPath = Join-Path $Backup.FullName "metadata.json"
    $metadata = $null
    
    if (Test-Path $metadataPath) {
        try {
            $metadata = Get-Content $metadataPath -Raw | ConvertFrom-Json
            Write-ColorOutput "Project ID: $($metadata.ProjectId)" "White"
        }
        catch {
            Write-ColorOutput "Warning: Could not read backup metadata" "Yellow"
        }
    }
    
    # For Firebase App Hosting, we need to redeploy the previous version
    Write-ColorOutput "`nNote: Firebase App Hosting rollback requires redeploying the previous build" "Yellow"
    Write-ColorOutput "To perform a complete rollback:" "Yellow"
    Write-ColorOutput "  1. Check out the previous git commit" "White"
    Write-ColorOutput "  2. Run the deployment script again" "White"
    Write-ColorOutput "  Or use Firebase Console to rollback to a previous version" "White"
    
    # Check git for rollback options
    Write-ColorOutput "`nChecking git history for rollback points..." "Cyan"
    
    Push-Location $ProjectRoot
    try {
        $commits = git --no-pager log --oneline -10
        
        Write-ColorOutput "`nRecent commits:" "Cyan"
        $commits | ForEach-Object { Write-ColorOutput "  $_" "Gray" }
        
        Write-ColorOutput "`nTo rollback using git:" "Yellow"
        Write-ColorOutput "  1. git checkout <commit-hash>" "White"
        Write-ColorOutput "  2. .\deployment\scripts\deploy.ps1 -Environment $Environment" "White"
    }
    finally {
        Pop-Location
    }
}

function Invoke-FirebaseRollback {
    Write-ColorOutput "`nAttempting Firebase hosting rollback..." "Cyan"
    
    Push-Location $ProjectRoot
    try {
        # Check if Firebase CLI supports rollback
        Write-ColorOutput "Checking Firebase hosting versions..." "Cyan"
        
        firebase hosting:channel:list 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "Firebase hosting channels available" "Green"
            Write-ColorOutput "You can rollback using Firebase Console:" "Yellow"
            Write-ColorOutput "  1. Go to Firebase Console > Hosting" "White"
            Write-ColorOutput "  2. View deployment history" "White"
            Write-ColorOutput "  3. Select a previous version to restore" "White"
        }
    }
    catch {
        Write-ColorOutput "Unable to check Firebase hosting versions" "Yellow"
    }
    finally {
        Pop-Location
    }
}

function Create-RollbackReport {
    param($Backup)
    
    $reportDir = Join-Path $ProjectRoot "deployment\logs"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $reportPath = Join-Path $reportDir "rollback_${Environment}_${timestamp}.log"
    
    if (-not (Test-Path $reportDir)) {
        New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
    }
    
    $report = @"
Cruizr Rollback Report
=====================================================
Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Environment: $Environment
Backup: $($Backup.Name)
Initiated by: $env:USERNAME

Status: Rollback instructions provided
Action required: Manual rollback via git or Firebase Console

=====================================================
"@
    
    $report | Out-File -FilePath $reportPath -Encoding UTF8
    Write-ColorOutput "`nRollback report saved: $reportPath" "Green"
}

# ============================================================================
# Main Execution
# ============================================================================

Write-ColorOutput "`n============================================================================" "Cyan"
Write-ColorOutput "Cruizr Deployment Rollback" "Cyan"
Write-ColorOutput "============================================================================`n" "Cyan"

try {
    # List backups if requested
    if ($ListBackups) {
        Show-AvailableBackups
        exit 0
    }
    
    # Get backup to restore
    $backupToRestore = Get-BackupToRestore
    
    # Perform rollback
    Invoke-Rollback -Backup $backupToRestore
    
    # Try Firebase-specific rollback
    Invoke-FirebaseRollback
    
    # Create rollback report
    Create-RollbackReport -Backup $backupToRestore
    
    Write-ColorOutput "`n============================================================================" "Green"
    Write-ColorOutput "Rollback Process Completed" "Green"
    Write-ColorOutput "============================================================================" "Green"
    Write-ColorOutput "Please follow the instructions above to complete the rollback" "Yellow"
    Write-ColorOutput "============================================================================`n" "Green"
    
    exit 0
}
catch {
    Write-ColorOutput "`nRollback failed: $_" "Red"
    exit 1
}

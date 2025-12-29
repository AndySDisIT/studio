# ============================================================================
# Docker Build Script for Cruizr
# ============================================================================
# This script builds Docker images for the Cruizr application
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment = 'development',
    
    [Parameter(Mandatory=$false)]
    [string]$Tag = 'latest',
    
    [Parameter(Mandatory=$false)]
    [switch]$Push,
    
    [Parameter(Mandatory=$false)]
    [string]$Registry = 'gcr.io',
    
    [Parameter(Mandatory=$false)]
    [string]$ProjectId = 'your-gcp-project-id'
)

$ErrorActionPreference = "Stop"

# ============================================================================
# Global Variables
# ============================================================================
$ScriptRoot = $PSScriptRoot
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptRoot)
$ImageName = "cruizr-app"
$FullImageName = "$Registry/$ProjectId/$ImageName`:$Tag"

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

function Test-DockerRunning {
    Write-ColorOutput "Checking if Docker is running..." "Cyan"
    
    try {
        docker info | Out-Null
        Write-ColorOutput "Docker is running" "Green"
        return $true
    }
    catch {
        Write-ColorOutput "Docker is not running or not installed" "Red"
        return $false
    }
}

function Build-DockerImage {
    param(
        [string]$Dockerfile
    )
    
    Write-ColorOutput "`nBuilding Docker image..." "Cyan"
    Write-ColorOutput "Image: $FullImageName" "White"
    Write-ColorOutput "Dockerfile: $Dockerfile" "White"
    Write-ColorOutput "Environment: $Environment" "White"
    
    Push-Location $ProjectRoot
    try {
        # Build the Docker image
        $buildArgs = @(
            "build",
            "-t", $FullImageName,
            "-t", "$ImageName`:$Tag",
            "-f", $Dockerfile,
            "--build-arg", "NODE_ENV=$Environment",
            "."
        )
        
        Write-ColorOutput "`nExecuting: docker $($buildArgs -join ' ')" "Gray"
        
        & docker @buildArgs
        
        if ($LASTEXITCODE -ne 0) {
            throw "Docker build failed with exit code $LASTEXITCODE"
        }
        
        Write-ColorOutput "`nDocker image built successfully!" "Green"
        Write-ColorOutput "Image: $FullImageName" "Green"
    }
    catch {
        Write-ColorOutput "Docker build failed: $_" "Red"
        throw
    }
    finally {
        Pop-Location
    }
}

function Test-DockerImage {
    Write-ColorOutput "`nTesting Docker image..." "Cyan"
    
    try {
        # Run container in detached mode
        Write-ColorOutput "Starting container for testing..." "Cyan"
        $containerId = docker run -d -p 3000:3000 --name cruizr-test $FullImageName
        
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to start container"
        }
        
        Write-ColorOutput "Container started: $containerId" "Green"
        
        # Wait for container to be healthy
        Write-ColorOutput "Waiting for container to start (10 seconds)..." "Cyan"
        Start-Sleep -Seconds 10
        
        # Check if container is running
        $status = docker inspect -f '{{.State.Running}}' cruizr-test
        
        if ($status -eq 'true') {
            Write-ColorOutput "Container is running successfully!" "Green"
            
            # Try to get logs
            Write-ColorOutput "`nContainer logs:" "Cyan"
            docker logs cruizr-test --tail 20
        } else {
            Write-ColorOutput "Container failed to start" "Red"
            docker logs cruizr-test
        }
    }
    catch {
        Write-ColorOutput "Docker image test failed: $_" "Yellow"
    }
    finally {
        # Cleanup test container
        Write-ColorOutput "`nCleaning up test container..." "Cyan"
        docker stop cruizr-test 2>&1 | Out-Null
        docker rm cruizr-test 2>&1 | Out-Null
        Write-ColorOutput "Test container removed" "Green"
    }
}

function Push-DockerImage {
    if (-not $Push) {
        Write-ColorOutput "`nSkipping image push (use -Push flag to push)" "Yellow"
        return
    }
    
    Write-ColorOutput "`nPushing Docker image to registry..." "Cyan"
    Write-ColorOutput "Registry: $Registry" "White"
    Write-ColorOutput "Image: $FullImageName" "White"
    
    try {
        docker push $FullImageName
        
        if ($LASTEXITCODE -ne 0) {
            throw "Docker push failed with exit code $LASTEXITCODE"
        }
        
        Write-ColorOutput "Image pushed successfully!" "Green"
    }
    catch {
        Write-ColorOutput "Failed to push image: $_" "Red"
        throw
    }
}

function Show-ImageInfo {
    Write-ColorOutput "`n============================================================================" "Cyan"
    Write-ColorOutput "Docker Image Information" "Cyan"
    Write-ColorOutput "============================================================================" "Cyan"
    
    $images = docker images $ImageName --format "{{.Repository}}:{{.Tag}} | {{.Size}} | {{.CreatedAt}}"
    $images | ForEach-Object { Write-ColorOutput $_ "White" }
    
    Write-ColorOutput "============================================================================`n" "Cyan"
}

# ============================================================================
# Main Execution
# ============================================================================

Write-ColorOutput "`n============================================================================" "Cyan"
Write-ColorOutput "Cruizr Docker Build Process" "Cyan"
Write-ColorOutput "============================================================================`n" "Cyan"

try {
    # Check if Docker is running
    if (-not (Test-DockerRunning)) {
        throw "Docker is not available"
    }
    
    # Determine which Dockerfile to use
    $dockerfile = if ($Environment -eq 'development') {
        Join-Path $ProjectRoot "Dockerfile.dev"
    } else {
        Join-Path $ProjectRoot "Dockerfile"
    }
    
    if (-not (Test-Path $dockerfile)) {
        throw "Dockerfile not found: $dockerfile"
    }
    
    # Build the Docker image
    Build-DockerImage -Dockerfile $dockerfile
    
    # Test the Docker image
    if ($Environment -ne 'development') {
        Test-DockerImage
    }
    
    # Push to registry if requested
    if ($Push) {
        Push-DockerImage
    }
    
    # Show final image info
    Show-ImageInfo
    
    Write-ColorOutput "Docker build process completed successfully!`n" "Green"
    exit 0
}
catch {
    Write-ColorOutput "`nDocker build process failed: $_" "Red"
    exit 1
}

# ============================================================================
# Deployment Verification Script for Cruizr
# ============================================================================
# This script verifies that the deployment is working correctly
# ============================================================================

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment = 'development',
    
    [Parameter(Mandatory=$false)]
    [string]$Url = ''
)

$ErrorActionPreference = "Stop"

# ============================================================================
# Global Variables
# ============================================================================
$ScriptRoot = $PSScriptRoot
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptRoot)

# Environment-specific URLs (update these)
$EnvironmentUrls = @{
    'development' = 'http://localhost:3000'
    'staging'     = 'https://cruizr-staging.web.app'
    'production'  = 'https://cruizr-prod.web.app'
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

function Get-DeploymentUrl {
    if ($Url) {
        return $Url
    }
    
    if ($EnvironmentUrls.ContainsKey($Environment)) {
        return $EnvironmentUrls[$Environment]
    }
    
    Write-ColorOutput "No URL configured for environment: $Environment" "Yellow"
    $inputUrl = Read-Host "Please enter the deployment URL"
    return $inputUrl
}

function Test-UrlAccessibility {
    param([string]$TestUrl)
    
    Write-ColorOutput "Testing URL accessibility..." "Cyan"
    Write-ColorOutput "URL: $TestUrl" "White"
    
    try {
        $response = Invoke-WebRequest -Uri $TestUrl -Method Get -TimeoutSec 30 -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput "✓ URL is accessible (Status: 200 OK)" "Green"
            return $true
        } else {
            Write-ColorOutput "✗ Unexpected status code: $($response.StatusCode)" "Yellow"
            return $false
        }
    }
    catch {
        Write-ColorOutput "✗ Failed to access URL: $_" "Red"
        return $false
    }
}

function Test-PageContent {
    param([string]$TestUrl)
    
    Write-ColorOutput "`nTesting page content..." "Cyan"
    
    try {
        $response = Invoke-WebRequest -Uri $TestUrl -UseBasicParsing -TimeoutSec 30
        $content = $response.Content
        
        $checks = @(
            @{ Name = "HTML content"; Pattern = '<!DOCTYPE html>|<html' },
            @{ Name = "Next.js content"; Pattern = '__NEXT_DATA__|_next/static' },
            @{ Name = "Application name"; Pattern = 'Cruizr' }
        )
        
        $passed = 0
        $failed = 0
        
        foreach ($check in $checks) {
            if ($content -match $check.Pattern) {
                Write-ColorOutput "  ✓ $($check.Name) found" "Green"
                $passed++
            } else {
                Write-ColorOutput "  ✗ $($check.Name) not found" "Yellow"
                $failed++
            }
        }
        
        Write-ColorOutput "`nContent checks: $passed passed, $failed failed" "White"
        return $passed -gt 0
    }
    catch {
        Write-ColorOutput "Failed to test page content: $_" "Red"
        return $false
    }
}

function Test-ApiEndpoints {
    param([string]$BaseUrl)
    
    Write-ColorOutput "`nTesting API endpoints..." "Cyan"
    
    $endpoints = @(
        @{ Path = '/api/health'; Description = 'Health check' },
        @{ Path = '/api/genkit'; Description = 'Genkit API' }
    )
    
    $results = @()
    
    foreach ($endpoint in $endpoints) {
        $url = "$BaseUrl$($endpoint.Path)"
        Write-ColorOutput "  Testing: $($endpoint.Description) ($url)" "White"
        
        try {
            $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction SilentlyContinue
            
            if ($response.StatusCode -eq 200) {
                Write-ColorOutput "    ✓ OK (200)" "Green"
                $results += $true
            } else {
                Write-ColorOutput "    ⚠ Status: $($response.StatusCode)" "Yellow"
                $results += $false
            }
        }
        catch {
            Write-ColorOutput "    ⚠ Not accessible (may not be implemented)" "Yellow"
            $results += $false
        }
    }
    
    return $results
}

function Test-ResponseTime {
    param([string]$TestUrl)
    
    Write-ColorOutput "`nTesting response time..." "Cyan"
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = Invoke-WebRequest -Uri $TestUrl -UseBasicParsing -TimeoutSec 30
        $stopwatch.Stop()
        
        $responseTime = $stopwatch.ElapsedMilliseconds
        
        Write-ColorOutput "Response time: ${responseTime}ms" "White"
        
        if ($responseTime -lt 1000) {
            Write-ColorOutput "✓ Response time is good (< 1s)" "Green"
        } elseif ($responseTime -lt 3000) {
            Write-ColorOutput "⚠ Response time is acceptable (< 3s)" "Yellow"
        } else {
            Write-ColorOutput "✗ Response time is slow (> 3s)" "Red"
        }
        
        return $responseTime
    }
    catch {
        Write-ColorOutput "Failed to measure response time: $_" "Red"
        return -1
    }
}

function Test-SSLCertificate {
    param([string]$TestUrl)
    
    if (-not $TestUrl.StartsWith('https://')) {
        Write-ColorOutput "`nSkipping SSL check (not HTTPS)" "Yellow"
        return $true
    }
    
    Write-ColorOutput "`nTesting SSL certificate..." "Cyan"
    
    try {
        $uri = [System.Uri]$TestUrl
        $request = [System.Net.HttpWebRequest]::Create($TestUrl)
        $request.Timeout = 10000
        $response = $request.GetResponse()
        
        Write-ColorOutput "✓ SSL certificate is valid" "Green"
        $response.Close()
        return $true
    }
    catch {
        Write-ColorOutput "⚠ SSL certificate check failed: $_" "Yellow"
        return $false
    }
}

function Show-TestSummary {
    param(
        [bool]$AccessibilityTest,
        [bool]$ContentTest,
        [array]$ApiTests,
        [int]$ResponseTime,
        [bool]$SslTest
    )
    
    Write-ColorOutput "`n============================================================================" "Cyan"
    Write-ColorOutput "Deployment Verification Summary" "Cyan"
    Write-ColorOutput "============================================================================" "Cyan"
    
    $totalTests = 5
    $passedTests = 0
    
    Write-ColorOutput "URL Accessibility:    $(if($AccessibilityTest){'✓ PASS'}else{'✗ FAIL'})" $(if($AccessibilityTest){'Green'}else{'Red'})
    if ($AccessibilityTest) { $passedTests++ }
    
    Write-ColorOutput "Page Content:         $(if($ContentTest){'✓ PASS'}else{'✗ FAIL'})" $(if($ContentTest){'Green'}else{'Red'})
    if ($ContentTest) { $passedTests++ }
    
    $apiPassed = ($ApiTests | Where-Object { $_ }).Count -gt 0
    Write-ColorOutput "API Endpoints:        $(if($apiPassed){'⚠ PARTIAL'}else{'✗ FAIL'})" $(if($apiPassed){'Yellow'}else{'Red'})
    if ($apiPassed) { $passedTests++ }
    
    $responseOk = $ResponseTime -gt 0 -and $ResponseTime -lt 3000
    Write-ColorOutput "Response Time:        $(if($responseOk){'✓ PASS'}else{'⚠ SLOW'})" $(if($responseOk){'Green'}else{'Yellow'})
    if ($responseOk) { $passedTests++ }
    
    Write-ColorOutput "SSL Certificate:      $(if($SslTest){'✓ PASS'}else{'⚠ N/A'})" $(if($SslTest){'Green'}else{'Yellow'})
    if ($SslTest) { $passedTests++ }
    
    Write-ColorOutput "`nOverall: $passedTests/$totalTests tests passed" "White"
    
    if ($passedTests -eq $totalTests) {
        Write-ColorOutput "Status: All checks passed! ✓" "Green"
    } elseif ($passedTests -ge 3) {
        Write-ColorOutput "Status: Deployment is functional with warnings ⚠" "Yellow"
    } else {
        Write-ColorOutput "Status: Deployment has issues ✗" "Red"
    }
    
    Write-ColorOutput "============================================================================`n" "Cyan"
}

# ============================================================================
# Main Execution
# ============================================================================

Write-ColorOutput "`n============================================================================" "Cyan"
Write-ColorOutput "Cruizr Deployment Verification" "Cyan"
Write-ColorOutput "============================================================================`n" "Cyan"

try {
    # Get deployment URL
    $deploymentUrl = Get-DeploymentUrl
    Write-ColorOutput "Testing deployment at: $deploymentUrl`n" "White"
    
    # Run tests
    $accessibilityTest = Test-UrlAccessibility -TestUrl $deploymentUrl
    Start-Sleep -Seconds 2
    
    $contentTest = Test-PageContent -TestUrl $deploymentUrl
    Start-Sleep -Seconds 2
    
    $apiTests = Test-ApiEndpoints -BaseUrl $deploymentUrl
    Start-Sleep -Seconds 2
    
    $responseTime = Test-ResponseTime -TestUrl $deploymentUrl
    Start-Sleep -Seconds 2
    
    $sslTest = Test-SSLCertificate -TestUrl $deploymentUrl
    
    # Show summary
    Show-TestSummary -AccessibilityTest $accessibilityTest `
                     -ContentTest $contentTest `
                     -ApiTests $apiTests `
                     -ResponseTime $responseTime `
                     -SslTest $sslTest
    
    Write-ColorOutput "Deployment verification completed!`n" "Green"
    exit 0
}
catch {
    Write-ColorOutput "`nDeployment verification failed: $_" "Red"
    exit 1
}

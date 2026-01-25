param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "sepolia", "mainnet")]
    [string]$Environment
)

if ($Environment -eq "local") {
    Write-Host "Switching to local development environment (Anvil)"
    @"
VITE_REOWN_PROJECT_ID=your_reown_project_id_here
VITE_PIGGYBANK_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
"@ | Out-File -FilePath .env -Encoding UTF8
} elseif ($Environment -eq "sepolia") {
    Write-Host "Switching to Base Sepolia testnet"
    @"
VITE_REOWN_PROJECT_ID=your_reown_project_id_here
VITE_PIGGYBANK_ADDRESS=deployed_sepolia_address
"@ | Out-File -FilePath .env -Encoding UTF8
} elseif ($Environment -eq "mainnet") {
    Write-Host "Switching to Base mainnet"
    @"
VITE_REOWN_PROJECT_ID=your_reown_project_id_here
VITE_PIGGYBANK_ADDRESS=deployed_mainnet_address
"@ | Out-File -FilePath .env -Encoding UTF8
}

Write-Host "Environment switched to $Environment"
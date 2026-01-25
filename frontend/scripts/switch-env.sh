#!/bin/bash

ENV=$1

if [ "$ENV" = "local" ]; then
  echo "Switching to local development environment (Anvil)"
  cat > .env << EOF
VITE_REOWN_PROJECT_ID=your_reown_project_id_here
VITE_PIGGYBANK_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
EOF
elif [ "$ENV" = "sepolia" ]; then
  echo "Switching to Base Sepolia testnet"
  cat > .env << EOF
VITE_REOWN_PROJECT_ID=your_reown_project_id_here
VITE_PIGGYBANK_ADDRESS=deployed_sepolia_address
EOF
elif [ "$ENV" = "mainnet" ]; then
  echo "Switching to Base mainnet"
  cat > .env << EOF
VITE_REOWN_PROJECT_ID=your_reown_project_id_here
VITE_PIGGYBANK_ADDRESS=deployed_mainnet_address
EOF
else
  echo "Usage: $0 {local|sepolia|mainnet}"
  exit 1
fi

echo "Environment switched to $ENV"
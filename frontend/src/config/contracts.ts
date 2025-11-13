// PiggyBank Smart Contract Configuration

export const PIGGYBANK_ABI = [
  {
    inputs: [{ internalType: 'uint256', name: '_unlockTime', type: 'uint256' }],
    stateMutability: 'payable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unlockTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const

// Contract address - Update this after deployment
export const PIGGYBANK_ADDRESS = (import.meta.env.VITE_PIGGYBANK_ADDRESS || '') as `0x${string}`

// Network configuration
export const CHAIN_ID = 84532 // Base Sepolia testnet

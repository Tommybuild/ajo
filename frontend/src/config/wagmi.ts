import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia, base } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { cookieToInitialState } from 'wagmi'

// Get projectId from environment variables
export const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

if (!projectId) {
  throw new Error('VITE_REOWN_PROJECT_ID is not set')
}

// Set up metadata for the dApp
export const metadata = {
  name: 'Ajo - PiggyBank dApp',
  description: 'Decentralized savings application on Base blockchain',
  url: 'https://ajo-piggybank.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Configure networks - Using Base Sepolia for testnet and Base mainnet
export const networks = [baseSepolia, base]

// Create Wagmi Adapter with REOWN
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true
})

// Create the AppKit instance with REOWN
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - enable analytics
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7c3aed', // Purple accent color
  }
})

// Create QueryClient for React Query
export const queryClient = new QueryClient()

export function getInitialState(cookieValue: string | null) {
  return cookieToInitialState(wagmiAdapter.wagmiConfig, cookieValue)
}

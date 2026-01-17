import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia, base } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { cookieToInitialState } from 'wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'

/**
 * Get and validate REOWN Project ID from environment variables
 * Throws an error if projectId is not configured to prevent silent failures
 */
function getProjectId(): string {
  const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

  if (!projectId) {
    throw new Error(
      'VITE_REOWN_PROJECT_ID is not configured. ' +
      'This is required for REOWN AppKit wallet connections. ' +
      'Get your Project ID from https://cloud.reown.com/ and add it to your .env file.'
    )
  }

  if (typeof projectId !== 'string' || projectId.trim() === '') {
    throw new Error(
      'VITE_REOWN_PROJECT_ID is invalid. It must be a non-empty string. ' +
      'Check your .env file configuration.'
    )
  }

  return projectId
}

// Get projectId from environment variables with validation
export const projectId = getProjectId()

// Set up metadata for the dApp
export const metadata = {
  name: 'Ajo - PiggyBank dApp',
  description: 'Decentralized savings application on Base blockchain',
  url: 'https://ajo-piggybank.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Configure networks - Using Base Sepolia for testnet and Base mainnet
const networksList: [AppKitNetwork, ...AppKitNetwork[]] = [baseSepolia, base]

// Create Wagmi Adapter with REOWN
export const wagmiAdapter = new WagmiAdapter({
  networks: networksList,
  projectId,
  ssr: true
})

// Create the AppKit instance with REOWN
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: networksList,
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

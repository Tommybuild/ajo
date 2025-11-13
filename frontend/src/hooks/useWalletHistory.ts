import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { saveWalletConnection } from '../utils/walletStorage'

export function useWalletHistory() {
  const { address, chain, connector } = useAccount()

  useEffect(() => {
    if (address && chain && connector) {
      saveWalletConnection({
        address,
        chainId: chain.id,
        connectorId: connector.id,
      })
    }
  }, [address, chain, connector])
}

import { useAccount, useEnsName, useEnsAvatar } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

export function WalletButton() {
  const { address, isConnected, isConnecting } = useAccount()
  const { open } = useAppKit()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined })

  const handleClick = () => {
    open()
  }

  if (isConnecting) {
    return (
      <button className="wallet-button connecting" disabled>
        <span className="spinner">⟳</span>
        Connecting...
      </button>
    )
  }

  if (isConnected && address) {
    return (
      <button className="wallet-button connected" onClick={handleClick}>
        {ensAvatar && (
          <img
            src={ensAvatar}
            alt="ENS Avatar"
            className="wallet-avatar"
          />
        )}
        <span className="wallet-identifier">
          {ensName || `${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
        <span className="connection-indicator">●</span>
      </button>
    )
  }

  return (
    <button className="wallet-button" onClick={handleClick}>
      <span className="wallet-icon">🔗</span>
      Connect Wallet
    </button>
  )
}

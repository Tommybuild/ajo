import { useSwitchChain, useAccount } from 'wagmi'
import { baseSepolia, base } from 'wagmi/chains'
import { useState } from 'react'

export function NetworkSwitcher() {
  const { chain } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  const [showMenu, setShowMenu] = useState(false)

  const networks = [
    { chain: baseSepolia, name: 'Base Sepolia', icon: '🧪' },
    { chain: base, name: 'Base Mainnet', icon: '🔵' },
  ]

  const handleNetworkSwitch = (chainId: number) => {
    switchChain({ chainId })
    setShowMenu(false)
  }

  return (
    <div className="network-switcher">
      <button
        className="network-btn"
        onClick={() => setShowMenu(!showMenu)}
        disabled={isPending}
      >
        <span className="network-indicator">
          {chain?.id === baseSepolia.id && '🧪'}
          {chain?.id === base.id && '🔵'}
          {!chain && '⚠️'}
        </span>
        <span className="network-name">
          {chain?.name || 'Wrong Network'}
        </span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {showMenu && (
        <div className="network-menu">
          {networks.map((network) => (
            <button
              key={network.chain.id}
              className={`network-option ${
                chain?.id === network.chain.id ? 'active' : ''
              }`}
              onClick={() => handleNetworkSwitch(network.chain.id)}
              disabled={isPending || chain?.id === network.chain.id}
            >
              <span className="network-icon">{network.icon}</span>
              <span className="network-label">{network.name}</span>
              {chain?.id === network.chain.id && (
                <span className="check-mark">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {chain && chain.id !== baseSepolia.id && chain.id !== base.id && (
        <div className="network-warning">
          ⚠️ Unsupported network. Please switch to Base.
        </div>
      )}
    </div>
  )
}

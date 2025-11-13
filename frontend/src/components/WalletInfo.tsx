import { useAccount, useBalance, useDisconnect } from 'wagmi'
import { formatEther } from 'viem'

export function WalletInfo() {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })

  if (!isConnected || !address) {
    return null
  }

  return (
    <div className="wallet-info-card">
      <div className="wallet-header">
        <h3>Wallet Information</h3>
        <button
          className="disconnect-btn"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>

      <div className="wallet-details">
        <div className="detail-row">
          <span className="label">Address:</span>
          <span className="value address-value">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(address)}
          >
            📋
          </button>
        </div>

        <div className="detail-row">
          <span className="label">Network:</span>
          <span className="value">{chain?.name || 'Unknown'}</span>
        </div>

        <div className="detail-row">
          <span className="label">Balance:</span>
          <span className="value">
            {balance ? formatEther(balance.value) : '0.00'} ETH
          </span>
        </div>

        <div className="detail-row">
          <span className="label">Chain ID:</span>
          <span className="value">{chain?.id || 'N/A'}</span>
        </div>
      </div>

      <div className="wallet-actions">
        <button
          className="btn-secondary"
          onClick={() => window.open(`https://sepolia.basescan.org/address/${address}`, '_blank')}
        >
          View on Explorer
        </button>
      </div>
    </div>
  )
}

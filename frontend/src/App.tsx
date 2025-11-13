import { useAccount } from 'wagmi'
import { Header } from './components/Header'
import { PiggyBankDashboard } from './components/PiggyBankDashboard'
import './App.css'

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {!isConnected ? (
          <div className="connect-prompt">
            <div className="connect-card">
              <h2>Welcome to Ajo PiggyBank</h2>
              <p>A decentralized savings application on Base blockchain</p>
              <div className="features">
                <div className="feature">
                  <span className="icon">🔒</span>
                  <h3>Time-Locked Savings</h3>
                  <p>Lock your ETH for a specific duration</p>
                </div>
                <div className="feature">
                  <span className="icon">💰</span>
                  <h3>Secure Storage</h3>
                  <p>Your funds are safe on-chain</p>
                </div>
                <div className="feature">
                  <span className="icon">⚡</span>
                  <h3>Base Network</h3>
                  <p>Fast and low-cost transactions</p>
                </div>
              </div>
              <div className="connect-action">
                <p>Connect your wallet to get started</p>
                <appkit-button />
              </div>
            </div>
          </div>
        ) : (
          <PiggyBankDashboard />
        )}
      </main>

      <footer className="footer">
        <p>Built with REOWN AppKit & WalletConnect on Base</p>
      </footer>
    </div>
  )
}

export default App

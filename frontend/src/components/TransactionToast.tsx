import { useState } from 'react'
import { useWatchPendingTransactions } from 'wagmi'

interface Toast {
  id: string
  message: string
  type: 'pending' | 'success' | 'error'
  txHash?: string
}

export function TransactionToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useWatchPendingTransactions({
    onTransactions(transactions) {
      transactions.forEach((tx) => {
        addToast({
          id: tx,
          message: 'Transaction submitted',
          type: 'pending',
          txHash: tx,
        })
      })
    },
  })

  const addToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">
              {toast.type === 'pending' && '⏳'}
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
            </span>
            <div className="toast-text">
              <p className="toast-message">{toast.message}</p>
              {toast.txHash && (
                <a
                  href={`https://sepolia.basescan.org/tx/${toast.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="toast-link"
                >
                  View on Explorer →
                </a>
              )}
            </div>
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

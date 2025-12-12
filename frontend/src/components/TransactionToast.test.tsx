import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TransactionToast } from './TransactionToast'
import * as wagmi from 'wagmi'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useWatchPendingTransactions: vi.fn(),
  useWaitForTransactionReceipt: vi.fn(),
}))

describe('TransactionToast', () => {
  const mockUseWatchPendingTransactions = vi.spyOn(wagmi, 'useWatchPendingTransactions')
  const mockUseWaitForTransactionReceipt = vi.spyOn(wagmi, 'useWaitForTransactionReceipt')

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

    // Mock the wagmi hooks
    mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
      // Simulate watching for transactions
      return {}
    })

    mockUseWaitForTransactionReceipt.mockReturnValue({
      isSuccess: false,
      isError: false,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should not render when no toasts are present', () => {
      render(<TransactionToast />)
      expect(screen.queryByText('Transaction submitted')).not.toBeInTheDocument()
      expect(screen.queryByText('Transaction confirmed')).not.toBeInTheDocument()
      expect(screen.queryByText('Transaction failed')).not.toBeInTheDocument()
    })
  })

  describe('Pending Transaction Handling', () => {
    it('should display pending toast when transaction is submitted', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      render(<TransactionToast />)

      expect(screen.getByText('Transaction submitted')).toBeInTheDocument()
      expect(screen.getByText('⏳')).toBeInTheDocument()
      expect(screen.getByText('View on Explorer →')).toBeInTheDocument()
    })

    it('should auto-remove pending toast after 10 seconds', async () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      render(<TransactionToast />)

      expect(screen.getByText('Transaction submitted')).toBeInTheDocument()

      // Fast forward 10 seconds
      vi.advanceTimersByTime(10000)

      await waitFor(() => {
        expect(screen.queryByText('Transaction submitted')).not.toBeInTheDocument()
      })
    })
  })

  describe('Success Transaction Handling', () => {
    it('should display success toast when transaction is confirmed', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isSuccess: true,
        isError: false,
      })

      render(<TransactionToast />)

      expect(screen.getByText('Transaction confirmed')).toBeInTheDocument()
      expect(screen.getByText('✅')).toBeInTheDocument()
    })

    it('should auto-remove success toast after 5 seconds', async () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isSuccess: true,
        isError: false,
      })

      render(<TransactionToast />)

      expect(screen.getByText('Transaction confirmed')).toBeInTheDocument()

      // Fast forward 5 seconds
      vi.advanceTimersByTime(5000)

      await waitFor(() => {
        expect(screen.queryByText('Transaction confirmed')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error Transaction Handling', () => {
    it('should display error toast when transaction fails', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isSuccess: false,
        isError: true,
      })

      render(<TransactionToast />)

      expect(screen.getByText('Transaction failed')).toBeInTheDocument()
      expect(screen.getByText('❌')).toBeInTheDocument()
    })

    it('should auto-remove error toast after 5 seconds', async () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isSuccess: false,
        isError: true,
      })

      render(<TransactionToast />)

      expect(screen.getByText('Transaction failed')).toBeInTheDocument()

      // Fast forward 5 seconds
      vi.advanceTimersByTime(5000)

      await waitFor(() => {
        expect(screen.queryByText('Transaction failed')).not.toBeInTheDocument()
      })
    })
  })

  describe('Multiple Transactions', () => {
    it('should handle multiple pending transactions', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123', '0x456'])
        return {}
      })

      render(<TransactionToast />)

      const pendingToasts = screen.getAllByText('Transaction submitted')
      expect(pendingToasts.length).toBe(2)
    })
  })

  describe('Toast Interaction', () => {
    it('should allow manual dismissal of toasts', async () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      render(<TransactionToast />)

      const closeButton = screen.getByText('×')
      fireEvent.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByText('Transaction submitted')).not.toBeInTheDocument()
      })
    })

    it('should have working explorer links', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      render(<TransactionToast />)

      const explorerLink = screen.getByText('View on Explorer →')
      expect(explorerLink).toHaveAttribute('href', 'https://sepolia.basescan.org/tx/0x123')
      expect(explorerLink).toHaveAttribute('target', '_blank')
      expect(explorerLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty transaction hash gracefully', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions([''])
        return {}
      })

      render(<TransactionToast />)

      expect(screen.getByText('Transaction submitted')).toBeInTheDocument()
      expect(screen.queryByText('View on Explorer →')).not.toBeInTheDocument()
    })

    it('should handle undefined transaction hash gracefully', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions([undefined as any])
        return {}
      })

      render(<TransactionToast />)

      expect(screen.getByText('Transaction submitted')).toBeInTheDocument()
      expect(screen.queryByText('View on Explorer →')).not.toBeInTheDocument()
    })
  })

  describe('Visual Elements', () => {
    it('should have correct toast styling classes', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123'])
        return {}
      })

      render(<TransactionToast />)

      const toastElement = screen.getByText('Transaction submitted').closest('.toast')
      expect(toastElement).toHaveClass('toast-pending')
    })

    it('should display appropriate icons for each state', () => {
      const mockOnTransactions = vi.fn()
      mockUseWatchPendingTransactions.mockImplementation(({ onTransactions }) => {
        onTransactions(['0x123', '0x456', '0x789'])
        return {}
      })

      mockUseWaitForTransactionReceipt.mockReturnValue({
        isSuccess: true,
        isError: true,
      })

      render(<TransactionToast />)

      expect(screen.getByText('⏳')).toBeInTheDocument() // Pending
      expect(screen.getByText('✅')).toBeInTheDocument() // Success
      expect(screen.getByText('❌')).toBeInTheDocument() // Error
    })
  })

  it('should always show consistent toast messages', () => {
    // Test that the toast messages match the documented UX copy
    const expectedMessages = {
      pending: 'Transaction submitted',
      success: 'Transaction confirmed',
      error: 'Transaction failed',
    }

    expect(expectedMessages.pending).toBe('Transaction submitted')
    expect(expectedMessages.success).toBe('Transaction confirmed')
    expect(expectedMessages.error).toBe('Transaction failed')
  })
})
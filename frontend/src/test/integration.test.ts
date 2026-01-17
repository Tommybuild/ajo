import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DepositForm } from '../components/DepositForm'
import { WithdrawButton } from '../components/WithdrawButton'
import { BalanceCard } from '../components/BalanceCard'
import * as usePiggyBankModule from '../hooks/usePiggyBank'
import * as useTimelockModule from '../hooks/useTimelock'

        isConfirmed: false,
        hash: undefined,
      })

      rerender(<DepositForm />)

      expect(screen.getByRole('button', { name: /Deposited!/i })).toBeInTheDocument()
      expect(screen.getByText('✅ Deposit successful! Your ETH is now locked.')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle deposit validation errors', () => {
      const mockAlert = vi.fn()
      global.alert = mockAlert

      render(<DepositForm />)

      const button = screen.getByRole('button', { name: /Deposit ETH/i })
      button.removeAttribute('disabled')
      fireEvent.click(button)

      expect(mockAlert).toHaveBeenCalledWith('Please enter a valid amount')
      expect(mockDeposit).not.toHaveBeenCalled()
    })

    it('should handle zero balance state', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('0'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        isOwner: true,
        ownerAddress: '0x1234567890123456789012345678901234567890',
        deposit: mockDeposit,
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      expect(screen.getByRole('button', { name: /Withdraw All/i })).toBeDisabled()
    })
  })

  describe('Component Interaction', () => {
    it('should show consistent balance across components', () => {
      const balance = BigInt('2500000000000000000') // 2.5 ETH

      mockUsePiggyBank.mockReturnValue({
        balance,
        unlockTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        isOwner: true,
        ownerAddress: '0x1234567890123456789012345678901234567890',
        deposit: mockDeposit,
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isConfirmed: false,
        hash: undefined,
      })

      render(<BalanceCard />)
      render(<WithdrawButton />)

      // Both components should show the same balance state
      const balanceCardText = screen.getAllByText(/2\.5\s*ETH/)[0]
      expect(balanceCardText).toBeInTheDocument()
    })

    it('should handle transaction state consistently', () => {
      // Mock pending state
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: undefined,
        isOwner: false,
        ownerAddress: undefined,
        deposit: mockDeposit,
        withdraw: vi.fn(),
        isPending: true,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isConfirmed: false,
        hash: undefined,
      })

      render(<DepositForm />)

      expect(screen.getByRole('button', { name: /Waiting for approval.../i })).toBeInTheDocument()
      expect(screen.getByLabelText(/Amount \(ETH\)/i)).toBeDisabled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined balance gracefully', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: undefined,
        unlockTime: undefined,
        isOwner: false,
        ownerAddress: undefined,
        deposit: mockDeposit,
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isConfirmed: false,
        hash: undefined,
      })

      render(<BalanceCard />)

      expect(screen.getByText('0.00 ETH')).toBeInTheDocument()
      expect(screen.getByText('No active time lock')).toBeInTheDocument()
    })

    it('should handle very large balance values', () => {
      const largeBalance = BigInt('1000000000000000000000') // 1000 ETH

      mockUsePiggyBank.mockReturnValue({
        balance: largeBalance,
        unlockTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        isOwner: true,
        ownerAddress: '0x1234567890123456789012345678901234567890',
        deposit: mockDeposit,
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isConfirmed: false,
        hash: undefined,
      })

      render(<BalanceCard />)

      expect(screen.getByText(/1000(\.\d+)?\s*ETH/)).toBeInTheDocument()
    })
  })
})
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { WithdrawButton } from './WithdrawButton'
import * as usePiggyBankModule from '../hooks/usePiggyBank'
import * as useTimelockModule from '../hooks/useTimelock'

// Mock the hooks
vi.mock('../hooks/usePiggyBank')
vi.mock('../hooks/useTimelock')

describe('WithdrawButton', () => {
  const mockUsePiggyBank = vi.spyOn(usePiggyBankModule, 'usePiggyBank')
  const mockUseTimelock = vi.spyOn(useTimelockModule, 'useTimelock')
  const mockWithdraw = vi.fn()
  const mockRefetchBalance = vi.fn()
  const mockAlert = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.alert = mockAlert
  })

  describe('Locked State Display', () => {
    it('should display warning message when funds are locked', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: {
          days: 0,
          hours: 1,
          minutes: 0,
          seconds: 0,
        },
        isUnlocked: false,
      })

      render(<WithdrawButton />)

      expect(screen.getByText('⏰')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Your funds are currently locked. You can withdraw once the lock period expires.'
        )
      ).toBeInTheDocument()
    })

    it('should display button as disabled when funds are locked', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: {
          days: 0,
          hours: 1,
          minutes: 0,
          seconds: 0,
        },
        isUnlocked: false,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button', { name: /Withdraw All/i })
      expect(button).toBeDisabled()
    })

    it('should prevent withdrawal when funds are locked', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: {
          days: 0,
          hours: 1,
          minutes: 0,
          seconds: 0,
        },
        isUnlocked: false,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button', { name: /Withdraw All/i })

      // Button should be disabled, preventing withdrawal
      expect(button).toBeDisabled()
      expect(mockWithdraw).not.toHaveBeenCalled()
    })
  })

  describe('Unlocked State Display', () => {
    it('should display success message when funds are unlocked', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      expect(screen.getByText('✅')).toBeInTheDocument()
      expect(
        screen.getByText('Your funds are unlocked! You can now withdraw your ETH.')
      ).toBeInTheDocument()
    })

    it('should enable button when funds are unlocked and balance exists', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button', { name: /Withdraw All/i })
      expect(button).not.toBeDisabled()
    })

    it('should call withdraw function when button is clicked and unlocked', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button', { name: /Withdraw All/i })
      fireEvent.click(button)

      expect(mockWithdraw).toHaveBeenCalledTimes(1)
      expect(mockAlert).not.toHaveBeenCalled()
    })
  })

  describe('Button States and Labels', () => {
    it('should display "Withdraw All" when idle', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      expect(screen.getByRole('button', { name: /Withdraw All/i })).toBeInTheDocument()
    })

    it('should display "Waiting for approval..." when pending', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: true,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      expect(screen.getByRole('button', { name: /Waiting for approval.../i })).toBeInTheDocument()
    })

    it('should display "Withdrawing..." when confirming', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: true,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      expect(screen.getByRole('button', { name: /Withdrawing.../i })).toBeInTheDocument()
    })

    it('should display "Withdrawn!" when successful', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: true,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      expect(screen.getByRole('button', { name: /Withdrawn!/i })).toBeInTheDocument()
    })

    it('should disable button when pending', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: true,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should disable button when confirming', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: true,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })

  describe('Balance Validation', () => {
    it('should disable button when balance is zero', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('0'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button', { name: /Withdraw All/i })
      expect(button).toBeDisabled()
    })

    it('should disable button when balance is undefined', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: undefined,
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button', { name: /Withdraw All/i })
      expect(button).toBeDisabled()
    })

    it('should prevent withdrawal when balance is zero', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('0'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button', { name: /Withdraw All/i })

      // Button should be disabled due to zero balance
      expect(button).toBeDisabled()
      expect(mockWithdraw).not.toHaveBeenCalled()
    })

    it('should prevent withdrawal when balance is undefined', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: undefined,
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      const button = screen.getByRole('button', { name: /Withdraw All/i })

      // Button should be disabled due to undefined balance
      expect(button).toBeDisabled()
      expect(mockWithdraw).not.toHaveBeenCalled()
    })
  })

  describe('Success State', () => {
    it('should display success message when withdrawal is successful', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: true,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      expect(screen.getByText('✅ Withdrawal successful! Check your wallet.')).toBeInTheDocument()
    })

    it('should not display success message when withdrawal is not successful', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      expect(screen.queryByText('✅ Withdrawal successful! Check your wallet.')).not.toBeInTheDocument()
    })

    it('should call refetchBalance when withdrawal is successful', async () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: BigInt(Math.floor(Date.now() / 1000) - 3600),
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: true,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<WithdrawButton />)

      await waitFor(() => {
        expect(mockRefetchBalance).toHaveBeenCalled()
      })
    })
  })

  describe('State Transitions', () => {
    it('should transition from locked to unlocked UI', () => {
      const unlockTime = BigInt(Math.floor(Date.now() / 1000) + 60)

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        withdraw: mockWithdraw,
        isPending: false,
        isConfirming: false,
        isSuccess: false,
        refetchBalance: mockRefetchBalance,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        isConfirmed: false,
        hash: undefined,
      })

      // Initially locked
      mockUseTimelock.mockReturnValue({
        timeRemaining: {
          days: 0,
          hours: 0,
          minutes: 1,
          seconds: 0,
        },
        isUnlocked: false,
      })

      const { rerender } = render(<WithdrawButton />)

      expect(screen.getByText('⏰')).toBeInTheDocument()
      expect(screen.getByText(/Your funds are currently locked/)).toBeInTheDocument()
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()

      // Now unlocked
      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      rerender(<WithdrawButton />)

      expect(screen.getByText('✅')).toBeInTheDocument()
      expect(screen.getByText(/Your funds are unlocked!/)).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BalanceCard } from './BalanceCard'
import * as usePiggyBankModule from '../hooks/usePiggyBank'
import * as useTimelockModule from '../hooks/useTimelock'

// Mock the hooks
vi.mock('../hooks/usePiggyBank')
vi.mock('../hooks/useTimelock')

describe('BalanceCard', () => {
  const mockUsePiggyBank = vi.spyOn(usePiggyBankModule, 'usePiggyBank')
  const mockUseTimelock = vi.spyOn(useTimelockModule, 'useTimelock')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Balance Display', () => {
    it('should display balance in ETH format', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'), // 1 ETH in wei
        unlockTime: undefined,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: false,
      })

      render(<BalanceCard />)

      expect(screen.getByText(/1(\.\d+)?\s*ETH/)).toBeInTheDocument()
    })

    it('should display 0.00 ETH when balance is undefined', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: undefined,
        unlockTime: undefined,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: false,
      })

      render(<BalanceCard />)

      expect(screen.getByText('0.00 ETH')).toBeInTheDocument()
    })
  })

  describe('Unlocked State', () => {
    it('should display unlocked message when isUnlocked is true', () => {
      const unlockTime = BigInt(Math.floor(Date.now() / 1000) - 3600) // 1 hour ago

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<BalanceCard />)

      expect(screen.getByText('🔓')).toBeInTheDocument()
      expect(screen.getByText('Unlocked - Ready to withdraw!')).toBeInTheDocument()
    })

    it('should display unlock date when unlocked', () => {
      const unlockTime = BigInt(1700000000) // Fixed timestamp for testing

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<BalanceCard />)

      expect(screen.getByText(/Unlocked on:/)).toBeInTheDocument()
    })
  })

  describe('Locked State with Countdown', () => {
    it('should display locked message with countdown when locked', () => {
      const unlockTime = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour from now

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
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

      render(<BalanceCard />)

      expect(screen.getByText('🔒')).toBeInTheDocument()
      expect(screen.getByText(/Locked until:/)).toBeInTheDocument()
    })

    it('should display all countdown units correctly', () => {
      const unlockTime = BigInt(Math.floor(Date.now() / 1000) + 3600)

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: {
          days: 2,
          hours: 5,
          minutes: 30,
          seconds: 45,
        },
        isUnlocked: false,
      })

      render(<BalanceCard />)

      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('Days')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Hours')).toBeInTheDocument()
      expect(screen.getByText('30')).toBeInTheDocument()
      expect(screen.getByText('Min')).toBeInTheDocument()
      expect(screen.getByText('45')).toBeInTheDocument()
      expect(screen.getByText('Sec')).toBeInTheDocument()
    })

    it('should handle countdown with zeros correctly', () => {
      const unlockTime = BigInt(Math.floor(Date.now() / 1000) + 30)

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 30,
        },
        isUnlocked: false,
      })

      render(<BalanceCard />)

      const timeValues = screen.getAllByText('0')
      expect(timeValues.length).toBeGreaterThanOrEqual(3) // Days, Hours, Minutes should be 0
      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('should display formatted unlock date in locked state', () => {
      const unlockTime = BigInt(1700000000)

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: {
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
        },
        isUnlocked: false,
      })

      render(<BalanceCard />)

      expect(screen.getByText(/Locked until:/)).toBeInTheDocument()
      // The exact date format will depend on locale, but it should contain date components
    })
  })

  describe('No Lock State', () => {
    it('should display "No active time lock" when no unlock time is set', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: undefined,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: false,
      })

      render(<BalanceCard />)

      expect(screen.getByText('No active time lock')).toBeInTheDocument()
    })

    it('should not display countdown when timeRemaining is null', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: undefined,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: false,
      })

      render(<BalanceCard />)

      expect(screen.queryByText('Days')).not.toBeInTheDocument()
      expect(screen.queryByText('Hours')).not.toBeInTheDocument()
      expect(screen.queryByText('Min')).not.toBeInTheDocument()
      expect(screen.queryByText('Sec')).not.toBeInTheDocument()
    })
  })

  describe('Date Formatting', () => {
    it('should format unlock date correctly for a known timestamp', () => {
      // Nov 14, 2023, 10:13:20 PM UTC
      const unlockTime = BigInt(1700000000)

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      render(<BalanceCard />)

      // Should contain month (Nov), day (14 or 15 depending on timezone), year (2023), and time
      const dateText = screen.getByText(/Unlocked on:/).parentElement?.textContent
      expect(dateText).toMatch(/Nov/i)
      expect(dateText).toMatch(/1[45]/)
      expect(dateText).toMatch(/2023/)
    })

    it('should return "Not set" for undefined unlock time', () => {
      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime: undefined,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: false,
      })

      const { container } = render(<BalanceCard />)

      // Should not show any formatted date since there's no lock
      expect(container.textContent).toContain('No active time lock')
    })
  })

  describe('State Transitions', () => {
    it('should transition from locked to unlocked visually', () => {
      const unlockTime = BigInt(Math.floor(Date.now() / 1000) + 60)

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
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

      const { rerender } = render(<BalanceCard />)

      expect(screen.getByText('🔒')).toBeInTheDocument()
      expect(screen.getByText(/Locked until:/)).toBeInTheDocument()

      // Now unlocked
      mockUseTimelock.mockReturnValue({
        timeRemaining: null,
        isUnlocked: true,
      })

      rerender(<BalanceCard />)

      expect(screen.getByText('🔓')).toBeInTheDocument()
      expect(screen.getByText('Unlocked - Ready to withdraw!')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large countdown values', () => {
      const unlockTime = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60)

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('1000000000000000000'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        hash: undefined,
      })

      mockUseTimelock.mockReturnValue({
        timeRemaining: {
          days: 365,
          hours: 0,
          minutes: 0,
          seconds: 0,
        },
        isUnlocked: false,
      })

      render(<BalanceCard />)

      expect(screen.getByText('365')).toBeInTheDocument()
      expect(screen.getByText('Days')).toBeInTheDocument()
    })

    it('should handle zero balance with active lock', () => {
      const unlockTime = BigInt(Math.floor(Date.now() / 1000) + 3600)

      mockUsePiggyBank.mockReturnValue({
        balance: BigInt('0'),
        unlockTime,
        isOwner: false,
        ownerAddress: undefined,
        deposit: vi.fn(),
        withdraw: vi.fn(),
        isPending: false,
        isConfirming: false,
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

      render(<BalanceCard />)

      expect(screen.getByText(/0(\.00)?\s*ETH/)).toBeInTheDocument()
      expect(screen.getByText('🔒')).toBeInTheDocument()
    })
  })
})

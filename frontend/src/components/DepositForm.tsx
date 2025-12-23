import { useState, useEffect } from 'react';
import { usePiggyBank } from '../hooks/usePiggyBank';
import { useTimelock } from '../hooks/useTimelock';
import { BUTTONS, LABELS, MESSAGES, VALIDATION } from '../constants/uxCopy';
import { formatLockTime } from '../constants/uxCopy';
import { MAX_DEPOSIT_AMOUNT, MIN_DEPOSIT_AMOUNT } from '../config/contracts';

export function DepositForm() {
  const [amount, setAmount] = useState('')
  const [showError, setShowError] = useState<string | null>(null)
  const { deposit, isPending, isConfirming, isSuccess, refetchBalance, unlockTime } = usePiggyBank()
  const { timeRemaining } = useTimelock(unlockTime)

  useEffect(() => {
    if (isSuccess) {
      setAmount('')
      setShowError(null)
      refetchBalance()
    }
  }, [isSuccess, refetchBalance])

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount)
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setShowError(VALIDATION.INVALID_AMOUNT)
      setTimeout(() => setShowError(null), 5000)
      return;
    }
    if (numAmount > MAX_DEPOSIT_AMOUNT) {
      setShowError(`Amount exceeds maximum deposit limit of ${MAX_DEPOSIT_AMOUNT} ETH`)
      setTimeout(() => setShowError(null), 5000)
      return;
    }
    if (numAmount < MIN_DEPOSIT_AMOUNT) {
      setShowError(`Minimum deposit amount is ${MIN_DEPOSIT_AMOUNT} ETH`)
      setTimeout(() => setShowError(null), 5000)
      return;
    }
    deposit(amount);
  };

  const formatLockInfo = () => {
    if (unlockTime === undefined) return 'Loading lock information...';
    if (unlockTime === null) return MESSAGES.LOCKED;
    if (!timeRemaining) return 'Loading lock information...';

    const days = timeRemaining.days;
    const hours = timeRemaining.hours;

    if (days > 0) {
      return formatLockTime(days, 'days');
    } else if (hours > 0) {
      return formatLockTime(hours, 'hours');
    }
    return MESSAGES.UNLOCKED;
  };

  return (
    <form className="deposit-form" onSubmit={handleDeposit}>
      <div className="form-group">
        <label htmlFor="amount">{LABELS.AMOUNT_ETH}</label>
        <input
          id="amount"
          type="number"
          step="0.001"
          min="0"
          placeholder={LABELS.AMOUNT_PLACEHOLDER}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isPending || isConfirming}
        />
      </div>

      <div className="info-box">
        <span className="text-lg">ℹ️</span>
        <div>
          <p className="font-medium mb-1">About This Piggy Bank</p>
          <p className="helper-text">
            {formatLockInfo()}
            <br />
            <small>{MESSAGES.DEPOSIT_HELPER}</small>
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!amount || isPending || isConfirming}
      >
        {isPending
          ? 'Waiting for approval...'
          : isConfirming
          ? 'Processing...'
          : isSuccess
          ? 'Deposited!'
          : BUTTONS.DEPOSIT_ETH}
      </button>

      {showError && (
        <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
          ❌ {showError}
        </div>
      )}

      {isSuccess && (
        <div className="success-message">
          ✅ {MESSAGES.DEPOSIT_SUCCESS}
        </div>
      )}
    </form>
  )
}

import { formatEther } from 'viem'
import { usePiggyBank } from '../hooks/usePiggyBank'
import { useTimelock } from '../hooks/useTimelock'

export function BalanceCard() {
  const { balance, unlockTime } = usePiggyBank()
  const { timeRemaining, isUnlocked } = useTimelock(unlockTime)

  const formatUnlockDate = (timestamp: bigint | undefined) => {
    if (!timestamp) return 'Not set'
    const date = new Date(Number(timestamp) * 1000)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="balance-card" role="region" aria-labelledby="balance-card-title">
      <div className="balance-info">
        <h3 id="balance-card-title">Total Balance</h3>
        <div className="balance-amount" aria-live="polite" aria-label={`Current balance: ${balance ? formatEther(balance) : '0.00'} ETH`}>
          {balance !== undefined ? formatEther(balance) : '0.00'} ETH
        </div>
      </div>

      <div className="timelock-info" role="status" aria-live="polite">
        {isUnlocked ? (
          <div className="unlocked">
            <span className="status-icon" role="img" aria-label="Unlocked">🔓</span>
            <p className="font-semibold text-green-600" aria-label="Account is unlocked and ready for withdrawal">Unlocked - Ready to withdraw!</p>
            <p className="text-sm text-gray-600 mt-2">
              <time dateTime={unlockTime ? new Date(Number(unlockTime) * 1000).toISOString() : undefined}>
                Unlocked on: {formatUnlockDate(unlockTime)}
              </time>
            </p>
          </div>
        ) : timeRemaining ? (
          <div className="locked">
            <span className="status-icon" role="img" aria-label="Locked">🔒</span>
            <p className="font-semibold mb-2">
              <time dateTime={unlockTime ? new Date(Number(unlockTime) * 1000).toISOString() : undefined}>
                Locked until: {formatUnlockDate(unlockTime)}
              </time>
            </p>
            <div className="countdown" role="timer" aria-label="Time remaining">
              <div className="time-unit" role="group" aria-label={`${timeRemaining.days} days remaining`}>
                <span className="value" aria-hidden="true">{timeRemaining.days}</span>
                <span className="label">Days</span>
              </div>
              <div className="time-unit" role="group" aria-label={`${timeRemaining.hours} hours remaining`}>
                <span className="value" aria-hidden="true">{timeRemaining.hours}</span>
                <span className="label">Hours</span>
              </div>
              <div className="time-unit" role="group" aria-label={`${timeRemaining.minutes} minutes remaining`}>
                <span className="value" aria-hidden="true">{timeRemaining.minutes}</span>
                <span className="label">Min</span>
              </div>
              <div className="time-unit" role="group" aria-label={`${timeRemaining.seconds} seconds remaining`}>
                <span className="value" aria-hidden="true">{timeRemaining.seconds}</span>
                <span className="label">Sec</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-lock">
            <p className="text-gray-600" role="status">No active time lock</p>
          </div>
        )}
      </div>
    </div>
  )
}

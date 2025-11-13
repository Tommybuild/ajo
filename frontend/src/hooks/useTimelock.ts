import { useState, useEffect } from 'react'

export function useTimelock(unlockTime: bigint | undefined) {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    if (!unlockTime) return

    const updateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000)
      const unlockTimestamp = Number(unlockTime)
      const difference = unlockTimestamp - now

      if (difference <= 0) {
        setIsUnlocked(true)
        setTimeRemaining(null)
        return
      }

      setIsUnlocked(false)
      const days = Math.floor(difference / (60 * 60 * 24))
      const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60))
      const minutes = Math.floor((difference % (60 * 60)) / 60)
      const seconds = difference % 60

      setTimeRemaining({ days, hours, minutes, seconds })
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [unlockTime])

  return { timeRemaining, isUnlocked }
}

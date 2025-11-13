import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { PIGGYBANK_ABI, PIGGYBANK_ADDRESS } from '../config/contracts'

export function usePiggyBank() {
  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()

  // Read balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: PIGGYBANK_ADDRESS,
    abi: PIGGYBANK_ABI,
    functionName: 'getBalance',
  })

  // Read unlock time
  const { data: unlockTime, refetch: refetchUnlockTime } = useReadContract({
    address: PIGGYBANK_ADDRESS,
    abi: PIGGYBANK_ABI,
    functionName: 'unlockTime',
  })

  // Read owner
  const { data: owner } = useReadContract({
    address: PIGGYBANK_ADDRESS,
    abi: PIGGYBANK_ABI,
    functionName: 'owner',
  })

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Deposit function
  const deposit = (amount: string) => {
    if (!address) return

    writeContract({
      address: PIGGYBANK_ADDRESS,
      abi: PIGGYBANK_ABI,
      functionName: 'deposit',
      value: parseEther(amount),
    })
  }

  // Withdraw function
  const withdraw = () => {
    if (!address) return

    writeContract({
      address: PIGGYBANK_ADDRESS,
      abi: PIGGYBANK_ABI,
      functionName: 'withdraw',
    })
  }

  return {
    balance,
    unlockTime,
    owner,
    deposit,
    withdraw,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    refetchBalance,
    refetchUnlockTime,
  }
}

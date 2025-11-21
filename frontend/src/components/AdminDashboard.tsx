import { useState } from 'react';
import { usePiggyBank } from '../hooks/usePiggyBank';
import { formatEther } from 'viem';

interface Transaction {
  id: string;
  amount: string;
  timestamp: number;
  type: 'deposit' | 'withdrawal';
  user: string;
}

export function AdminDashboard() {
  const [showAll, setShowAll] = useState(false);
  const { balance, totalDeposits, totalWithdrawals, transactions } = usePiggyBank();
  
  // Mock data - in a real app, this would come from your contract or API
  const allTransactions: Transaction[] = [
    // This would be populated with real transaction data
  ];

  const displayedTransactions = showAll ? allTransactions : allTransactions.slice(0, 5);

  return (
    <div className="admin-dashboard">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
          <p className="text-2xl font-bold">{balance ? formatEther(balance) : '0.00'} ETH</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Deposits</h3>
          <p className="text-2xl font-bold">{totalDeposits ? formatEther(totalDeposits) : '0.00'} ETH</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Withdrawals</h3>
          <p className="text-2xl font-bold">{totalWithdrawals ? formatEther(totalWithdrawals) : '0.00'} ETH</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          {allTransactions.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAll ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedTransactions.length > 0 ? (
                displayedTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tx.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.amount} ETH
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`${tx.user.substring(0, 6)}...${tx.user.substring(38)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.timestamp * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

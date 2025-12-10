import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';
import { apiService } from '../services/apiService';
import TransactionCard from './TransactionCard';
import { formatWalletAddress } from '../utils/formatUtilService';

/**
 * TransactionHistory Component
 * 
 * Displays a list of blockchain transactions associated with a connected wallet.
 * Shows transaction details including type, amount, status, and blockchain metadata.
 * 
 * Features:
 * - Fetches latest 20 transactions from connected wallet
 * - Only displays when wallet is connected
 * - Shows formatted wallet address as filter indicator
 * - Displays transaction details in individual cards
 * - Loading and error state handling
 * 
 * Data Flow:
 * 1. User connects MetaMask wallet → account prop updated
 * 2. Effect hook detects account change → triggers fetchTransactions
 * 3. API fetches latest 20 transactions for the account
 * 4. Transactions displayed in TransactionCard components
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.account - Connected wallet address from MetaMask
 *                                Triggers refetch when changed
 * 
 * @example
 * <TransactionHistory account="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
 */
const TransactionHistory = ({ account }) => {
  // State management
  const [transactions, setTransactions] = useState([]); // Array of transaction objects
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState(null); // Error messages from failed API calls

  /**
   * Fetches blockchain transactions from the API
   * 
   * Parameters:
   * - null: No wallet filter (fetches all transactions accessible to current user)
   * - 20: Limits results to the 20 most recent transactions
   * 
   * This provides a manageable view of recent activity without overwhelming the UI.
   * 
   * @async
   * @function fetchTransactions
   * @returns {Promise<void>}
   */
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call API to fetch transactions (null = all, 20 = limit to 20 results)
      const response = await apiService.getTransactions(null, 20);

      // Update transactions state with API response
      setTransactions(response.transactions || []);
      setError(null);
    } catch (err) {
      // Handle API errors gracefully
      setError(err.message || 'Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect Hook: Fetches transactions when wallet account changes
   * 
   * Behavior:
   * - If account is provided: Fetch transactions for that wallet
   * - If account is not provided: Clear transactions list
   * 
   * Dependencies: [account]
   * - Refetches whenever account prop changes (new wallet connected/disconnected)
   */
  useEffect(() => {
    if (account) {
      // Fetch transactions when wallet is connected
      fetchTransactions();
    } else {
      // Clear transactions when wallet is disconnected
      setTransactions([]);
      setLoading(false);
    }
  }, [account]);

  // Loading state UI
  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  // Main component rendering
  return (
    <div className="transaction-history-container">
      {/* Header section with title and wallet filter info */}
      <div className="transaction-header">
        {/* Component title */}
        <h2>Transaction History</h2>

        {/* 
          Wallet filter indicator
          Only shown when wallet is connected
          Displays formatted wallet address to show what account is being viewed
        */}
        {account && (
          <div className="wallet-filter">
            Filtering for: {formatWalletAddress(account)}
          </div>
        )}
      </div>

      {/* Transaction list or empty state */}
      {transactions.length === 0 ? (
        // Empty state message when no transactions exist
        <p>No transactions found for this wallet address.</p>
      ) : (
        // Transaction list container
        <div className="transactions-list">
          {/* 
            Map through transactions and render each one
            Each transaction displayed in its own card component
          */}
          {transactions.map((transaction) => (
            <div key={transaction.id}>
              {/* Individual transaction card component */}
              <TransactionCard transaction={transaction} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
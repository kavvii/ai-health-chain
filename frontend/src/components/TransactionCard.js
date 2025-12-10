import { formatDate, formatWalletAddress } from '../utils/formatUtilService';

/**
 * TransactionCard Component
 * 
 * Displays detailed information about a blockchain transaction.
 * Used in TransactionHistory to show individual transaction records.
 * 
 * Features:
 * - Transaction type and amount display
 * - Status indicator with dynamic icon (confirmed/pending)
 * - Wallet addresses with truncation and tooltip
 * - Blockchain metadata (block number, gas used, timestamp)
 * - Full transaction hash for verification
 * 
 * Transaction Types Supported:
 * - consent_creation: Patient consent record creation
 * - record_verification: Medical record verification
 * - data_access: Data access transaction
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.transaction - Transaction object from blockchain
 * @param {string} props.transaction.id - Unique transaction identifier
 * @param {string} props.transaction.type - Type of transaction (e.g., "consent_creation")
 * @param {number} props.transaction.amount - Transaction amount in currency
 * @param {string} props.transaction.currency - Currency code (e.g., "ETH", "USD")
 * @param {string} props.transaction.status - Transaction status ("confirmed" or "pending")
 * @param {string} props.transaction.from - Sender's wallet address
 * @param {string} props.transaction.to - Recipient's wallet address
 * @param {number} props.transaction.blockNumber - Blockchain block number
 * @param {string} props.transaction.timestamp - ISO timestamp of transaction
 * @param {string} props.transaction.gasUsed - Gas consumed by transaction
 * @param {string} props.transaction.blockchainTxHash - Full transaction hash on blockchain
 * 
 * @example
 * <TransactionCard transaction={transactionObject} />
 */
const TransactionCard = ({ transaction }) => {
    /**
     * Returns appropriate status icon based on transaction status
     * 
     * Icons:
     * - "confirmed": Green checkmark SVG
     * - "pending": Circle loading indicator SVG
     * 
     * @function getStatusIcon
     * @param {string} status - Transaction status ("confirmed" or "pending")
     * @returns {JSX.Element} SVG icon component
     */
    const getStatusIcon = (status) => {
        if (status === "confirmed") {
            // Checkmark icon for confirmed transactions
            return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M13.3333 4L6 11.3333L2.66667 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )
        }
        // Circle icon for pending transactions
        return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
            </svg>
        )
    }

    return (
        <div className="transaction-card">
            {/* Header section with transaction type, amount, and status */}
            <div className="transaction-header-info">
                {/* Left side: Transaction type and amount */}
                <div className="transaction-primary-info">
                    {/* Transaction type badge with styling */}
                    {/* Underscores replaced with spaces for readability */}
                    <span className={`transaction-type ${transaction.type}`}>
                        {transaction.type.replace("_", " ")}
                    </span>

                    {/* Transaction amount and currency */}
                    <span className="transaction-amount">
                        {transaction.amount} {transaction.currency}
                    </span>
                </div>

                {/* Right side: Status indicator with icon */}
                <span className={`transaction-status ${transaction.status}`}>
                    {/* Dynamic status icon (checkmark or loading circle) */}
                    {getStatusIcon(transaction.status)}

                    {/* Status text */}
                    {transaction.status}
                </span>
            </div>

            {/* Transaction details section */}
            <div className="transaction-details">
                {/* Sender wallet address */}
                <div className="transaction-detail-item">
                    <span className="transaction-detail-label">From</span>
                    {/* 
                        Formatted (truncated) wallet address with full address in tooltip
                        Prevents layout overflow while maintaining accessibility
                    */}
                    <span
                        className="transaction-detail-value address"
                        title={transaction.from} // Full address shown on hover
                    >
                        {formatWalletAddress(transaction.from)}
                    </span>
                </div>

                {/* Recipient wallet address */}
                <div className="transaction-detail-item">
                    <span className="transaction-detail-label">To</span>
                    {/* 
                        Formatted (truncated) wallet address with full address in tooltip
                        Prevents layout overflow while maintaining accessibility
                    */}
                    <span
                        className="transaction-detail-value address"
                        title={transaction.to} // Full address shown on hover
                    >
                        {formatWalletAddress(transaction.to)}
                    </span>
                </div>

                {/* Blockchain block number where transaction was included */}
                <div className="transaction-detail-item">
                    <span className="transaction-detail-label">Block Number</span>
                    {/* Formatted with thousands separator for readability */}
                    <span className="transaction-detail-value">
                        {transaction.blockNumber.toLocaleString()}
                    </span>
                </div>

                {/* Transaction timestamp formatted for readability */}
                <div className="transaction-detail-item">
                    <span className="transaction-detail-label">Timestamp</span>
                    {/* Date formatted using utility function */}
                    <span className="transaction-detail-value transaction-timestamp">
                        {formatDate(transaction.timestamp)}
                    </span>
                </div>

                {/* Gas used by the transaction (blockchain execution cost) */}
                <div className="transaction-detail-item">
                    <span className="transaction-detail-label">Gas Used</span>
                    {/* 
                        Parsed and formatted gas amount
                        Shows actual units consumed with thousands separator
                    */}
                    <span className="transaction-detail-value">
                        {Number.parseInt(transaction.gasUsed).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Transaction hash section */}
            {/* Full blockchain transaction hash for verification and lookup */}
            <div className="transaction-hash-section">
                <span className="transaction-detail-label">Transaction Hash</span>
                {/* 
                    Full transaction hash with tooltip for full visibility
                    Hash is used to verify transaction on blockchain explorer
                */}
                <span
                    className="transaction-detail-value hash"
                    title={transaction.blockchainTxHash} // Full hash shown on hover
                >
                    {transaction.blockchainTxHash}
                </span>
            </div>
        </div>
    )
}

export default TransactionCard;
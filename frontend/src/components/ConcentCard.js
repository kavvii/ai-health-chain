import { formatDate } from '../utils/formatUtilService';

/**
 * ConcentCard Component
 * 
 * Displays a consent record with its details and allows users to approve pending consents.
 * This component is used in the ConsentManagement section to show individual consent items.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.consent - The consent object to display
 * @param {string} props.consent.id - Unique identifier for the consent
 * @param {string} props.consent.patientId - ID of the patient associated with this consent
 * @param {string} props.consent.purpose - Purpose of the consent (e.g., "Research Study Participation")
 * @param {string} props.consent.status - Current status of the consent ("pending", "active", "revoked")
 * @param {string} props.consent.walletAddress - Ethereum wallet address associated with the consent
 * @param {string} props.consent.createdAt - ISO timestamp when the consent was created
 * @param {string} props.consent.blockchainTxHash - Hash of the blockchain transaction (optional)
 * @param {Function} props.onUpdateStatus - Callback function to handle status updates
 * 
 * @example
 * <ConcentCard 
 *   consent={consentObject} 
 *   onUpdateStatus={handleUpdateStatus}
 * />
 */
const ConcentCard = ({ consent, onUpdateStatus }) => {
    /**
     * Formats a date string to a readable format
     * @param {string} dateString - ISO date string to format
     * @returns {string} Formatted date (e.g., "Jan 15, 2024")
     */
    // Note: This is imported from formatUtilService for reusability across the app

    /**
     * Handles the approval of a pending consent
     * Calls the onUpdateStatus callback with the consent ID and 'active' status
     */
    const handleApprove = () => {
        if (onUpdateStatus) {
            onUpdateStatus(consent.id, 'active');
        }
    }

    return (
        <div key={consent.id} className="consent-card">
            {/* Header section with purpose and status badge */}
            <div className="consent-header-info">
                <div className="consent-purpose">{consent.purpose}</div>
                {/* Status badge with dynamic styling based on consent status */}
                <span className={`consent-status ${consent.status}`}>
                    {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
                </span>
            </div>

            {/* Detailed information about the consent */}
            <div className="consent-details">
                {/* Patient identifier */}
                <div className="consent-detail-item">
                    <strong>Patient ID:</strong>
                    <span>{consent.patientId}</span>
                </div>

                {/* Wallet address associated with the consent */}
                <div className="consent-detail-item">
                    <strong>Wallet Address:</strong>
                    <span className="consent-wallet">{consent.walletAddress}</span>
                </div>

                {/* Creation timestamp formatted for readability */}
                <div className="consent-detail-item">
                    <strong>Created At:</strong>
                    <span>{formatDate(consent.createdAt)}</span>
                </div>

                {/* Blockchain transaction hash (only shown if available) */}
                {consent.blockchainTxHash && (
                    <div className="consent-detail-item">
                        <strong>Blockchain Hash:</strong>
                        <span className="consent-tx-hash">{consent.blockchainTxHash}</span>
                    </div>
                )}
            </div>

            {/* Action buttons - only shown for pending consents */}
            {consent.status === "pending" && (
                <div className="consent-actions">
                    <button
                        className="action-btn primary"
                        onClick={handleApprove}
                    >
                        Approve
                    </button>
                </div>
            )}
        </div>
    )
}

export default ConcentCard;
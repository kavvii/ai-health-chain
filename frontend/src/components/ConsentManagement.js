import React, { useState, useEffect } from 'react';
import './ConsentManagement.css';
import { apiService } from '../services/apiService';
import { useWeb3 } from '../hooks/useWeb3';
import ConcentCard from './ConcentCard';

/**
 * ConsentManagement Component
 * 
 * Manages patient data sharing consents with blockchain integration.
 * Allows users to:
 * - View all consents with filtering by status (All, Active, Pending)
 * - Create new consents with digital signatures
 * - Approve pending consents
 * 
 * Requires a connected Web3 wallet (MetaMask) for full functionality.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.account - Connected wallet address from MetaMask
 * 
 * @example
 * <ConsentManagement account="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb" />
 */
const ConsentManagement = ({ account }) => {
  // Web3 utilities from custom hook
  const { signMessage } = useWeb3();

  // State management
  const [consents, setConsents] = useState([]); // Array of consent objects
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error messages
  const [filterStatus, setFilterStatus] = useState('all'); // Active filter: 'all', 'active', or 'pending'
  const [showCreateForm, setShowCreateForm] = useState(false); // Toggle create form visibility
  const [formData, setFormData] = useState({
    patientId: '', // Patient identifier
    purpose: '', // Consent purpose/category
  });

  /**
   * Fetches consents from the API based on current filter status
   * Filters can be: 'all', 'active', or 'pending'
   * 
   * @async
   * @function fetchConsents
   * @returns {Promise<void>}
   */
  const fetchConsents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call API with appropriate filter
      const response = await apiService.getConsents(null, filterStatus === 'all' ? null : filterStatus);

      // Update state with fetched consents
      setConsents(response.consents || []);
      setError(null);
    } catch (err) {
      // Handle errors gracefully
      setError(err.message || 'Failed to fetch consents');
      setConsents([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect hook: Fetches consents whenever the filter status changes
   */
  useEffect(() => {
    fetchConsents();
  }, [filterStatus]);

  /**
   * Handles creation of a new consent record
   * 
   * Process:
   * 1. Validates wallet connection
   * 2. Creates a message to sign combining purpose and patient ID
   * 3. Signs the message using the connected wallet
   * 4. Sends consent data with signature to the backend
   * 5. Refreshes consent list on success
   * 
   * @async
   * @function handleCreateConsent
   * @param {Event} e - Form submit event
   * @returns {Promise<void>}
   */
  const handleCreateConsent = async (e) => {
    e.preventDefault();

    // Require wallet connection for consent creation
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Create a message combining consent details for signing
      const message = `I consent to: ${formData.purpose} for patient: ${formData.patientId}`;

      // Sign the message using MetaMask (requires user confirmation)
      const signature = await signMessage(message);

      // Submit consent data to backend with wallet signature
      await apiService.createConsent({
        patientId: formData.patientId,
        purpose: formData.purpose,
        walletAddress: account,
        signature: signature // Blockchain-verified signature
      });

      // Reset form and refresh list on success
      await fetchConsents();
      setFormData({
        patientId: '',
        purpose: ''
      });
      setShowCreateForm(false);
      alert('Consent created successfully!');
    } catch (err) {
      alert('Failed to create consent: ' + err.message);
    }
  };

  /**
   * Updates a consent's status (e.g., from pending to active)
   * Called when user approves a pending consent
   * 
   * @async
   * @function handleUpdateStatus
   * @param {string} consentId - ID of the consent to update
   * @returns {Promise<void>}
   */
  const handleUpdateStatus = async (consentId) => {
    try {
      // Call API to update consent status
      await apiService.updateConsent(consentId, { status: "active" });

      // Refresh consent list to reflect changes
      fetchConsents();
    } catch (err) {
      alert('Failed to update consent: ' + err.message);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="consent-management-container">
        <div className="loading">Loading consents...</div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="consent-management-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  // Main component rendering
  return (
    <div className="consent-management-container">
      {/* Header with title and create button */}
      <div className="consent-header">
        <h2>Consent Management</h2>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={!account} // Disabled without wallet connection
        >
          {showCreateForm ? 'Cancel' : 'Create New Consent'}
        </button>
      </div>

      {/* Warning message if wallet is not connected */}
      {!account && (
        <div className="warning">
          Please connect your MetaMask wallet to manage consents
        </div>
      )}

      {/* Create Consent Form - Only shown when toggled and wallet is connected */}
      {showCreateForm && account && (
        <div className="create-consent-form">
          <h3>Create New Consent</h3>
          <form onSubmit={handleCreateConsent}>
            {/* Patient ID input field */}
            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                required
                placeholder="e.g., patient-001"
              />
            </div>

            {/* Purpose dropdown field */}
            <div className="form-group">
              <label>Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
              >
                <option value="">Select purpose...</option>
                <option value="Research Study Participation">Research Study Participation</option>
                <option value="Data Sharing with Research Institution">Data Sharing with Research Institution</option>
                <option value="Third-Party Analytics Access">Third-Party Analytics Access</option>
                <option value="Insurance Provider Access">Insurance Provider Access</option>
              </select>
            </div>

            {/* Submit button - Triggers wallet signature prompt */}
            <button type="submit" className="submit-btn">
              Sign & Create Consent
            </button>
          </form>
        </div>
      )}

      {/* Consents list or empty state */}
      {consents.length === 0 ? (
        <p>No consents found.</p>
      ) : (
        <>
          {/* Filter buttons for consent status */}
          <div className="consent-filters">
            <button
              className={filterStatus === 'all' ? 'active' : ''}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={filterStatus === 'active' ? 'active' : ''}
              onClick={() => setFilterStatus('active')}
            >
              Active
            </button>
            <button
              className={filterStatus === 'pending' ? 'active' : ''}
              onClick={() => setFilterStatus('pending')}
            >
              Pending
            </button>
          </div>

          {/* Render consent cards for each consent */}
          <div className="consents-list">
            {consents.map((consent) => (
              <div key={consent.id}>
                <ConcentCard
                  consent={consent}
                  onUpdateStatus={handleUpdateStatus}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ConsentManagement;
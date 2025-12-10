import React, { useState, useEffect } from 'react';
import './StatsDashboard.css';
import { apiService } from '../services/apiService';

/**
 * StatsDashboard Component
 * 
 * Displays key platform statistics in a dashboard grid layout.
 * Shows metrics about patients, medical records, consents, and blockchain transactions.
 * 
 * Statistics Displayed:
 * - Patient Management: Total registered patients
 * - Medical Records: Total records stored in the system
 * - Consent Management: Total, active, and pending consents
 * - Blockchain: Total transactions recorded
 * 
 * Features:
 * - Auto-fetches statistics on component mount
 * - Responsive grid layout for stat cards
 * - Primary stat card styling for "Total Patients"
 * - Loading and error state handling
 * - Reusable stat card configuration system
 * 
 * @component
 * 
 * @example
 * <StatsDashboard />
 */
const StatsDashboard = () => {
  // State management
  const [stats, setStats] = useState(null); // Statistics data from API response
  const [loading, setLoading] = useState(true); // Loading state for initial API call
  const [error, setError] = useState(null); // Error messages from failed API calls

  /**
   * Fetches platform statistics from the backend API
   * 
   * The API returns aggregated metrics about:
   * - totalPatients: Count of registered patients in the system
   * - totalRecords: Total medical records stored
   * - totalConsents: Total consent records created
   * - activeConsents: Currently active/approved consents
   * - pendingConsents: Consents awaiting approval
   * - totalTransactions: Blockchain transaction count
   * 
   * Called once on component mount via useEffect
   * 
   * @async
   * @function fetchStats
   * @returns {Promise<void>}
   */
  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call API to fetch platform statistics
      const response = await apiService.getStats();

      // Update stats state with API response
      setStats(response || null);
      setError(null);
    } catch (err) {
      // Handle API errors gracefully
      setError(err.message || 'Failed to fetch statistics');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generates stat card objects from API response data
   * 
   * Each stat card contains:
   * - label: Display name of the metric (shown as card title)
   * - value: The actual statistic number (prominently displayed)
   * - description: Explanation of what the metric represents
   * - isPrimary: Boolean to apply special styling (true for "Total Patients")
   * 
   * Card Configuration Details:
   * 1. Total Patients - Primary stat (highlighted styling)
   *    Represents all registered patients in the healthcare system
   * 
   * 2. Total Records - Secondary stat
   *    Shows cumulative medical records stored on the platform
   * 
   * 3. Total Consents - Secondary stat
   *    Count of all consent records created in the system
   * 
   * 4. Active Consents - Secondary stat
   *    Currently approved and active consent agreements
   * 
   * 5. Pending Consents - Secondary stat
   *    Consent records awaiting patient/provider approval
   * 
   * 6. Total Transactions - Secondary stat
   *    Count of blockchain transactions recorded for data integrity
   * 
   * Note: Returns empty array if stats data hasn't loaded yet
   * 
   * @function getStatCards
   * @returns {Array<Object>} Array of stat card configuration objects
   */
  const getStatCards = () => {
    // Return empty array if stats haven't loaded yet (prevents rendering undefined values)
    if (!stats) return [];

    // Define all stat cards with their configuration
    return [
      {
        label: "Total Patients",
        value: stats.totalPatients,
        description: "Registered patients in the system",
        isPrimary: true, // Primary stat - highlighted with special styling
      },
      {
        label: "Total Records",
        value: stats.totalRecords,
        description: "Medical records stored",
        isPrimary: false, // Secondary stat - standard styling
      },
      {
        label: "Total Consents",
        value: stats.totalConsents,
        description: "Consent forms collected",
        isPrimary: false, // Secondary stat - standard styling
      },
      {
        label: "Active Consents",
        value: stats.activeConsents,
        description: "Currently active consents",
        isPrimary: false, // Secondary stat - standard styling
      },
      {
        label: "Pending Consents",
        value: stats.pendingConsents,
        description: "Awaiting approval",
        isPrimary: false, // Secondary stat - standard styling
      },
      {
        label: "Total Transactions",
        value: stats.totalTransactions,
        description: "Blockchain transactions",
        isPrimary: false, // Secondary stat - standard styling
      },
    ]
  }

  /**
   * Effect Hook: Fetches statistics on component mount
   * 
   * Behavior:
   * - Runs once when component first renders
   * - Calls fetchStats to retrieve platform statistics
   * 
   * Dependencies: [] (empty array)
   * - Empty dependency array ensures this runs only once on mount
   * - Does not refetch on prop changes or state updates
   */
  useEffect(() => {
    fetchStats();
  }, []);

  // Loading state UI
  if (loading) {
    return (
      <div className="stats-dashboard-container">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  // Error state UI
  if (error || !stats) {
    return (
      <div className="stats-dashboard-container">
        <div className="error">
          Error loading statistics: {error || 'No data available'}
        </div>
      </div>
    );
  }

  // Main dashboard rendering
  return (
    <div className="stats-dashboard-container">
      {/* Dashboard title */}
      <h2>Platform Statistics</h2>

      {/* Responsive grid layout for stat cards */}
      <div className="stats-grid">
        {/* 
          Map through stat cards and render each one
          Each stat card displays:
          - Label (metric name)
          - Value (the actual number)
          - Description (explanation of the metric)
          - Dynamic CSS class for primary/secondary styling
        */}
        {getStatCards().map((stat, index) => (
          <div
            key={index}
            className={`stat-card ${stat.isPrimary ? "primary" : ""}`}
          >
            {/* Stat label/title */}
            {/* Identifies what metric is being displayed */}
            <div className="stat-label">{stat.label}</div>

            {/* Stat value (the actual number) */}
            {/* Prominently displayed as the main metric value */}
            <div className="stat-value">{stat.value}</div>

            {/* Stat description/explanation */}
            {/* Provides context about what the metric represents */}
            <div className="stat-description">{stat.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsDashboard;
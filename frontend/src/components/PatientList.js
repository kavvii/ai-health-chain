import React, { useState, useEffect } from 'react';
import './PatientList.css';
import { apiService } from '../services/apiService';
import PatientCard from './PatientCard';

/**
 * PatientList Component
 * 
 * Displays a paginated list of patients with search functionality.
 * Serves as the main view for browsing and selecting patients in the application.
 * 
 * Features:
 * - Paginated display (10 patients per page)
 * - Debounced search (500ms delay) to minimize API calls while typing
 * - Click on patient card to view detailed patient information
 * - Previous/Next pagination controls
 * - Loading and error state handling
 * 
 * Data Flow:
 * 1. User types in search input → searchInput state updates immediately
 * 2. After 500ms of no typing → searchTerm state updates and triggers API call
 * 3. User clicks pagination buttons → currentPage updates and triggers API call
 * 4. Fetched patients displayed in a list of PatientCard components
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onSelectPatient - Callback function called when a patient is selected
 *                                           Receives patientId as parameter
 * 
 * @example
 * <PatientList onSelectPatient={(patientId) => viewPatientDetails(patientId)} />
 */
const PatientList = ({ onSelectPatient }) => {
  // State management
  const [patients, setPatients] = useState([]); // Array of patient objects to display
  const [loading, setLoading] = useState(true); // Loading state during API calls
  const [error, setError] = useState(null); // Error messages from failed API calls
  const [searchTerm, setSearchTerm] = useState(''); // Debounced search term (triggers API calls)
  const [searchInput, setSearchInput] = useState(''); // Immediate search input (for UI)
  const [currentPage, setCurrentPage] = useState(1); // Current pagination page number
  const [pagination, setPagination] = useState(null); // Pagination metadata from API

  /**
   * Fetches patients from the API with current filters and pagination
   * 
   * Called when:
   * - Component mounts
   * - currentPage changes (user clicks pagination)
   * - searchTerm changes (after debounce delay)
   * 
   * @async
   * @function fetchPatients
   * @returns {Promise<void>}
   */
  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call API with pagination and search parameters
      const response = await apiService.getPatients(
        currentPage, // Current page number
        10, // Items per page
        searchTerm // Search query (empty string for no filter)
      );

      // Update patients list with API response
      setPatients(response.patients || []);

      // Update currentPage with API response (ensures consistency)
      setCurrentPage(response.pagination.page);

      // Calculate pagination flags for UI controls
      setPagination({
        ...response.pagination,
        // Check if there are more pages after current
        hasNextPage: response.pagination.page < response.pagination.totalPages,
        // Check if there are pages before current
        hasPrevPage: response.pagination.page > 1
      });

      setError(null);
    } catch (err) {
      // Handle API errors gracefully
      setError(err.message || 'Failed to fetch patients');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect Hook: Fetches patients when currentPage or searchTerm changes
   * 
   * This ensures fresh data when:
   * - User navigates to a different page
   * - User completes a search (after debounce)
   * 
   * Dependencies: [currentPage, searchTerm]
   */
  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchTerm]);

  /**
   * Effect Hook: Debounces search input with 500ms delay
   * 
   * Purpose: Prevents excessive API calls while user is typing
   * - User types character → searchInput updates immediately
   * - 500ms after last keystroke → searchTerm updates → triggers API call
   * 
   * When search term changes:
   * - Reset to page 1 (to show results from beginning)
   * - Clear pagination from previous search
   * 
   * Dependencies: [searchInput]
   */
  useEffect(() => {
    // Set timeout to delay search term update
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset to first page on new search
    }, 500); // 500ms debounce delay

    // Cleanup: Clear timeout if component unmounts or searchInput changes
    return () => clearTimeout(timer);
  }, [searchInput]);

  /**
   * Handles search input changes
   * Updates searchInput state immediately (without waiting for debounce)
   * 
   * @function handleSearch
   * @param {Event} e - Input change event
   */
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  /**
   * Navigates to the previous page
   * Only enabled if there are previous pages available
   * 
   * @function handlePreviousPage
   */
  const handlePreviousPage = () => {
    if (pagination && pagination.hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  /**
   * Navigates to the next page
   * Only enabled if there are more pages available
   * 
   * @function handleNextPage
   */
  const handleNextPage = () => {
    if (pagination && pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="patient-list-container">
        <div className="loading">Loading patients...</div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="patient-list-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  // Main component rendering
  return (
    <div className="patient-list-container">
      {/* Header section with title and search input */}
      <div className="patient-list-header">
        <h2>Patients</h2>
        {/* Search input field with debounced onChange */}
        <input
          type="text"
          placeholder="Search patients..."
          className="search-input"
          value={searchInput} // Immediate input value (no debounce)
          onChange={handleSearch} // Updates searchInput state
        />
      </div>

      {/* Patient list or empty state */}
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="patient-list">
          {/* Render a PatientCard for each patient */}
          {patients.map((patient) => (
            // Wrapper div with click handler to select patient
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient.id)} // Call parent callback with patient ID
              style={{ cursor: 'pointer' }} // Visual feedback for clickable element
            >
              {/* Patient card component displays patient information */}
              <PatientCard patient={patient} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls - Only shown when pagination data exists */}
      {pagination && (
        <div className="pagination">
          {/* Previous page button */}
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1} // Disabled on first page
          >
            Previous
          </button>

          {/* Current page indicator */}
          <span className="pagination-info">
            Page {currentPage} of {pagination.totalPages}
          </span>

          {/* Next page button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === pagination.totalPages} // Disabled on last page
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientList;
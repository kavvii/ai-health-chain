import React, { useState, useEffect, useCallback } from 'react';
import './PatientDetail.css';
import { apiService } from '../services/apiService';
import PatientInformation from './PatientInformation';
import MedicalRecordCard from './MedicalRecordCard';

/**
 * PatientDetail Component
 * 
 * Displays comprehensive information about a single patient including:
 * - Complete patient demographics and contact information
 * - Medical records associated with the patient
 * 
 * This is a detailed view component that fetches data from the backend API
 * and renders child components to display patient information and medical records.
 * 
 * Data Flow:
 * 1. Component receives patientId as prop
 * 2. On mount or when patientId changes, fetches patient data and records in parallel
 * 3. Renders PatientInformation and MedicalRecordCard child components
 * 4. Provides back navigation to parent component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.patientId - ID of the patient to display details for
 * @param {Function} props.onBack - Callback function to navigate back to patient list
 * 
 * @example
 * <PatientDetail patientId="patient-001" onBack={() => navigate(-1)} />
 */
const PatientDetail = ({ patientId, onBack }) => {
  // State management
  const [patient, setPatient] = useState(null); // Patient object containing demographics
  const [records, setRecords] = useState([]); // Array of medical records
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null); // Error messages from API calls

  /**
   * Fetches patient details and medical records from the API
   * 
   * Uses Promise.all to fetch both patient and records data in parallel
   * for better performance instead of sequential requests.
   * 
   * API Endpoints Called:
   * - apiService.getPatient(patientId) - Fetches patient demographics
   * - apiService.getPatientRecords(patientId) - Fetches patient's medical records
   * 
   * @async
   * @function fetchPatientData
   * @returns {Promise<void>}
   */
  const fetchPatientData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both patient data and records in parallel for efficiency
      const [patientResponse, recordsResponse] = await Promise.all([
        apiService.getPatient(patientId),
        apiService.getPatientRecords(patientId)
      ]);

      // Update patient state with fetched data
      setPatient(patientResponse);

      // Update records state (handle both wrapped and direct array responses)
      setRecords(recordsResponse.records || []);

      setError(null);
    } catch (err) {
      // Handle errors gracefully
      setError(err.message || 'Failed to fetch patient data');
      setPatient(null);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  /**
   * Effect hook: Fetches patient data when component mounts or patientId changes
   * 
   * Dependencies:
   * - patientId: Re-fetch when viewing a different patient
   * - fetchPatientData: Re-run when fetch function is recreated
   */
  useEffect(() => {
    // Only fetch if a valid patientId is provided
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId, fetchPatientData]);

  // Loading state UI
  if (loading) {
    return (
      <div className="patient-detail-container">
        <div className="loading">Loading patient details...</div>
      </div>
    );
  }

  // Error state UI
  if (error || !patient) {
    return (
      <div className="patient-detail-container">
        <div className="error">Error loading patient: {error || 'Patient not found'}</div>
        <button onClick={onBack} className="back-btn">Back to List</button>
      </div>
    );
  }

  // Main content rendering
  return (
    <div className="patient-detail-container">
      {/* Header with back navigation */}
      <div className="patient-detail-header">
        <button onClick={onBack} className="back-btn">
          ← Back to List
        </button>
      </div>

      {/* Main content section with two subsections */}
      <div className="patient-detail-content">
        {/* Patient Information Section */}
        {/* Displays demographics, contact info, and wallet address */}
        <div className="patient-info-section">
          <h2>Patient Information</h2>
          {/* Child component handles rendering patient details */}
          <PatientInformation patient={patient} />
        </div>

        {/* Medical Records Section */}
        {/* Displays all medical records associated with the patient */}
        <div className="patient-records-section">
          <h2>Medical Records ({records.length})</h2>

          {/* Conditional rendering: Show message if no records exist */}
          {records.length === 0 ? (
            <p>No medical records found for this patient.</p>
          ) : (
            // Render list of medical record cards
            <div className="records-list">
              {records.map((record) => (
                // Each record displayed in a dedicated card component
                <MedicalRecordCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
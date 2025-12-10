import React, { useState } from 'react';
import './MedicalRecordCard.css';
import { formatDate, truncateDescription } from '../utils/formatUtilService';

/**
 * MedicalRecordCard Component
 * 
 * Displays a single medical record with expandable description, 
 * doctor/hospital information, and blockchain verification hash.
 * 
 * Features:
 * - Collapsible/expandable description for long text
 * - Status indicator with visual icon
 * - Record type badge for categorization
 * - Blockchain hash for data integrity verification
 * - Responsive layout with grid system
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.record - Medical record object
 * @param {string} props.record.id - Unique identifier for the record
 * @param {string} props.record.type - Type of record (e.g., "Lab Report", "X-Ray", "MRI")
 * @param {string} props.record.title - Title or name of the medical record
 * @param {string} props.record.date - ISO timestamp of the record
 * @param {string} props.record.description - Detailed description of the medical record
 * @param {string} props.record.doctor - Name of the attending doctor
 * @param {string} props.record.hospital - Name of the hospital/facility
 * @param {string} props.record.status - Status of the record (e.g., "verified", "pending")
 * @param {string} props.record.blockchainHash - Hash stored on blockchain for verification
 * 
 * @example
 * <MedicalRecordCard record={medicalRecordObject} />
 */
const MedicalRecordCard = ({ record }) => {
    /**
     * State to track which records have expanded descriptions
     * Key: record ID, Value: boolean indicating if expanded
     * @type {[Object, Function]}
     */
    const [expandedRecords, setExpandedRecords] = useState({})

    /**
     * Toggles the expanded/collapsed state of a record's description
     * Used for "Read more" / "Show less" functionality
     * 
     * @function toggleExpand
     * @param {string} recordId - ID of the record to toggle
     */
    const toggleExpand = (recordId) => {
        setExpandedRecords((prev) => ({
            ...prev,
            [recordId]: !prev[recordId], // Toggle boolean value
        }))
    }

    return (
        <div className="record-card">
            {/* Header section with record metadata */}
            <div className="record-header">
                {/* Left side: Type badge, title, and date */}
                <div className="record-header-left">
                    {/* Record type badge for quick categorization */}
                    <span className="record-type-badge">{record.type}</span>

                    {/* Record title */}
                    <h3 className="record-title">{record.title}</h3>

                    {/* Formatted date for readability */}
                    <p className="record-date">{formatDate(record.date)}</p>
                </div>

                {/* Right side: Status indicator with icon */}
                <span className={`record-status ${record.status.toLowerCase()}`}>
                    {/* Custom SVG checkmark icon for status indication */}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        {/* Circle background */}
                        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                        {/* Checkmark path */}
                        <path
                            d="M4 6L5.5 7.5L8 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    {/* Status text */}
                    {record.status}
                </span>
            </div>

            {/* Main content section with record details */}
            <div className="record-body">
                {/* Full-width description section with expand/collapse */}
                <div className="record-item-full">
                    <span className="record-label">Description:</span>
                    <div className="record-description">
                        <p className="record-value">
                            {/* Show full or truncated description based on expansion state */}
                            {expandedRecords[record.id]
                                ? record.description
                                : truncateDescription(record.description, 200)
                            }
                        </p>

                        {/* "Read more" / "Show less" button - only shown if description exceeds 200 chars */}
                        {record.description.length > 200 && (
                            <button
                                onClick={() => toggleExpand(record.id)}
                                className="expand-button"
                            >
                                {expandedRecords[record.id] ? "Show less" : "Read more"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Grid layout for doctor and hospital information */}
                <div className="record-details-grid">
                    {/* Attending doctor information */}
                    <div className="record-item">
                        <span className="record-label">Doctor:</span>
                        <span className="record-value">{record.doctor}</span>
                    </div>

                    {/* Medical facility information */}
                    <div className="record-item">
                        <span className="record-label">Hospital:</span>
                        <span className="record-value">{record.hospital}</span>
                    </div>
                </div>

                {/* Blockchain hash for data integrity verification */}
                <div className="record-item-full">
                    <span className="record-label">Blockchain Hash:</span>
                    {/* Hash displayed in monospace font for clarity */}
                    <span className="record-value record-hash">{record.blockchainHash}</span>
                </div>
            </div>
        </div>
    )
}

export default MedicalRecordCard;
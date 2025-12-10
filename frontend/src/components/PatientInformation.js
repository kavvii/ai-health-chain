import './PatientInformation.css';
import { formatDate } from '../utils/formatUtilService';

/**
 * PatientInformation Component
 * 
 * Displays detailed patient demographic and contact information in a structured grid layout.
 * Used as a child component within PatientDetail to show comprehensive patient information.
 * 
 * Information Displayed:
 * - Identification: Patient ID, Full Name
 * - Demographics: Date of Birth, Gender
 * - Contact: Email, Phone, Address
 * - Blockchain: Wallet Address for healthcare data transactions
 * - Administrative: Registration date in the system
 * 
 * Layout:
 * - Uses CSS Grid for responsive layout
 * - Two-column grid for standard fields
 * - Full-width fields for longer content (Address, Wallet)
 * - Date fields are automatically formatted for readability
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.patient - Complete patient object
 * @param {string} props.patient.patientId - Medical record ID (e.g., "P-2024-001")
 * @param {string} props.patient.name - Full legal name of the patient
 * @param {string} props.patient.dateOfBirth - ISO date string (e.g., "1985-03-15")
 * @param {string} props.patient.gender - Patient's gender (e.g., "Male", "Female")
 * @param {string} props.patient.email - Patient's email address for communication
 * @param {string} props.patient.phone - Patient's phone number
 * @param {string} props.patient.address - Patient's residential address
 * @param {string} props.patient.walletAddress - Ethereum wallet address for blockchain operations
 * @param {string} props.patient.createdAt - ISO timestamp of patient registration
 * 
 * @example
 * <PatientInformation patient={patientObject} />
 */
const PatientInformation = ({ patient }) => {
    return (
        <div className="info-grid">
            {/* Patient ID Field */}
            {/* Unique identifier in the medical system */}
            <div className="info-item">
                <span className="info-label">Patient ID</span>
                <span className="info-value">{patient.patientId}</span>
            </div>

            {/* Full Name Field */}
            {/* Legal name of the patient */}
            <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{patient.name}</span>
            </div>

            {/* Date of Birth Field */}
            {/* Formatted using formatDate utility for consistency */}
            <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">{formatDate(patient.dateOfBirth)}</span>
            </div>

            {/* Gender Field */}
            {/* Patient's gender for medical records */}
            <div className="info-item">
                <span className="info-label">Gender</span>
                <span className="info-value">{patient.gender}</span>
            </div>

            {/* Email Field */}
            {/* Primary email contact for the patient */}
            <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{patient.email}</span>
            </div>

            {/* Phone Field */}
            {/* Primary phone contact for the patient */}
            <div className="info-item">
                <span className="info-label">Phone</span>
                <span className="info-value">{patient.phone}</span>
            </div>

            {/* Address Field - Full Width */}
            {/* Residential address (may be long, so spans full width) */}
            <div className="info-item full-width">
                <span className="info-label">Address</span>
                <span className="info-value">{patient.address}</span>
            </div>

            {/* Wallet Address Field - Full Width */}
            {/* Ethereum wallet address for blockchain-based healthcare transactions */}
            {/* Used for consent management and data sharing verification */}
            <div className="info-item full-width">
                <span className="info-label">Wallet Address</span>
                <span className="info-value wallet-value">{patient.walletAddress}</span>
            </div>

            {/* Registration Date Field */}
            {/* Date when the patient was registered in the system */}
            {/* Formatted using formatDate utility for consistency */}
            <div className="info-item">
                <span className="info-label">Registration Date</span>
                <span className="info-value">{formatDate(patient.createdAt)}</span>
            </div>
        </div>
    )
}

export default PatientInformation;
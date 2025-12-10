import { formatDate, formatWalletAddress } from '../utils/formatUtilService';

/**
 * PatientCard Component
 * 
 * Displays a summary card of a patient's basic information.
 * Used in patient lists to show key details at a glance.
 * 
 * The card presents:
 * - Patient name and ID
 * - Date of birth and gender
 * - Contact information (email and phone)
 * - Address
 * - Wallet address for blockchain transactions
 * 
 * This component is typically rendered within a PatientList or similar parent
 * component and may be made clickable to navigate to patient details.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.patient - Patient object to display
 * @param {string} props.patient.id - Unique identifier for the patient
 * @param {string} props.patient.name - Full name of the patient
 * @param {string} props.patient.patientId - Medical record ID (e.g., "P-2024-001")
 * @param {string} props.patient.dateOfBirth - ISO date string (e.g., "1985-03-15")
 * @param {string} props.patient.gender - Patient's gender (e.g., "Male", "Female")
 * @param {string} props.patient.email - Patient's email address
 * @param {string} props.patient.phone - Patient's phone number
 * @param {string} props.patient.address - Patient's physical address
 * @param {string} props.patient.walletAddress - Ethereum wallet address for blockchain
 * 
 * @example
 * <PatientCard patient={patientObject} />
 */
const PatientCard = ({ patient }) => {
    return (
        <div className="patient-card">
            {/* Header section with patient name and ID */}
            <div className="patient-card-header">
                <div>
                    {/* Patient's full name */}
                    <h3 className="patient-name">{patient.name}</h3>

                    {/* Patient's medical record ID for quick reference */}
                    <span className="patient-id">{patient.patientId}</span>
                </div>
            </div>

            {/* Personal information section with contact details */}
            <div className="patient-info">
                {/* Date of birth and gender information */}
                <div className="patient-info-item">
                    {/* Calendar emoji icon */}
                    <span>📅</span>
                    <span>
                        {/* Formatted date of birth and gender separated by bullet */}
                        {formatDate(patient.dateOfBirth)} • {patient.gender}
                    </span>
                </div>

                {/* Email contact information */}
                <div className="patient-info-item">
                    {/* Email emoji icon */}
                    <span>📧</span>
                    <span>{patient.email}</span>
                </div>

                {/* Phone contact information */}
                <div className="patient-info-item">
                    {/* Phone emoji icon */}
                    <span>📱</span>
                    <span>{patient.phone}</span>
                </div>

                {/* Physical address information */}
                <div className="patient-info-item">
                    {/* Location/map emoji icon */}
                    <span>📍</span>
                    <span>{patient.address}</span>
                </div>
            </div>

            {/* Blockchain wallet address section */}
            {/* Used for consent management and blockchain transactions */}
            <div className="patient-wallet">{formatWalletAddress(patient.walletAddress)}</div>
        </div>
    )
}

export default PatientCard;
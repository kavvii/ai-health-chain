/**
 * Format Utility Service
 * 
 * Collection of reusable formatting functions used throughout the application.
 * These utilities standardize data presentation for consistency across all components.
 * 
 * Functions:
 * - formatDate: Converts ISO date strings to readable format
 * - truncateDescription: Shortens long text with ellipsis
 * - formatWalletAddress: Truncates blockchain addresses for display
 * 
 * @module utils/formatUtilService
 */

/**
 * Formats a date string to a readable locale-specific format
 * 
 * Converts ISO date format (e.g., "1985-03-15") to a localized format
 * using the en-US locale with abbreviated month names.
 * 
 * Example Output:
 * - Input: "1985-03-15"
 * - Output: "Mar 15, 1985"
 * 
 * Used in:
 * - PatientCard: Display date of birth
 * - PatientDetail: Display registration dates
 * - MedicalRecordCard: Display record timestamps
 * - TransactionCard: Display transaction timestamps
 * - ConcentCard: Display consent creation dates
 * 
 * @function formatDate
 * @param {string} dateString - ISO date string (e.g., "2024-01-15T10:30:00Z")
 * @returns {string} Formatted date string (e.g., "Jan 15, 2024")
 * 
 * @example
 * const formatted = formatDate("1985-03-15");
 * console.log(formatted); // Output: "Mar 15, 1985"
 */
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric", // Full 4-digit year (e.g., 2024)
        month: "short", // Abbreviated month name (e.g., Jan, Feb)
        day: "numeric", // Day without leading zeros (e.g., 5, 15, 30)
    });
};

/**
 * Truncates text to a maximum length and appends ellipsis if truncated
 * 
 * Shortens long text content for display in constrained UI spaces.
 * If text exceeds maxLength, it's truncated and "..." is appended.
 * If text is shorter than maxLength, it's returned unchanged.
 * 
 * Typical Use Cases:
 * - Medical record descriptions (limit to 200 characters)
 * - Patient addresses (limit to prevent layout overflow)
 * - Long consent purposes (limit in card view)
 * 
 * Used in:
 * - MedicalRecordCard: Display truncated descriptions with "Read more" button
 * - PatientCard: Prevent address overflow
 * 
 * @function truncateDescription
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum allowed length before truncation
 * @returns {string} Truncated text with "..." appended if over maxLength,
 *                   or original text if under maxLength
 * 
 * @example
 * const long = "This is a very long medical record description...";
 * const short = truncateDescription(long, 20);
 * console.log(short); // Output: "This is a very long ..."
 * 
 * @example
 * const short = "Short text";
 * const result = truncateDescription(short, 20);
 * console.log(result); // Output: "Short text" (unchanged)
 */
export const truncateDescription = (text, maxLength) => {
    // Check if text length exceeds maximum
    if (text.length <= maxLength) {
        // Return original text if within limit
        return text;
    }
    // Return truncated text with ellipsis if over limit
    return text.slice(0, maxLength) + "...";
};

/**
 * Formats a blockchain wallet address for display
 * 
 * Truncates long Ethereum wallet addresses to a shorter format
 * for improved readability in UI components while maintaining
 * enough information for visual distinction.
 * 
 * Format: First 8 characters + "..." + Last 6 characters
 * 
 * Example:
 * - Input: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
 * - Output: "0x742d35...f0bEb"
 * 
 * This format:
 * - Shows the protocol prefix (0x) which identifies Ethereum addresses
 * - Provides enough unique characters at start for visual identification
 * - Preserves the end of the address for additional uniqueness
 * - Fits naturally in card layouts and list views
 * 
 * Used in:
 * - PatientCard: Display wallet address
 * - PatientInformation: Display patient wallet
 * - ConcentCard: Display wallet address associated with consent
 * - TransactionCard: Display "From" and "To" wallet addresses
 * - TransactionHistory: Display connected wallet filter
 * 
 * @function formatWalletAddress
 * @param {string} address - Full Ethereum wallet address (42 characters including 0x)
 * @returns {string} Formatted address (e.g., "0x742d35...f0bEb") or empty string if address is falsy
 * 
 * @example
 * const full = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
 * const formatted = formatWalletAddress(full);
 * console.log(formatted); // Output: "0x742d35...f0bEb"
 * 
 * @example
 * const result = formatWalletAddress(null);
 * console.log(result); // Output: "" (empty string)
 */
export const formatWalletAddress = (address) => {
    // Guard against null, undefined, or empty addresses
    if (!address) {
        return '';
    }

    // Return formatted address with first 8 and last 6 characters
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
};
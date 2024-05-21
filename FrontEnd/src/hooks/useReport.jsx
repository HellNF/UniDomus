// src/hooks/useReport.js

/**
 * useReport is a custom hook that encapsulates the state and logic for handling the report popup and submitting reports.
 * @returns {object} - Returns an object containing state variables and event handlers related to the report functionality.
 */
import { useState } from 'react';
import { API_BASE_URL } from '../constant';
import { useAuth } from './../AuthContext';

const useReport = () => {
    const { userId } = useAuth(); // Get the current user's ID
    const [showPopup, setShowPopup] = useState(false);
    const [currentReportType, setCurrentReportType] = useState('');
    const [currentTargetID, setCurrentTargetID] = useState('');
    const [currentMessageID, setCurrentMessageID] = useState('');

    /**
     * Opens the report popup with the specified report type, target ID, and optional message ID.
     * @param {string} reportType - The type of report (e.g., 'user', 'listing', 'message', 'conversation').
     * @param {string} targetID - The ID of the target entity to be reported.
     * @param {string} [messageID] - The optional ID of the message to be reported (if applicable).
     */
    const handleButtonClick = (reportType, targetID, messageID = '') => {
        setCurrentReportType(reportType);
        setCurrentTargetID(targetID);
        setCurrentMessageID(messageID);
        setShowPopup(true);
    };

    /**
     * Closes the report popup.
     */
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    /**
     * Submits the report to the backend API.
     * @param {object} reportData - The data of the report to be submitted.
     */
    const handleSubmitReport = async (reportData) => {
        try {
            const response = await fetch(`${API_BASE_URL}reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token'), // If authentication is required
                },
                body: JSON.stringify({
                    ...reportData,
                    reporterID: userId,
                    targetID: currentTargetID,
                    messageID: currentMessageID,
                }),
            });

            if (response.ok) {
                console.log('Report submitted successfully');
                setShowPopup(false);
            } else {
                console.error('Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
        }
    };

    return {
        showPopup,
        currentReportType,
        currentTargetID,
        currentMessageID,
        handleButtonClick,
        handleClosePopup,
        handleSubmitReport
    };
};

export default useReport;

// src/hooks/useReport.js

/**
 * useReport is a custom hook that encapsulates the state and logic for handling the report popup and submitting reports.
 * @returns {object} - Returns an object containing state variables and event handlers related to the report functionality.
 */
import { useState } from 'react';
import { API_BASE_URL } from '../constant';
import { useAuth } from './../AuthContext';

const useBan = () => {
    
    const [showPopupBan, setShowPopupBan] = useState(false);
    const [targetBan, setTargetBan] = useState('');
    const [currentTargetBanID, setCurrentTargetBanID] = useState('');
  
    const handleButtonClickBan = (target,targetBanID) => {
        setTargetBan(target)
        setCurrentTargetBanID(targetBanID)
        setShowPopupBan(true);
    };

    /**
     * Closes the ban popup.
     */
    const handleClosePopupBan = () => {
        setShowPopupBan(false);
    };

    /**
     * Submits the report to the backend API.
     * @param {object} reportData - The data of the report to be submitted.
     */
    const handleSubmitBan = async (reportData) => {
        try {
            console.log(JSON.stringify({
                ...reportData
            }))
            const response = await fetch(`${API_BASE_URL}${targetBan}/${currentTargetBanID}/ban`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token'), // If authentication is required
                },
                body: JSON.stringify({
                    ...reportData
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
        showPopupBan,
        handleButtonClickBan,
        handleClosePopupBan,
        handleSubmitBan
    };
};

export default useBan;

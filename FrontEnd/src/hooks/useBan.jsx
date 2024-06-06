// src/hooks/useReport.js

/**
 * useReport is a custom hook that encapsulates the state and logic for handling the report popup and submitting reports.
 * @returns {object} - Returns an object containing state variables and event handlers related to the report functionality.
 */
import { useState } from 'react';
import { API_BASE_URL } from '../constant';
import { useAuth } from './../AuthContext';
import { useLoadContext } from '../context/LoadContext';
//import { useBanContext } from '../context/BanContext';

const useBan = () => {

    //const { reload, setReload } = useBanContext();
    const [showPopupBan, setShowPopupBan] = useState(false);
    const [targetBan, setTargetBan] = useState('');
    const [currentTargetBanID, setCurrentTargetBanID] = useState('');
    const { load, setLoad } = useLoadContext();
  
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
                console.log('Ban submitted successfully');
                setLoad(!load);
                setShowPopup(false);
            } else {
                console.error('Failed to submit ban');
            }
        } catch (error) {
            console.error('Error submitting ban:', error);
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

// src/pages/TestPage.jsx
import React, { useState } from 'react';
import ReportPopup from '../components/ReportPopup';
import { API_BASE_URL } from '../constant';
import { useAuth } from './../AuthContext';

const TestPage = () => {
    const { userId } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [currentReportType, setCurrentReportType] = useState('');
    const [currentTargetID, setCurrentTargetID] = useState('');
    const [currentMessageID, setCurrentMessageID] = useState('');

    const handleButtonClick = (reportType, targetID, messageID = '') => {
        setCurrentReportType(reportType);
        setCurrentTargetID(targetID);
        setCurrentMessageID(messageID);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleSubmitReport = async (reportData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/reports`, {
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Test Page</h1>
                <div className="space-y-4">
                    <section>
                        <h2 className="text-xl font-semibold">Section 1</h2>
                        <button onClick={() => handleButtonClick('user', 'targetUserID')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Report User
                        </button>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold">Section 2</h2>
                        <button onClick={() => handleButtonClick('listing', 'targetListingID')} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700">
                            Report Listing
                        </button>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold">Section 3</h2>
                        <button onClick={() => handleButtonClick('message', 'targetMatchID', 'targetMessageID')} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">
                            Report Message
                        </button>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold">Section 4</h2>
                        <button onClick={() => handleButtonClick('conversation', 'targetConversationID')} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                            Report Conversation
                        </button>
                    </section>
                </div>
            </div>
            <ReportPopup
                show={showPopup}
                onClose={handleClosePopup}
                onSubmit={handleSubmitReport}
                reportType={currentReportType}
                targetID={currentTargetID}
                messageID={currentMessageID}
            />
        </div>
    );
};

export default TestPage;

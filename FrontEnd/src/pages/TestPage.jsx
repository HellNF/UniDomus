// src/pages/TestPage.jsx

/**
 * TestPage is a sample page that demonstrates how to use the useReport hook and ReportPopup component.
 * @returns {JSX.Element} - The rendered component.
 */
import React from 'react';
import ReportPopup from '../components/ReportPopup';
import useReport from '../hooks/useReport';

const TestPage = () => {
    const {
        showPopup,
        currentReportType,
        currentTargetID,
        currentMessageID,
        handleButtonClick,
        handleClosePopup,
        handleSubmitReport
    } = useReport();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Test Page</h1>
                <div className="space-y-4">
                    <section>
                        <h2 className="text-xl font-semibold">Section 1</h2>
                        <button onClick={() => handleButtonClick('utente', 'targetUserID')} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Report User
                        </button>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold">Section 2</h2>
                        <button onClick={() => handleButtonClick('inserzione', 'targetListingID')} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700">
                            Report Listing
                        </button>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold">Section 3</h2>
                        <button onClick={() => handleButtonClick('messaggio', 'targetMatchID', 'targetMessageID')} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700">
                            Report Message
                        </button>
                    </section>
                    <section>
                        <h2 className="text-xl font-semibold">Section 4</h2>
                        <button onClick={() => handleButtonClick('match', 'targetConversationID')} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                            Report Match
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

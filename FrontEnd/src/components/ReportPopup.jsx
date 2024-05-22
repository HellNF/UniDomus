// src/components/ReportPopup.jsx

/**
 * ReportPopup is a component that renders a popup form for submitting reports.
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.show - Controls the visibility of the popup.
 * @param {function} props.onClose - Function to call when closing the popup.
 * @param {function} props.onSubmit - Function to call when submitting the report.
 * @param {string} props.reportType - The type of the report (e.g., 'user', 'listing', 'message', 'conversation').
 * @param {string} props.targetID - The ID of the target entity to be reported.
 * @param {string} [props.messageID] - The optional ID of the message to be reported (if applicable).
 * @returns {JSX.Element|null} - The rendered component.
 */
import React, { useState } from 'react';
import UniDomusLogo from '/UniDomusLogo.png';

const ReportPopup = ({ show, onClose, onSubmit, reportType, targetID, messageID }) => {
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ reportType, description, targetID, messageID });
        onClose(); // Close the popup after submission
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-28 w-auto"
                        src={UniDomusLogo}
                        alt="Unidomus"
                    />
                    <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Segnalazione
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Grazie del contributo! Segnala il contenuto inappropriato.
                    </p>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="mt-4">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                Descrizione
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="mt-2 block w-full rounded-md border-0 py-2 text-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 h-40 resize-none"
                            />
                        </div>

                        <div className="mt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                Annulla
                            </button>
                            <button
                                type="submit"
                                className="flex justify-center rounded-md bg-blue-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Invia
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportPopup;

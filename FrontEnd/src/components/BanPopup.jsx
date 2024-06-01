import React, { useState } from "react";
import UniDomusLogo from "/UniDomusLogo.png"; // Adjust the import based on your project structure

export default function BanPopup({ show, onClose, onSubmit, prevBan}) {
  const [banTimeInSeconds, setBanTimeInSeconds] = useState(null);
  const [banPermanently, setBanPermanently] = useState(false);
  const [banMsg, setBanMsg] = useState('');

  if (!show) return null;

  const handleBanClick = (period) => {
    setBanTimeInSeconds(period);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(banTimeInSeconds===0){
        setBanPermanently(true)
    }
    onSubmit({banTimeInSeconds,banPermanently,banMsg});
    onClose(); // Close the popup after submission
};

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
            Provvedimento
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Scegli un provvedimento appropriato tra quelli sotto elencati.
          </p>
          <p className="mt-6 text-sm text-gray-500">
            Ban precedenti: <strong>{prevBan}</strong>
          </p>
          <p className="mt-2 text-sm text-black-500">
            Seleziona il periodo di ban:
          </p>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="mt-4 flex justify-around">
          <div className="checkbox-container-ban">
            <input
              type="radio"
              className="checkbox-btn-ban"
              id="ban-1day"
              name="banPeriod"
              value="1 Day"
              checked={banTimeInSeconds === 86400}
              onChange={() => handleBanClick(86400)}
            />
            <label
              htmlFor="ban-1day"
              className={`checkbox-label-ban checkbox-label-ban-yellow ${banTimeInSeconds === 86400 ? 'scale-110' : ''}`}
            >
              1 Giorno
            </label>
          </div>
          <div className="checkbox-container-ban">
            <input
              type="radio"
              className="checkbox-btn-ban"
              id="ban-1week"
              name="banPeriod"
              value="1 Week"
              checked={banTimeInSeconds === 604800}
              onChange={() => handleBanClick(604800)}
            />
            <label
              htmlFor="ban-1week"
              className={`checkbox-label-ban checkbox-label-ban-orange ${banTimeInSeconds === 604800 ? 'scale-110' : ''}`}
            >
              1 Settimana
            </label>
          </div>
          <div className="checkbox-container-ban">
            <input
              type="radio"
              className="checkbox-btn-ban"
              id="ban-1month"
              name="banPeriod"
              value="1 Month"
              checked={banTimeInSeconds === 2628000}
              onChange={() => handleBanClick(2628000)}
            />
            <label
              htmlFor="ban-1month"
              className={`checkbox-label-ban checkbox-label-ban-dark-orange ${banTimeInSeconds === 2628000 ? 'scale-110' : ''}`}
            >
              1 Mese
            </label>
          </div>
          <div className="checkbox-container-ban">
            <input
              type="radio"
              className="checkbox-btn-ban"
              id="ban-permanent"
              name="banPeriod"
              value="Permanent"
              checked={banTimeInSeconds === 0}
              onChange={() => handleBanClick(0)}
            />
            <label
              htmlFor="ban-permanent"
              className={`checkbox-label-ban checkbox-label-ban-red ${banTimeInSeconds === 'Permanent' ? 'scale-110' : ''}`}
            >
              Permanente
            </label>
          </div>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          
            <div className="mt-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                messaggio
              </label>
              <textarea
                id="banMsg"
                value={banMsg}
                onChange={(e) => setBanMsg(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-2 text-gray-950 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-700 sm:text-sm sm:leading-6 h-15 resize-none"
              />
            </div>

            <div className="mt-6 flex justify-between">
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
            </div>
        </form>
      </div>
    </div>
  );
}

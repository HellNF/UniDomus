function calculateDOBFromAge(age) {
    const currentDate = new Date(); // Get the current date and time
    currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours to the current time

    const birthYear = currentDate.getFullYear() - age; // Calculate the birth year

    // Create a new date object for the date of birth, maintaining the adjusted month, day, and time
    const dob = new Date(currentDate.setFullYear(birthYear));

    // Format the date of birth in ISO 8601 format
    return dob.toISOString();
}

/**
 * Converts seconds to a string in the format d days, hh:mm:ss.
 * @param {number} seconds - The number of seconds.
 * @returns {string} - The formatted string.
 */
function convertSecondsToDHMS(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    seconds %= 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    
    return `${String(days)} days, ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

module.exports = { calculateDOBFromAge,convertSecondsToDHMS };
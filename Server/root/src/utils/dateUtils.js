function calculateDOBFromAge(age) {
    const currentDate = new Date(); // Get the current date and time
    currentDate.setHours(currentDate.getHours() + 2); // Add 2 hours to the current time

    const birthYear = currentDate.getFullYear() - age; // Calculate the birth year

    // Create a new date object for the date of birth, maintaining the adjusted month, day, and time
    const dob = new Date(currentDate.setFullYear(birthYear));

    // Format the date of birth in ISO 8601 format
    return dob.toISOString();
}

module.exports = { calculateDOBFromAge };
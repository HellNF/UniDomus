import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { useAuth } from './../AuthContext';  // Adjust the import path as necessary

export default function EditProfileForm() {
    // State for storing form inputs
    const { userId } = useAuth();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [habits, setHabits] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Initialize state with default values to prevent undefined values
    useEffect(() => {
        setName('');
        setSurname('');
        setBirthDate(''); // Set initial value to empty string
        setHabits([]);
        setHobbies([]);
        setPhotoPreview(null);
    }, []);

    // Effect hook to fetch habits and hobbies data on component mount
    useEffect(() => {
        fetch('http://localhost:5050/api/users/tags')
            .then(response => response.json())
            .then(data => {
                setHabits(data.habits || []);
                setHobbies(data.hobbies || []);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Effect hook to fetch user data and update habits and hobbies
    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5050/api/users/${userId}`)
                .then(response => response.json())
                .then(data => {
                    const userData = data.user;
                    if (userData) {
                        setName(userData.name || '');
                        setSurname(userData.surname || '');
                        setBirthDate(userData.birthDate ? userData.birthDate.split('T')[0] : ''); // Ensure birthDate is always defined
                        setPhotoPreview(userData.proPic.length > 0 ? userData.proPic[0] : null);
                        setHabits(prevHabits => prevHabits.map(habit => ({
                            label: habit,
                            checked: userData.habits ? userData.habits.includes(habit) : false
                        })));
                        setHobbies(prevHobbies => prevHobbies.map(hobby => ({
                            label: hobby,
                            checked: userData.hobbies ? userData.hobbies.includes(hobby) : false
                        })));
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        }
    }, [userId]);

    // Define handlers for checkbox changes
    const handleHabitChange = (habit) => {
        setHabits(habits.map(h => h.label === habit.label ? { ...h, checked: !h.checked } : h));
    };

    const handleHobbyChange = (hobby) => {
        setHobbies(hobbies.map(h => h.label === hobby.label ? { ...h, checked: !h.checked } : h));
    };


    // Handle form submission
    const handleSave = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Filter selected habits and hobbies
        const selectedHabits = habits.filter((habit, index) => {
            const checkbox = document.getElementById(`habit-${index}`);
            return checkbox && checkbox.checked;
        });

        const selectedHobbies = hobbies.filter((hobby, index) => {
            const checkbox = document.getElementById(`hobby-${index}`);
            return checkbox && checkbox.checked;
        });

        // Convert photo preview to Base64
        const photoBase64 = photoPreview ? photoPreview.split(',')[1] : null; // Remove data URL prefix if photo exists

        const formData = {
            name,
            surname,
            birthDate,
            habits: selectedHabits.map(habit => habit.label),
            hobbies: selectedHobbies.map(hobby => hobby.label),
            photo: photoBase64 // Use Base64 encoded image
        };
        

        console.log(formData);

        try {
            const response = await fetch(`http://localhost:5050/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            console.log('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    // Handlers for updating state based on form inputs
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSurnameChange = (e) => {
        setSurname(e.target.value);
    };

    const handleBirthDateChange = (e) => {
        setBirthDate(e.target.value);
    };

    // Handler for photo changes
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };



    return (
        <div className='m-10'>
            <form onSubmit={handleSave}>

                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                            <div className="mt-2 flex items-center gap-x-3 col-span-full">
                                <div className="relative overflow-hidden">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Uploaded"
                                            className="h-12 w-12 rounded-full"
                                        />
                                    ) : (
                                        <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                    )}
                                    <input
                                        type="file"
                                        id="photo"
                                        name="photo"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                                <label
                                    htmlFor="photo"
                                    className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Change
                                </label>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        autoComplete="given-name"
                                        value={name}
                                        onChange={handleNameChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="surname" className="block text-sm font-medium leading-6 text-gray-900">
                                    Surname
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="surname"
                                        id="surname"
                                        autoComplete="family-name"
                                        value={surname}
                                        onChange={handleSurnameChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900">
                                    Birth Date
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="date"
                                        id="birthDate"
                                        name="birthDate"
                                        value={birthDate || ''}
                                        onChange={handleBirthDateChange}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>


                        </div>
                    </div>


                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Habits</h2>
                        <div className="mt-2 grid grid-cols-6 gap-4">
                            {habits.map((habit, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        id={`habit-${index}`}
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={habit.checked}
                                        onChange={() => {
                                            const updatedHabits = [...habits];
                                            updatedHabits[index].checked = !habit.checked;
                                            setHabits(updatedHabits);
                                        }}
                                    />
                                    <label htmlFor={`habit-${index}`} className="ml-2 block text-sm text-gray-900">{habit.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Hobbies</h2>
                        <div className="mt-2 grid grid-cols-6 gap-4">
                            {hobbies.map((hobby, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        id={`hobby-${index}`}
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        checked={hobby.checked}
                                        onChange={() => {
                                            const updatedHobbies = [...hobbies];
                                            updatedHobbies[index].checked = !hobby.checked;
                                            setHobbies(updatedHobbies);
                                        }}
                                    />
                                    <label htmlFor={`hobby-${index}`} className="ml-2 block text-sm text-gray-900">{hobby.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <button
                        type="submit"

                        className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}

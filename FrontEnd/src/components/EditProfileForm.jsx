import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import { useAuth } from './../AuthContext';  // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

export default function EditProfileForm() {
    // State for storing form inputs
    const { userId } = useAuth();
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [habits, setHabits] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);

    const navigate = useNavigate();
    
    // Initialize state with default values to prevent undefined values
    useEffect(() => {
        setName('');
        setSurname('');
        setBirthDate(''); // Set initial value to empty string
        setHabits([]);
        setHobbies([]);
        setPhotoPreviews([]);
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


    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5050/api/users/${userId}`)
                .then(response => response.json())
                .then(data => {
                    const userData = data.user;
                    console.log(userData);
                    if (userData) {
                        setName(userData.name || '');
                        setSurname(userData.surname || '');
                        setBirthDate(userData.birthDate ? userData.birthDate.split('T')[0] : ''); // Ensure birthDate is always defined

                        // Decode base64 image data and set as photoPreviews array
                        const proPicData = userData.proPic || [];
                        const imageUrls = proPicData.map(pic => `data:image/png;base64,${pic}`);
                        setPhotoPreviews(imageUrls);

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

    const handleUploadButtonClick = () => {
        // Trigger the file input element
        const fileInput = document.getElementById('file-upload');
        fileInput.click();
    };

    const handleSave = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Filter selected habits and hobbies
        const selectedHabits = habits.filter(habit => habit.checked).map(habit => habit.label);
        const selectedHobbies = hobbies.filter(hobby => hobby.checked).map(hobby => hobby.label);

        // Convert photo previews to Base64
        const photoBase64 = photoPreviews.map(preview => preview.split(',')[1]);

        const formData = {
            name,
            surname,
            birthDate,
            habits: selectedHabits,
            hobbies: selectedHobbies,
            proPic: photoBase64 // Use Base64 encoded image array
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
            navigate('/');
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

    const handlePhotoChange = (e) => {
        const files = e.target.files;
        const newPhotoPreviews = [...photoPreviews];

        // Check if adding new photos will exceed the limit of 5
        if (newPhotoPreviews.length + files.length > 5) {
            alert('You can add at most 5 photos.');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onloadend = () => {
                newPhotoPreviews.push(reader.result);
                setPhotoPreviews(newPhotoPreviews);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = (index) => {
        const newPhotoPreviews = [...photoPreviews];
        newPhotoPreviews.splice(index, 1);
        setPhotoPreviews(newPhotoPreviews);
    };


    return (
        <div className='m-10'>
            <form onSubmit={handleSave}>

                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Upload your profile pictures
                            </label>
                            <div className="mt-2 flex items-center gap-x-3 col-span-full">
                                {photoPreviews.map((preview, index) => (
                                    <div key={index} className="relative overflow-hidden">
                                        <img
                                            src={preview}
                                            alt={`Uploaded ${index + 1}`}
                                            className="h-12 w-12 squared-full"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 -mr-1 -mt-1 bg-white rounded-full p-1.5"
                                            onClick={() => handleRemovePhoto(index)}
                                        >
                                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}



                                <div className="col-span-full">
                                    <div className="text-center">



                                        <button
                                            className="relative overflow-hidden w-12 h-12 mx-auto"
                                            onClick={() => document.getElementById('file-upload').click()}
                                        >
                                            <div className="absolute inset-0 bg-white rounded-full border border-indigo-600"></div>
                                            <PhotoIcon className="mx-auto h-8 w-8 text-gray-300 absolute inset-0 m-auto" aria-hidden="true" />
                                            <div className="absolute bottom-0 right-0">
                                                <div className="relative rounded-full overflow-hidden w-6 h-6 bg-indigo-600 flex justify-center items-center">
                                                    <button
                                                        className="flex justify-center items-center text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                                        onClick={() => document.getElementById('file-upload').click()}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </button>



                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handlePhotoChange} // Add onChange handler
                                            multiple // Allow multiple file selection
                                            accept="image/*" // Restrict to image files
                                        />
                                    </div>
                                </div>


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

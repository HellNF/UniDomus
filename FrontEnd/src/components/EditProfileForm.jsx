import UniDomusLogo from "/UniDomusLogoWhite.png"
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Switch } from '@headlessui/react'
import React, { useState, useEffect } from 'react';
import { useAuth } from './../AuthContext';
import { useNavigate } from "react-router-dom";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function EditProfileForm() {
    // State for storing form inputs and edit mode
    const { userId } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [habits, setHabits] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [housingSeeker, setHousingSeeker] = useState(false)

    const navigate = useNavigate();

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

    // Effect hook to fetch user data when userId changes
    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5050/api/users/${userId}?proPic=true`)
                .then(response => response.json())
                .then(data => {
                    const userData = data.user;
                    console.log(userData);
                    if (userData) {
                        setName(userData.name || '');
                        setSurname(userData.surname || '');
                        setBirthDate(userData.birthDate ? userData.birthDate.split('T')[0] : ''); // Ensure birthDate is always defined

                        setHousingSeeker(userData.housingSeeker);

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

    const handleEditClick = () => {
        setEditMode(true);
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
            housingSeeker: housingSeeker,
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

    return (
        <form onSubmit={handleSave}>
            <div className="bg-blue-950 object-center">
                <div className="flex min-h-full flex-1 flex-col justify-center px-12 py-4 lg:px-8" >
                    <div className="space-y-6">
                        <div className="space-y-3 border-gray-900/10 py-2  flex flex-col items-center justify-center" >
                            <img
                                className="mx-auto h-28 w-auto "
                                src={UniDomusLogo}
                                alt="Unidomus"
                            />
                            <h1 className="text-4xl  font-semibold leading-7 text-white">Profilo</h1>
                        </div>

                        <div className="bg-white rounded-lg p-8 shadow-md">
                            <h2 className="text-2xl font-semibold leading-7 text-gray-900">Informazioni generali</h2>

                            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2">


                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                        Foto profilo
                                    </label>
                                    <div className="mt-2 flex items-center gap-x-3 col-span-full">
                                        {photoPreviews.map((preview, index) => (
                                            <div key={index} className="relative overflow-hidden">
                                                <img
                                                    src={preview}
                                                    alt={`Uploaded ${index + 1}`}
                                                    className={`rounded-full ${index === 0 ? 'h-32 w-32 border border-black' : 'h-12 w-12 border border-black'}`} // Adjust size based on index
                                                />
                                                <div className={`${!editMode ? 'invisible' : ''}`}>
                                                    <button
                                                        type="button"
                                                        disabled={!editMode}
                                                        className="absolute top-0 right-0 -mr-1 -mt-1 bg-white rounded-full p-1.5"
                                                        onClick={() => handleRemovePhoto(index)}
                                                    >
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="col-span-full">
                                            <div className="text-center">
                                                <button
                                                    type="button"
                                                    disabled={!editMode}
                                                    className="relative overflow-hidden w-12 h-12 mx-auto"
                                                    onClick={() => document.getElementById('file-upload').click()}
                                                >
                                                    <div className={`absolute inset-0 bg-white rounded-full border border-indigo-600 ${!editMode ? 'invisible' : ''}`}>
                                                        <PhotoIcon className="mx-auto h-8 w-8 text-gray-300 absolute inset-0 m-auto " aria-hidden="true" />
                                                        <div className="absolute bottom-0 right-0">
                                                            <div className="relative rounded-full overflow-hidden w-6 h-6 bg-indigo-600 flex justify-center items-center ">
                                                                <button
                                                                    type="button"
                                                                    disabled={!editMode}
                                                                    className="flex justify-center items-center text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                                                                    onClick={() => document.getElementById('file-upload').click()}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
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
                                </div>

                                <div div className="sm:col-span-1">
                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                        Sono in cerca di una casa
                                    </label>
                                    <div></div>
                                    <div className="mt-2 flex items-center justify-center gap-x-3 col-span-full">
                                        <Switch
                                            checked={housingSeeker}
                                            disabled={!editMode} 
                                            onChange={setHousingSeeker}
                                            className={classNames(
                                                housingSeeker ? 'bg-indigo-600' : 'bg-gray-200',
                                                'flex w-16 flex-none cursor-pointer rounded-full p-px ring-2 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300'
                                            )}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={classNames(
                                                    housingSeeker ? 'translate-x-8' : 'translate-x-0', 
                                                    'h-8 w-8 transform rounded-full bg-white shadow-sm ring-2 ring-gray-900/5 transition duration-200 ease-in-out' // Double the size of the thumb
                                                )}
                                            />
                                        </Switch>
                                    </div>

                                </div>



                                <div className="sm:col-span-1">
                                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Nome
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            autoComplete="given-name"
                                            value={name}
                                            onChange={handleNameChange}
                                            readOnly={!editMode} // Make input non-editable if not in edit mode
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="surname" className="block text-sm font-medium leading-6 text-gray-900">
                                        Cognome
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="surname"
                                            id="surname"
                                            autoComplete="family-name"
                                            value={surname}
                                            onChange={handleSurnameChange}
                                            readOnly={!editMode} // Make input non-editable if not in edit mode
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="birthDate" className="block text-sm font-medium leading-6 text-gray-900">
                                        Data di nascita
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            id="birthDate"
                                            name="birthDate"
                                            value={birthDate || ''}
                                            onChange={handleBirthDateChange}
                                            readOnly={!editMode} // Make input non-editable if not in edit mode
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-8 shadow-md">
                            <h2 className="text-2xl font-semibold leading-7 text-gray-900">Tags</h2>

                            <div className="mt-10 border-b pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Abitudini</h2>
                                <div className="mt-2 grid grid-cols-5 gap-4">
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
                                                disabled={!editMode} // Disable checkbox if not in edit mode
                                            />
                                            <label htmlFor={`habit-${index}`} className="ml-2 block text-sm text-gray-900">{habit.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Interessi</h2>
                                <div className="mt-2 grid grid-cols-5 gap-4">
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
                                                disabled={!editMode} // Disable checkbox if not in edit mode
                                            />
                                            <label htmlFor={`hobby-${index}`} className="ml-2 block text-sm text-gray-900">{hobby.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6  flex items-center justify-between">

                            {!editMode && (<>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)} // Go back to the previous page
                                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Indietro
                                </button>
                                <button
                                    onClick={handleEditClick} // Enable edit mode
                                    className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Modifica
                                </button>
                            </>)}
                            {editMode && (
                                <>

                                    <button
                                        type="button"
                                        onClick={() => window.location.reload()} // Reload the page
                                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2"
                                    >
                                        Salva
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

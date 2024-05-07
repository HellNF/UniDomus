
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

export default function EditProfileForm() {
    return (
        <div className='m-10'>
            <form>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <button
                                        type="button"
                                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    First name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="first-name"
                                        id="first-name"
                                        autoComplete="given-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Last name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="last-name"
                                        id="last-name"
                                        autoComplete="family-name"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                    About
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={3}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={''}
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                            </div>
                        </div>
                    </div>



                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Preferences</h2>
                        <div className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Interests</label>
                                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div className="flex items-center">
                                        <input
                                            id="history"
                                            name="interests"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="history" className="ml-2 block text-sm text-gray-900">History</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="science"
                                            name="interests"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="science" className="ml-2 block text-sm text-gray-900">Science</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="videogames"
                                            name="interests"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="videogames" className="ml-2 block text-sm text-gray-900">Videogames</label>
                                    </div>
                                    {/* Add more checkboxes here */}
                                </div>
                            </div>
                            <div className="sm:col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Additional Notes</label>
                                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div className="flex items-center">
                                        <input
                                            id="fitness"
                                            name="notes"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="fitness" className="ml-2 block text-sm text-gray-900">Focusing on improving fitness</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="health"
                                            name="notes"
                                            type="checkbox"
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="health" className="ml-2 block text-sm text-gray-900">Focusing on improving physical health</label>
                                    </div>
                                    {/* Add more checkboxes here */}
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </form>
        </div>
    )
}

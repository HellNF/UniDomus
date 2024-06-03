import React, { useState, useEffect, Fragment } from 'react';
import UniDomusLogo from '/UniDomusLogoWhite.png';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_BASE_URL, notificationStatusEnum } from '../constant';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Navbar({ current }) {
  const { isLoggedIn, logout, userId, isAdmin } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [publisherIDAvailable, setPublisherIDAvailable] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unseenNotifications, setUnseenNotifications] = useState(0);

  const initialNavigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'Trova un appartamento', href: '/findaflat', current: false },
    { name: 'Trova un coinquilino', href: '/findatenant', current: false },
  ];

  const [navigation, setNavigation] = useState(
    initialNavigation.map(item => ({ ...item, current: item.name === current }))
  );

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserData();
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}users/${userId}?proPic=1`);
      const data = await response.json();
      const userData = data.user;
      setPublisherIDAvailable(userData && !userData.hasOwnProperty('listingID'));
      if (userData && userData.proPic && userData.proPic.length > 0) {
        setProfilePic(`data:image/png;base64,${userData.proPic[0]}`);
      }
    } catch (error) {
      logout();
      console.error('Error fetching user data:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}notifications/user/${userId}`, {
        headers: {
          'x-access-token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setNotifications(data.notifications);
      setUnseenNotifications(data.notifications.filter(notification => notification.status === notificationStatusEnum.NOT_SEEN).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markNotificationsAsSeen = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}notifications/user/${userId}/seen`, {
        method: 'PUT',
        headers: {
          'x-access-token': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        const updatedNotifications = notifications.map(notification => ({ ...notification, status: notificationStatusEnum.SEEN }));
        setNotifications(updatedNotifications);
        setUnseenNotifications(0);
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  return (
    <Disclosure as="nav" className="bg-blue-950 fixed w-full h-16 top-0 z-50 border-b border-white items-center">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex items-center">
                  <img className="h-8 sm:h-8 md:h-10 lg:h-12" src={UniDomusLogo} alt="Your Company" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4 py-4 text-lg">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current ? 'bg-white bg-opacity-5 text-white' : 'text-blue-100 hover:bg-blue-100 hover:bg-opacity-5 hover:text-white',
                          'rounded-md px-3 py-2'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {isLoggedIn ? (
                  <>
                    <Menu as="div" className="relative ml-3 z-20">
                      <Menu.Button onClick={markNotificationsAsSeen} className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Notifiche</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        {unseenNotifications > 0 && (
                          <span className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                            {unseenNotifications}
                          </span>
                        )}
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 mb-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto">
                          {notifications && notifications.map((notification) => (
                            <Menu.Item key={notification._id}>
                              {({ active }) => (
                                <Link
                                  to={notification.link}
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  <p className="font-bold">{notification.message}</p>
                                  <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    <Menu as="div" className="relative ml-3 z-20">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={profilePic || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/editprofile"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Profilo
                              </a>
                            )}
                          </Menu.Item>
                          {publisherIDAvailable && (
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/addListing"
                                  className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                >
                                  Crea inserzione
                                </a>
                              )}
                            </Menu.Item>
                          )}
                          {
                            isAdmin && (
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    to="/reports/"
                                    className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                  >
                                    Visualizza segnalazioni
                                  </Link>
                                )}
                              </Menu.Item>
                            )
                          }
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/matches/index"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Richieste di Match
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/chat/index/"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Chats
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              >
                                Impostazioni
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link onClick={logout} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                Logout
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Link
                      to="/registration"
                      className="text-blue-100 hover:bg-blue-100 hover:bg-opacity-5 hover:text-white rounded-md px-3 py-2"
                    >
                      Registrati
                    </Link>
                    <Link
                      to="/login"
                      className="text-blue-100 hover:bg-blue-100 hover:bg-opacity-5 hover:text-white rounded-md px-3 py-2"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;

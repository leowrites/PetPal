import React, { useEffect, useState } from 'react';
import Heading from '../components/layout/Heading';
import Text from '../components/Text'
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import UserDetailService from '../services/UserDetailService';
import NotificationPreferenceService from '../services/NotificationPreferenceService';
import ShelterService from '../services/ShelterService';
import UserProfileForm from '../components/profile/UserProfileForm';
import NotificationPreferencesForm from '../components/profile/NotificationPreferencesForm';
import ShelterProfileForm from '../components/profile/ShelterProfileForm';
import { Avatar } from "@material-tailwind/react";

const ProfileUpdate = () => { 
    const { user, setUser, setToken } = useUser();
    const navigate = useNavigate();
    const [notification, setNotification] = useState('')
    const [notificationPreferences, setNotificationPreferences] = useState({})
    const [notificationUpdateNotification, setNotificationUpdateNotification] = useState('')
    const [shelter, setShelter] = useState({})
    const [shelterNotification, setShelterNotification] = useState('')
    
    const handleUserProfileSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('email', values.email);
        if (values.avatar) {
            formData.append('avatar', values.avatar);
        }

        try {
            const response = await UserDetailService.patchSelf(user.id, formData);
            setUser(response.data);
            setNotification('Profile updated successfully!');

            setTimeout(() => {
                setNotification('');
            }, 5000);
        }
        catch (error) {
            setNotification('Error with profile update');
            console.log('Error with profile update', error);

            setTimeout(() => {
                setNotification('');
            }, 5000);
        }
        finally {
            setSubmitting(false)
        }
    }

    useEffect(() => {
        const getNotificationPreferences = async () => {
            try {
                const response = await NotificationPreferenceService.get();
                setNotificationPreferences(response.data);
            }
            catch (error) {
                console.log('Error getting notification preferences', error);
            }
        }
        getNotificationPreferences();
    }, [])

    useEffect(() => {
        const getShelter = async () => {
            if (user.is_shelter) {
                try {
                    const response = await ShelterService.getById(user.shelter_id);
                    setShelter(response.data);
                }
                catch (error) {
                    console.log('Error getting shelter', error);
                }
            }
        }
        getShelter();
    }, [])

    const handleNotificationPreferenceSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await NotificationPreferenceService.patch(values);
            setNotificationPreferences(response.data);
            setNotificationUpdateNotification('Preferences updated successfully!');
            
            setTimeout(() => {
                setNotificationUpdateNotification('');
            }, 5000)
        }
        catch (error) {
            setNotificationUpdateNotification('Error updating preferences');

            setTimeout(() => {
                setNotificationUpdateNotification('');
            }, 5000);
        }
        finally {
            setSubmitting(false)
        }
    }

    const handleShelterProfileSubmit = async (values, { setSubmitting }) => {
        if (user.is_shelter) {
            try {
                const response = await ShelterService.patch(user.shelter_id, values);
                setShelter(response.data);
                setShelterNotification('Shelter information updated successfully!');

                setTimeout(() => {
                    setShelterNotification('');
                }, 5000)
            }
            catch (error) {
                setShelterNotification('Error updating shelter information');

                setTimeout(() => {
                    setShelterNotification('');
                }, 5000);
            }
            finally {
                setSubmitting(false)
            }
        }
    }

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            try {
                await UserDetailService.deleteSelf(user.id);
                setToken(null)
                navigate('/login')
                window.location.reload();
            } 
            catch (error) {
                console.log('Error deleting profile', error);
            }
        }
    }
    
    return (
        <div class="container mx-auto px-5 sm:px-5 md:px-5 lg:px-20">
            <div class="flex flex-row justify-between items-center">
                <Heading><h1 class="text-[2rem] font-semibold mb-4">Account Settings</h1></Heading>
                <Link to="/logout" className="text-white bg-[#ff9447] rounded-[20px] px-[1rem] py-[.5rem] font-semibold">Logout</Link>
            </div>
            <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-6 rounded pt-4 lg:w-3/4">
                    <Heading>Edit Profile</Heading>
                    {user.avatar == null ? (
                        null 
                    ) : (
                        <Avatar src={user.avatar == null ? null : user.avatar} alt={user.username} size="xl" />
                    )}
                    <UserProfileForm
                        user={user}
                        onSubmit={handleUserProfileSubmit}
                        notification={notification}
                    />
                    <Text className=''><Link to='/profile/password/change' className='text-[#290005] underline'>Change Password</Link></Text>
                    <p className='mt-2 text-md text-[#290005] underline cursor-pointer' onClick={handleDeleteProfile}>Delete Profile</p>
                    <div className='mt-12'>
                        <Heading>Notification Preferences</Heading>
                        <NotificationPreferencesForm
                            user={user}
                            initialValues={notificationPreferences}
                            onSubmit={handleNotificationPreferenceSubmit}
                            notification={notificationUpdateNotification}
                        />
                    </div>
                </div>
                <div class="bg-white p-6 rounded pt-4 lg:w-3/4">
                    {user.is_shelter ? (
                        <>
                            <Heading>Edit Shelter Profile</Heading>
                            <ShelterProfileForm
                                shelter={shelter}
                                onSubmit={handleShelterProfileSubmit}
                                notification={shelterNotification}
                            />
                        </>
                    ) : (
                        null
                    )}
                </div>
            </div>
        </div>
    )
 };

 export default ProfileUpdate;
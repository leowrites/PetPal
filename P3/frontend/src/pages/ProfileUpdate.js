import React, { useEffect, useState } from 'react';
import Heading from '../components/layout/Heading';
import { Form, Formik, Field } from 'formik';
import TextInput from '../components/inputs/TextInput';
import Text from '../components/Text'
import Button from '../components/inputs/Button'
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import UserDetailService from '../services/UserDetailService';
import NotificationPreferenceService from '../services/NotificationPreferenceService';
import { Checkbox } from "@material-tailwind/react";

const ProfileUpdate = () => { 
    const { user, setUser } = useUser();
    const [notification, setNotification] = useState('')
    const [notificationPreferences, setNotificationPreferences] = useState({})
    const [notificationUpdateNotification, setNotificationUpdateNotification] = useState('')
    
    const handleUserProfileSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await UserDetailService.patchSelf(user.id, values);
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
    
    return (
        <div class="container mx-auto px-5 sm:px-5 md:px-5 lg:px-20">
            <div class="flex flex-row justify-between items-center">
                <Heading><h1 class="text-[2rem] font-semibold mb-4">Account Settings</h1></Heading>
                <Link to="/logout" className="text-white bg-[#ff9447] rounded-[20px] px-[1rem] py-[.5rem] font-semibold">Logout</Link>
            </div>
            <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-6 rounded pt-4 lg:w-3/4">
                    <Heading>Edit Profile</Heading>
                    <Formik
                        initialValues={{
                            username: user.username,
                            email: user.email,
                        }}
                        onSubmit={handleUserProfileSubmit}
                        enableReinitialize>
                        {({ isSubmitting, errors, isValid }) => (
                            <Form>
                                <div className="flex flex-col justify-start items-start w-full mb-4">
                                    {notification && <Text color='text-[#ff9447]'>{notification}</Text>}

                                    <label for="username" class="mt-3 block font-semibold">Username</label>
                                    <TextInput 
                                        id='username' 
                                        name='username' 
                                        placeholder='Username' 
                                        className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]' 
                                        validate={(value) => {
                                            if (!value) {
                                                return 'This field is required'
                                            }}
                                        }/>
                                    {errors.username && <Text color='text-red-500'>{errors.username}</Text>}
                                    
                                    <label for="Email" class="mt-6 block font-semibold">Email</label>
                                    <TextInput
                                        id='email'
                                        name='email'
                                        placeholder='Email'
                                        className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]'
                                        validate={(value) => {
                                            if (!value) {
                                                return 'This field is required'
                                            }
                                            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                                return 'Invalid email';
                                            }
                                    }}/>
                                    {errors.email && <Text color='text-red-500'>{errors.email}</Text>}

                                    <Button className='mt-6' type='submit' disabled={isSubmitting || !isValid}>Submit</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    <Text className=''><Link to='/' className='text-[#290005] underline'>Change Password</Link></Text>
                    <div className='mt-12'>
                        <Heading>Notification Preferences</Heading>
                        <Formik
                            initialValues={notificationPreferences}
                            onSubmit={handleNotificationPreferenceSubmit}
                            enableReinitialize>
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mt-3 flex flex-col justify-start items-start w-full">
                                        {notificationUpdateNotification && <Text color='text-[#ff9447]'>{notificationUpdateNotification}</Text>}
                                        {user.is_shelter ? (
                                            <>
                                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                                    <Field type="checkbox" name="application_message" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                                    Application Messages
                                                </label>
                                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                                    <Field type="checkbox" name="application_status_change" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                                    Application Status Changes
                                                </label>
                                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                                    <Field type="checkbox" name="review" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                                    New Reviews
                                                </label>
                                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                                    <Field type="checkbox" name="application" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                                    New Applications
                                                </label>
                                            </>
                                        ) : (
                                            <>
                                                <label className="mt-2 flex items-center font-medium text-lg mb-2">
                                                    <Field type="checkbox" name="application_message" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                                    Application Messages
                                                </label>
                                                <label className="flex items-center font-medium text-lg mb-2">
                                                    <Field type="checkbox" name="application_status_change" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                                    Application Status Changes
                                                </label>
                                                <label className="flex items-center font-medium text-lg mb-2">
                                                    <Field type="checkbox" name="pet_listing" className="mr-2 w-5 h-5 border border-[#290005] bg-[#FFF8F4] rounded-md"/>
                                                    New Pet Listings
                                                </label>
                                            </>
                                        )}
                                        <Button className='mt-6' type='submit' disabled={isSubmitting}>Submit</Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div class="bg-white p-6 rounded pt-4 lg:w-3/4">
                    {/* show shelter profile if applicable, else nothing */}
                </div>
            </div>
        </div>
    )
 };

 export default ProfileUpdate;
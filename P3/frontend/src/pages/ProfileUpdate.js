import React, { useEffect, useState } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/layout/Heading';
import { Form, Formik, Field } from 'formik';
import TextInput from '../components/inputs/TextInput';
import Text from '../components/Text'
import Button from '../components/inputs/Button'
import { useUser } from '../contexts/UserContext';
import UserDetailService from '../services/UserDetailService';

const ProfileUpdate = () => { 
    const { user, setUser } = useUser();
    const [formError, setFormError] = useState('')
    const [notification, setNotification] = useState('')

    const handleSubmit = async (values, { setSubmitting, errors }) => {
        if (!user) {
            setFormError('');
            setNotification('');
            setSubmitting(false);
            return;
        }
        try {
            const response = await UserDetailService.patchSelf(user.id, values);
            setUser(response.data);
            setNotification('Profile updated successfully!');
            setFormError('');

            setTimeout(() => {
                setNotification('');
            }, 5000);
        }
        catch (error) {
            setFormError('Error with profile update');
            setNotification('');
            console.log('Error with profile update', error);
        }
        finally {
            setSubmitting(false)
        }
    }
    
    return (
        <div class="container mx-auto px-5 sm:px-5 md:px-5 lg:px-20">
            <Heading><h1 class="text-[2rem] font-semibold mb-4">Account Settings</h1></Heading>
            <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-6 rounded pt-4 lg:w-3/4">
                    <Heading>Edit Profile</Heading>
                    <Formik
                        initialValues={{
                            username: user.username,
                            email: user.email,
                        }}
                        onSubmit={handleSubmit}
                        enableReinitialize>
                        {({ isSubmitting, errors, isValid }) => (
                            <Form>
                                <div className="flex flex-col justify-start items-start w-full mb-4">
                                    {formError && <Text color='text-red-500'>{formError}</Text>}
                                    {notification && <Text color='text-green-500'>{notification}</Text>}

                                    <TextInput 
                                        id='username' 
                                        name='username' 
                                        placeholder='Username' 
                                        className='lg:w-[22rem] w-[18rem] mt-2 border-2 border-[#290005] bg-[#FFF8F4]' 
                                        validate={(value) => {
                                            if (!value) {
                                                return 'This field is required'
                                            }}
                                        }/>
                                    {errors.username && <Text color='text-red-500'>{errors.username}</Text>}

                                    <TextInput
                                    id='email'
                                    name='email'
                                    placeholder='Email'
                                    className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4] mt-6'
                                    validate={(value) => {
                                        if (!value) {
                                            return 'This field is required'
                                        }
                                        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                            return 'Invalid email';
                                        }
                                    }}
                                />
                                    {errors.email && <Text color='text-red-500'>{errors.email}</Text>}
                                    <Button className='mt-6' type='submit' disabled={isSubmitting || !isValid}>Submit</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    {/* TODO: Add change password page
                    <Text><Link to='/' className='text-[#ff9447] underline'>Change Password</Link></Text> */}


                    {/* {isShelter ? <>text shows up if sheleter</> : null} */}
                </div>
                <div class="bg-white p-6 rounded pt-4 lg:w-3/4">
                    <Heading>Notification Preferences</Heading>
                </div>
            </div>
        </div>
    )
 };

 export default ProfileUpdate;
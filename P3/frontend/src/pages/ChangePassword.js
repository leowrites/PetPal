import React, { useEffect, useState } from 'react';
import Heading from '../components/layout/Heading';
import { useUser } from '../contexts/UserContext';
import UserDetailService from '../services/UserDetailService';
import PasswordChangeForm from '../components/profile/PasswordChangeForm';
import Page from '../components/layout/Page';

const ChangePassword = () => {
    const { user, setUser } = useUser();
    const [notification, setNotification] = useState('');
    
    const handlePasswordChange = async (values, { setSubmitting }) => {
        if (values.password != values.password2) {
            setSubmitting(false);
            return;
        }
        try {
            await UserDetailService.changePassword(values);
            setNotification('Password changed successfully!');

            setTimeout(() => {
                setNotification('');
            }, 5000);
        }
        catch (error) {
            setNotification('Error with password change');

            setTimeout(() => {
                setNotification('');
            }, 5000);
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <Page>
            <Heading><h1 class="text-[2rem] font-semibold mb-4">Change Password</h1></Heading>
            <PasswordChangeForm
                user={user}
                onSubmit={handlePasswordChange}
                notification={notification}
            />
        </Page>
    )
}

export default ChangePassword;
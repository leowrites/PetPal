import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Logout = () => {
    const navigate = useNavigate();
    const { setToken } = useUser()

    useEffect(() => {
        setToken(null)
        navigate('/login')
        window.location.reload();
    }, [])

    return (
        <></>
    );
};

export default Logout;
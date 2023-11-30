import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Logout = () => {
    const navigate = useNavigate();

    const { setUser } = React.useContext(UserContext);

    useEffect(() => {
        localStorage.removeItem('token')
        setUser(null)
        navigate('/login')
        window.location.reload();
    }, [navigate, setUser])

    return (
        <></>
    );
};

export default Logout;
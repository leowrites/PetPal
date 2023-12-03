import React, { useEffect, useState } from 'react';
import Heading from '../components/layout/Heading';
import { Form, Formik, Field } from 'formik';
import TextInput from '../components/inputs/TextInput';
import Text from '../components/Text'
import Button from '../components/inputs/Button'
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import UserDetailService from '../services/UserDetailService';

const ChangePassword = () => {
    return (
        <h1>password change</h1>
    )
}

export default ChangePassword;
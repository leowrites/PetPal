
import React, { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/layout/Heading';
import { Form, Formik } from 'formik';
import TextInput from '../components/inputs/TextInput';
import Button from '../components/inputs/Button'
import Text from '../components/Text'
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [isShelter, setIsShelter] = useState(false);
    const [formError, setFormError] = useState('')

    useEffect(() => {
        // TODO: replace with check using context
        if (localStorage.getItem("token")) {
            navigate('/')
        }
    }, [navigate])

    return (
        <div className='flex items-center justify-center'>
            <Container className={'flex items-center justify-center flex-col w-[60%]'}>
                <Heading>Welcome to Pet Pal!</Heading>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                        password2: '',
                        isShelter: false,
                        email: '',
                        shelterName: '',
                        contactEmail: '',
                        location: '',
                        missionStatement: '',
                    }}
                    onSubmit={async (values) => {
                        if (isShelter) {
                            await AuthService.signupShelter(values.username, values.password, values.email, values.shelterName, values.contactEmail, values.location, values.missionStatement)
                                .then(() => {
                                    navigate('/login')
                                })
                                .catch((err) => {
                                    setFormError('Could not sign up')
                                })
                        } else {
                            await AuthService.signup(values.username, values.password, values.email)
                                .then(() => {
                                    navigate('/login')
                                })
                                .catch((err) => {
                                    setFormError('Could not sign up')
                                })
                        }
                    }}
                >
                    {({errors, values}) => (
                        <Form>
                            <div className="flex flex-col justify-center items-center w-full mb-4 gap-4 mt-4">
                                {formError && <Text color='text-red-500'>{formError}</Text>}

                                <div className='flex flex-row gap-4'>
                                    <label htmlFor="isShelter">Are you a shelter?</label>
                                    <input type="checkbox" id="isShelter" name="isShelter" value="isShelter" onChange={() => {
                                        setIsShelter(!isShelter);
                                    }} />
                                </div>

                                <TextInput
                                    id='username'
                                    name='username'
                                    placeholder='Username'
                                    className='w-[20rem]'
                                    validate={(value) => {
                                        if (!value) {
                                            return 'This field is required'
                                        }
                                    }}
                                />
                                {errors.username && <Text color='text-red-500'>{errors.username}</Text>}

                                <TextInput
                                    id='password'
                                    name='password'
                                    placeholder='Password'
                                    type='password'
                                    className='w-[20rem]'
                                    validate={(value) => {
                                        if (!value) {
                                            return 'This field is required'
                                        }
                                    }}
                                />
                                {errors.password && <Text color='text-red-500'>{errors.password}</Text>}

                                <TextInput
                                    id='password2'
                                    name='password2'
                                    placeholder='Confirm Password'
                                    type='password'
                                    className='w-[20rem]'
                                    validate={(value) => {
                                        if (!value) {
                                            return 'This field is required'
                                        } else if (value !== values.password) {
                                            return 'Passwords do not match'
                                        }
                                    }}
                                />
                                {errors.password2 && <Text color='text-red-500'>{errors.password2}</Text>}

                                <TextInput
                                    id='email'
                                    name='email'
                                    placeholder='Email'
                                    className='w-[20rem]'
                                    validate={(value) => {
                                        if (!value) {
                                            return 'This field is required'
                                        }
                                    }}
                                />
                                {errors.email && <Text color='text-red-500'>{errors.email}</Text>}

                                {
                                    isShelter && (
                                        <>
                                            <TextInput
                                                id='shelterName'
                                                name='shelterName'
                                                placeholder='Shelter Name'
                                                className='w-[20rem]'
                                                validate={(value) => {
                                                    if (isShelter && !value) {
                                                        return 'This field is required'
                                                    }
                                                }}
                                            />
                                            {errors.shelterName && <Text color='text-red-500'>{errors.shelterName}</Text>}
            
                                            <TextInput
                                                id='contactEmail'
                                                name='contactEmail'
                                                placeholder='Contact Email'
                                                className='w-[20rem]'
                                                validate={(value) => {
                                                    if (isShelter && !value) {
                                                        return 'This field is required'
                                                    }
                                                }}
                                            />
                                            {errors.contactEmail && <Text color='text-red-500'>{errors.contactEmail}</Text>}
            
                                            <TextInput
                                                id='location'
                                                name='location'
                                                placeholder='Location'
                                                className='w-[20rem]'
                                                validate={(value) => {
                                                    if (isShelter && !value) {
                                                        return 'This field is required'
                                                    }
                                                }}
                                            />
                                            {errors.location && <Text color='text-red-500'>{errors.location}</Text>}
            
                                            <TextInput
                                                id='missionStatement'
                                                name='missionStatement'
                                                placeholder='Mission Statement'
                                                className='w-[20rem]'
                                                validate={(value) => {
                                                    if (isShelter && !value) {
                                                        return 'This field is required'
                                                    }
                                                }}
                                            />
                                            {errors.missionStatement && <Text color='text-red-500'>{errors.missionStatement}</Text>}
                                        </>
                                    )
                                }


                                <Button type='submit'>Create account</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <Text>Already have an account? <Link to='/login' className='text-[#ff9447] underline'>Sign in</Link></Text>
            </Container>
        </div>
    );
};

export default Signup;
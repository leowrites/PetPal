import React, { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/layout/Heading';
import { Form, Formik } from 'formik';
import TextInput from '../components/inputs/TextInput';
import Button from '../components/inputs/Button'
import Text from '../components/Text'
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Page from '../components/layout/Page';

const Login = () => {
    const navigate = useNavigate();
    const [formError, setFormError] = useState('')
    const { user, setToken } = useUser();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user]);

    const onSubmit = ({ username, password }) => {
        AuthService.login(username, password)
            .then((res) => {
                setToken(res.access)
                navigate('/')
            })
            .catch((err) => {
                setFormError('Username or password incorrect')
            })
    }

    return (
        <Page>
            <div className='flex items-center justify-center'>
                <Container className={'flex items-center justify-center flex-col w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2'}>
                    <Heading><h1 class="text-[2rem] mb-4">Welcome to Pet Pal!</h1></Heading>
                    <Formik
                        initialValues={{
                            username: '',
                            password: '',
                        }}
                        onSubmit={onSubmit}
                    >
                        <Form>
                            <div className="flex flex-col justify-center items-center w-full mb-4">
                                {formError && <Text color='text-red-500'>{formError}</Text>}

                                <TextInput id='username' name='username' placeholder='Username' className='lg:w-[22rem] w-[18rem] mb-6 mt-2 border-2 border-[#290005] bg-[#FFF8F4]' />

                                <TextInput id='password' name='password' placeholder='Password' type='password' className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]' />

                                <Button className='mt-6' type='submit'>Sign in</Button>
                            </div>
                        </Form>
                    </Formik>
                    <Text>Don't have an account? <Link to='/signup' className='text-[#ff9447] underline'>Create account</Link></Text>
                </Container>
            </div>
        </Page>
    );
};

export default Login;
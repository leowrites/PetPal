import React, { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/layout/Heading';
import { Form, Formik } from 'formik';
import TextInput from '../components/inputs/TextInput';
import Button from '../components/inputs/Button'
import Text from '../components/Text'
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [formError, setFormError] = useState('')
    const { setUser } = React.useContext(UserContext);

    useEffect(() => {
      // TODO: replace with check using context
      if (localStorage.getItem("token")) {
        navigate("/");
      }
    }, [navigate]);

    return (
        <div className='flex items-center justify-center'>
            <Container className={'flex items-center justify-center flex-col w-[60%]'}>
                <Heading>Welcome to Pet Pal!</Heading>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',   
                    }}
                    onSubmit={async (values) => {
                        await AuthService.login(values.username, values.password)
                            .then((user) => {
                                setUser(user)
                                navigate('/')
                            })
                            .catch((err) => {
                                setFormError('Username or password incorrect')
                            })
                    }}
                >
                    <Form>
                        <div className="flex flex-col justify-center items-center w-full mb-4">
                            {formError && <Text color='text-red-500'>{formError}</Text>}

                            <TextInput id='username' name='username' placeholder='Username' className='w-[20rem] mb-6 mt-2' />

                            <TextInput id='password' name='password' placeholder='Password' type='password' className='w-[20rem]'/>

                            <Button type='submit'>Sign in</Button>
                        </div>
                    </Form>
                </Formik>
                <Text>Don't have an account? <Link to='/signup' className='text-[#ff9447] underline'>Create account</Link></Text>
            </Container>
        </div>
    );
};

export default Login;
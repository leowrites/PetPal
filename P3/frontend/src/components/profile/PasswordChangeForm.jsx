import { Form, Formik } from 'formik';
import TextInput from '../inputs/TextInput';
import Text from '../Text'
import Button from '../inputs/Button'

export default function PasswordChangeForm({ onSubmit, notification, errors}) {
    return (
        <Formik
            initialValues = {{
                password: '',
                password2: ''
            }}
            onSubmit={onSubmit}
            enableReinitialize>
            {({ isSubmitting, errors, values, isValid }) => (
                <Form>
                    <div className="flex flex-col justify-start items-start w-full mb-4">
                        {notification && <Text color='text-[#ff9447]'>{notification}</Text>}

                        <label for="password" class="mt-3 block font-semibold">New Password</label>
                        <TextInput 
                            id='password' 
                            name='password'
                            type='password' 
                            placeholder='New Password' 
                            className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]' 
                            validate={(value) => {
                                if (!value) {
                                    return 'This field is required'
                                }}
                            }/>
                        {errors.password && <Text color='text-red-500'>{errors.PasswordChangeForm}</Text>}
                        
                        <label for="password2" class="mt-6 block font-semibold">Confirm New Password</label>
                        <TextInput
                            id='password2'
                            name='password2'
                            type='password'
                            placeholder='Confirm New Password'
                            className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]'
                            validate={(value) => {
                                if (!value) {
                                    return 'This field is required'
                                } else if (value !== values.password) {
                                    return 'Passwords do not match'
                                }
                            }
                        }/>
                        {errors.password2 && <Text color='text-red-500'>{errors.password2}</Text>}

                        <Button className='mt-6' type='submit' disabled={isSubmitting || !isValid}>Submit</Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
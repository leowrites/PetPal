import { Form, Formik } from 'formik';
import TextInput from '../inputs/TextInput';
import Text from '../Text'
import Button from '../inputs/Button'
import { useFormikContext } from 'formik';

const UserProfileForm = ({ user, onSubmit, notification, errors }) => {

    const { setFieldValue } = useFormikContext() ?? {};

    return (
        <Formik
            initialValues={{
                avatar: user.avatar,
                username: user.username,
                email: user.email,
            }}
            onSubmit={onSubmit}
            enableReinitialize>
            {({ isSubmitting, errors, isValid, setFieldValue }) => (
                <Form>
                    <div className="flex flex-col justify-start items-start w-full mb-4">
                        {notification && <Text color='text-[#ff9447]'>{notification}</Text>}
                
                        <label for="avatar" class="mt-3 block font-semibold">Avatar</label>
                        <input 
                            name="avatar" 
                            type="file" 
                            onChange={(event) => {
                                setFieldValue("avatar", event.currentTarget.files[0]);
                            }}
                            accept="image/*"
                            className="w-full file:mr-2 file:py-1 file:px-2
                            file:border-0 file:text-sm file:font-semibold
                            file:bg-[#290005] file:text-white hover:file:bg-[#ff9447] file:cursor-pointer"/>

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
    )
}

export default UserProfileForm;
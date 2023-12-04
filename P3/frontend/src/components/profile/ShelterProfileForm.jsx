import { Form, Formik } from 'formik';
import TextInput from '../inputs/TextInput';
import Text from '../Text';
import Button from '../inputs/Button'

export default function ShelterProfileForm({ shelter, onSubmit, notification }) {
    return (
        <Formik
            initialValues={{
                shelter_name: shelter.shelter_name,
                contact_email: shelter.contact_email,
                location: shelter.location,
                mission_statement: shelter.mission_statement
            }}
            onSubmit={onSubmit}
            enableReinitialize>
            {({ isSubmitting, errors, isValid }) => (
                <Form>
                    <div className="flex flex-col justify-start items-start w-full mb-4">
                        {notification && <Text color='text-[#ff9447]'>{notification}</Text>}

                        <label for="shelter_name" class="mt-3 block font-semibold">Shelter Name</label>
                        <TextInput 
                            id='shelter_name' 
                            name='shelter_name' 
                            placeholder='Shelter Name' 
                            className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]' 
                            validate={(value) => {
                                if (!value) {
                                    return 'This field is required'
                                }}
                            }/>
                        {errors.shelter_name && <Text color='text-red-500'>{errors.shelter_name}</Text>}
                        
                        <label for="contact_email" class="mt-6 block font-semibold">Contact Email</label>
                        <TextInput
                            id='contact_email'
                            name='contact_email'
                            placeholder='Contact Email'
                            className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]'
                            validate={(value) => {
                                if (!value) {
                                    return 'This field is required'
                                }
                                else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                    return 'Invalid email';
                                }
                        }}/>
                        {errors.contact_email && <Text color='text-red-500'>{errors.contact_email}</Text>}

                        <label for="location" class="mt-6 block font-semibold">Location</label>
                        <TextInput
                            id='location'
                            name='location'
                            placeholder='Location'
                            className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]'
                            validate={(value) => {
                                if (!value) {
                                    return 'This field is required'
                                }
                        }}/>
                        {errors.location && <Text color='text-red-500'>{errors.location}</Text>}

                        <label for="mission_statement" class="mt-6 block font-semibold">Mission Statement</label>
                        <TextInput
                            id='mission_statement'
                            name='mission_statement'
                            placeholder='Mission Statement'
                            className='lg:w-[22rem] w-[18rem] border-2 border-[#290005] bg-[#FFF8F4]'
                            validate={(value) => {
                                if (!value) {
                                    return 'This field is required'
                                }
                        }}/>
                        {errors.mission_statement && <Text color='text-red-500'>{errors.mission_statement}</Text>}

                        <Button className='mt-6' type='submit' disabled={isSubmitting || !isValid}>Submit</Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
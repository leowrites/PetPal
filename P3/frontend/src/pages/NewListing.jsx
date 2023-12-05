import React, { useState } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/layout/Heading';
import TextInput from '../components/inputs/TextInput';
import Text from '../components/Text';
import { Formik, Form } from 'formik';
import Button from '../components/inputs/Button';
import PetListingService from '../services/PetListingService';
import { useUser } from '../contexts/UserContext';

const NewListing = () => {
    const { user } = useUser();
    const [imageUrl, setImageUrl] = useState('');
    const fields = [
        {
            name: 'name',
            displayName: 'Name',
            inputType: 'text',
            colSpan: 1,
            required: true,
        },
        {
            name: 'age',
            displayName: 'Age',
            inputType: 'number',
            min: 0,
            max: 20,
            colSpan: 1,
            required: true,
        },
        {
            name: 'breed',
            displayName: 'Breed',
            inputType: 'text',
            colSpan: 2,
            required: true,
        },
        {
            name: 'about',
            displayName: 'About',
            inputType: 'textarea',
            colSpan: 2,
            required: true,
        },
        {
            name: 'medicalHistory',
            displayName: 'Medical History',
            inputType: 'textarea',
            colSpan: 2,
            required: true,
        },
        {
            name: 'behavior',
            displayName: 'Behavior',
            inputType: 'textarea',
            colSpan: 2,
            required: true,
        },
        {
            name: 'other',
            displayName: 'Other',
            inputType: 'textarea',
            colSpan: 2,
            required: true,
        }
    ]

    return (
        <Container>
            <Heading>Add a New Pet</Heading>
            <Formik
                initialValues={{
                    name: '',
                    age: '',
                    breed: '',
                    about: '',
                    medicalHistory: '',
                    behavior: '',
                    other: '',
                    image: null,
                }}
                onSubmit={async (values, { setFieldError }) => {
                    if (user.is_shelter) {
                        const formData = new FormData();
                        formData.append('name', values.name);
                        formData.append('age', values.age);
                        formData.append('breed', values.breed);
                        formData.append('bio', values.about);
                        formData.append('medical_history', values.medicalHistory);
                        formData.append('behavior', values.behavior);
                        formData.append('other_notes', values.other);
                        formData.append('image', values.image);

                        await PetListingService.create(
                            user.shelter_id,
                            formData
                        ).then((res) => {
                            window.location.href = `/listings/${res.data.id}`
                        }).catch((err) => {
                            if (err.response && err.response.data) {
                                Object.keys(err.response.data).forEach((key) => {
                                    setFieldError(key, err.response.data[key][0]);
                                });
                            }
                        })
                    }
                    }}
            >
                {({errors, setFieldValue, values}) => {
                    const handleImageChange = (event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setImageUrl(reader.result);  // Set the image URL for preview
                                setFieldValue("image", file);  // Update Formik state
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                    return (
                        <Form>
                            <div class="grid grid-cols-2 gap-6 my-6">
                                <div className="flex flex-col col-span-2">
                                    <div className="col-span-2 flex justify-start relative w-64 h-50">
                                        {
                                            imageUrl ? (
                                                <img src={imageUrl} alt=""
                                                    class="w-64 h-50 object-cover pet-photo rounded-xl aspect-square" />
                                            ) : (
                                                <div class="w-64 h-50 object-cover pet-photo rounded-xl aspect-square" />
                                            )
                                        }
                                        <label htmlFor="image"
                                            class="absolute right-3 bottom-3 cursor-pointer bg-white border-2 border-black px-3 rounded-xl">
                                            Upload picture
                                        </label>
                                        <input
                                            className="hidden w-full h-full cursor-pointer"
                                            id="image"
                                            name="image"
                                            type="file"
                                            onChange={handleImageChange}
                                            accept='image/*'
                                        />
                                    </div>
                                    {errors['image'] && <Text color='text-red-500'>{errors['image']}</Text>}
                                </div>
                                {
                                    fields.map(field => (
                                        <div className={`col-span-${field.colSpan} flex flex-col`} key={field.name}>
                                            <label htmlFor={field.name}>{field.displayName}</label>
                                            <TextInput
                                                id={field.name}
                                                name={field.name}
                                                placeholder={field.displayName}
                                                className='w-full'
                                                type={field.inputType}
                                                min = {field.min}
                                                max = {field.max}
                                                validate={(value) => {
                                                    if (!value && field.required) {
                                                        return 'This field is required'
                                                    }
                                                }}
                                            />
                                            {errors[field.name] && <Text color='text-red-500'>{errors[field.name]}</Text>}
                                        </div>
                                    ))
                                }
                                <div className='col-span-2 flex justify-start'>
                                    <Button className='px-8' type="submit">Create</Button>
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </Container>
    );
};

export default NewListing;
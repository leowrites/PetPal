import React, { useState } from 'react';
import Container from '../../components/layout/Container';
import Heading from '../../components/layout/Heading';
import TextInput from '../../components/inputs/TextInput';
import Text from '../../components/Text';
import { Formik, Form } from 'formik';
import Button from '../../components/inputs/Button';
import PetListingService from '../../services/PetListingService';
import { useUser } from '../../contexts/UserContext';
import Page from '../../components/layout/Page';

const NewListing = () => {
    const { user } = useUser();
    const [imageUrls, setImageUrls] = useState([null, null, null]);
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
        <Page>
            <div className='flex items-center justify-center w-full'>
                <Container className="sm:w-full md:w-4/5">
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
                            images: [null, null, null]
                        }}
                        onSubmit={async (values, { setFieldError, setSubmitting }) => {
                            setSubmitting(true);
                            if (user.is_shelter) {
                                let isValidImages = true;
                                for (let i = 0; i < values.images.length; i++) {
                                    if (values.images[i]) {
                                        if (values.images[i].size > 10485760) {
                                            isValidImages = false;
                                            setFieldError(`image${i > 0 ? i+1 : ''}`, 'Image size must be less than 10MB');
                                        }
                                    } else {
                                        isValidImages = false;
                                        setFieldError(`image${i > 0 ? i+1 : ''}`, 'Please upload at least one image');
                                    
                                    }
                                }
                                if (!isValidImages) {
                                    setSubmitting(false);
                                    return;
                                }
                                const formData = new FormData();
                                formData.append('name', values.name);
                                formData.append('age', values.age);
                                formData.append('breed', values.breed);
                                formData.append('bio', values.about);
                                formData.append('medical_history', values.medicalHistory);
                                formData.append('behavior', values.behavior);
                                formData.append('other_notes', values.other);
                                formData.append('image', values.images[0]);
                                formData.append('image2', values.images[1]);
                                formData.append('image3', values.images[2]);

                                await PetListingService.create(
                                    user.shelter_id,
                                    formData
                                ).then((res) => {
                                    setSubmitting(false);
                                    window.location.href = `/listings/${res.data.id}`
                                }).catch((err) => {
                                    if (err.response && err.response.data) {
                                        Object.keys(err.response.data).forEach((key) => {
                                            let errMessage = err.response.data[key][0];
                                            if (['image', 'image2', 'image3'].includes(key)) {
                                                errMessage = 'Please upload at least one image';
                                            }
                                            setFieldError(key, errMessage);
                                        });
                                    }
                                    setSubmitting(false);
                                })
                            }
                            }}
                    >
                        {({errors, setFieldValue, values, isSubmitting}) => {
                            const handleImageChange = (event, i) => {
                                const file = event.currentTarget.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        let newImageUrls = imageUrls;
                                        newImageUrls[i] = reader.result;
                                        setImageUrls(newImageUrls);

                                        let newImages = values.images;
                                        newImages[i] = file;
                                        setFieldValue("images", newImages);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }

                            return (
                                <Form>
                                    <div class="grid grid-cols-2 gap-6 my-6">
                                        <div className="flex flex-col col-span-2">
                                            <div className="col-span-2 flex justify-start relative gap-2">
                                                {
                                                    imageUrls.map((imageUrl, i) => (
                                                        <div className='flex flex-col' key={i}>
                                                            <div className='relative'>
                                                                {
                                                                    imageUrl ? (
                                                                        <img src={imageUrls[i]} alt="" class="w-64 h-50 object-cover pet-photo rounded-xl aspect-square" />
                                                                    ) : (
                                                                        <img class="w-64 h-50 pet-photo rounded-xl aspect-square" alt='' />
                                                                    )
                                                                }
                                                                <label htmlFor={`image-${i}`}
                                                                    class="absolute right-2 left-2 md:left-auto bottom-2 cursor-pointer bg-white border-2 border-black px-2 rounded-xl text-sm sm:text-base">
                                                                    Upload picture
                                                                </label>
                                                                <input
                                                                    className="hidden w-full h-full cursor-pointer"
                                                                    id={`image-${i}`}
                                                                    name={`image-${i}`}
                                                                    type="file"
                                                                    onChange={(e) => handleImageChange(e, i)}
                                                                    accept='image/*'
                                                                />
                                                            </div>
                                                            {errors[`image${i > 0 ? i+1 : ''}`] && <Text color='text-red-500 text-sm px-2'>{errors[`image${(i > 0 ? i + 1 : '')}`]}</Text>}
                                                        </div>
                                                    ))
                                                }
                                            </div>
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
                                                        min={field.min}
                                                        max={field.max}
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
                                            <Button className='px-8' type="submit" disabled={isSubmitting}>Create</Button>
                                        </div>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </Container>
            </div>
        </Page>
    );
};

export default NewListing;
import React, { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/layout/Heading';
import TextInput from '../components/inputs/TextInput';
import Text from '../components/Text';
import { Formik, Form } from 'formik';
import Button from '../components/inputs/Button';
import PetListingService from '../services/PetListingService';
import PetDetailService from '../services/PetDetailService';
import { useUser } from '../contexts/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import SelectInput from '../components/inputs/SelectInput';

const EditListing = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [imageUrl, setImageUrl] = useState('');
    const [initialValues, setInitialValues] = useState({
        status: '',
        name: '',
        age: '',
        breed: '',
        about: '',
        medicalHistory: '',
        behavior: '',
        other: '',
        image: null,
    });
    const { listingId } = useParams();
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

    useEffect(() => {
        if (listingId) {
            PetDetailService.get(listingId).then((response) => {
                const listing = response.data;
                if (listing.shelter.owner !== user.id) {
                   navigate(`/listings/${listingId}`); 
                }
                fetch(listing.image)
                .then(async response => {
                    const contentType = response.headers.get('content-type')
                    const blob = await response.blob()
                    const file = new File([blob], listing.image, { contentType })
                    setInitialValues({
                        status: listing.status,
                        name: listing.name,
                        age: listing.age,
                        breed: listing.breed,
                        about: listing.bio,
                        medicalHistory: listing.medical_history,
                        behavior: listing.behavior,
                        other: listing.other_notes,
                        image: file,
                    });
                })
                setImageUrl(listing.image);
            })
        }
    }, [listingId])

    return (
        <Container>
            <Heading>Edit Pet Listing</Heading>
            <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={async (values, { setFieldError }) => {
                    if (user.is_shelter) {
                        const formData = new FormData();
                        formData.append('status', values.status);
                        formData.append('name', values.name);
                        formData.append('age', values.age);
                        formData.append('breed', values.breed);
                        formData.append('bio', values.about);
                        formData.append('medical_history', values.medicalHistory);
                        formData.append('behavior', values.behavior);
                        formData.append('other_notes', values.other);
                        if (values.image) {
                            formData.append('image', values.image);
                        }

                        await PetListingService.update(
                            listingId,
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
                {({errors, setFieldValue}) => {
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
                                <div className="col-span-2 flex flex-col">
                                    <label htmlFor="status">Status</label>
                                    <SelectInput
                                        options={[
                                            {
                                                value: 'available',
                                                label: 'Available'
                                            },
                                            {
                                                value: 'not_available',
                                                label: 'Not Available'
                                            },
                                        ]}
                                        id="status"
                                        name="status"
                                        onChange={(e) => setFieldValue('status', e.target.value)}
                                    />
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
                                    <Button className='px-8' type="submit">Save Changes</Button>
                                </div>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </Container>
    );
};

export default EditListing;
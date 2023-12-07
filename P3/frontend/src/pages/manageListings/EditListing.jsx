import React, { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import Heading from '../../components/layout/Heading';
import TextInput from '../../components/inputs/TextInput';
import Text from '../../components/Text';
import { Formik, Form } from 'formik';
import Button from '../../components/inputs/Button';
import PetListingService from '../../services/PetListingService';
import PetDetailService from '../../services/PetDetailService';
import { useUser } from '../../contexts/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import SelectInput from '../../components/inputs/SelectInput';
import Page from '../../components/layout/Page';
import ListingQuestionEditor from './components/ListingQuestionEditor';

const EditListing = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [imageUrls, setImageUrls] = useState([null, null, null]);
    const [initialValues, setInitialValues] = useState({
        status: '',
        name: '',
        age: '',
        breed: '',
        about: '',
        medicalHistory: '',
        behavior: '',
        other: '',
        images: [null, null, null],
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
                setInitialValues({
                    status: listing.status,
                    name: listing.name,
                    age: listing.age,
                    breed: listing.breed,
                    about: listing.bio,
                    medicalHistory: listing.medical_history,
                    behavior: listing.behavior,
                    other: listing.other_notes,
                    images: listing.images.map(async(image) => {
                        const res = await fetch(image)
                        const blob = await res.blob()
                        const contentType = response.headers.get('content-type')
                        return new File([blob], image, { contentType })
                    })
                });
                setImageUrls(listing.images);
            })
        }
    }, [listingId, navigate, user.id])

    return (
        <Page>
            <div className='flex flex-col items-center justify-center gap-8 w-full'>
                <Container className="sm:w-full md:w-4/5">
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
                                formData.append('image', await values.images[0]);
                                formData.append('image2', await values.images[1]);
                                formData.append('image3', await values.images[2]);

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
                        {({errors, setFieldValue, values}) => {
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
                                                            <div className='relative' key={i}>
                                                                {
                                                                    imageUrl ? (
                                                                        <img src={imageUrls[i]} alt="" class="w-64 h-50 object-cover pet-photo rounded-xl aspect-square" />
                                                                    ) : (
                                                                        <img class="w-64 h-50 object-cover pet-photo rounded-xl aspect-square" alt="" />
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


                <Container className="sm:w-full md:w-4/5 flex flex-col col-span-2 gap-4">
                    <Heading>Questions</Heading>
                    <Text className='col-span-2'>Select which questions applicants will respond to in their application.</Text>
                    <ListingQuestionEditor listingId={listingId}/>
                </Container>
            </div>
        </Page>
    );
};

export default EditListing;
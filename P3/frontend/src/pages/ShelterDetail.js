import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import ShelterService from "../services/ShelterService";
import PetListingService from "../services/PetListingService";
import Heading from '../components/layout/Heading';
import { useNavigate } from 'react-router-dom';
import ShelterListingCard from "../components/shelters/ShelterListingCard";
import { useUser } from "../contexts/UserContext";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, Dialog, DialogBody, DialogHeader, Textarea, Input, Typography } from "@material-tailwind/react";
import ReviewService from "../services/ReviewService";
import Container from "../components/layout/Container";
import Review from "../components/review/Review";
import { FaPen } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import ShelterCircularPagination from "../components/shelters/ShelterCircularPagination";


const RatingInput = (props) => (
    <Input
        type="number"
        name="rating"
        id="rating"
        min="1"
        max="5"
        className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        label={'Rating'}
        {...props}
    />
)

const ReviewInput = (props) => (
    <Textarea
        name="text"
        id="text"
        rows="5"
        className="rounded-md border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-0"
        label={'Review'}
        {...props}
    />
)


const ShelterDetail = () => {
    const { user } = useUser()
    const { shelterId } = useParams()
    const [shelter, setShelter] = useState({})
    const [listings, setListings] = useState([])
    const [currPage, setCurrPage] = useState(1)
    const [currReviewPage, setCurrReviewPage] = useState(1)
    const [totalReviewPages, setTotalReviewPages] = useState(1)
    const navigate = useNavigate()
    const [reviews, setReviews] = useState([])
    const listingsPerPage = 2
    const reviewPerPage = 10
    const [open, setOpen] = useState(false)
    const handleOpen = (open) => setOpen(open);

    useEffect(() => {
        ShelterService.getById(shelterId)
            .then(res => {
                setShelter(res.data)
            })
            .catch(err => {
                navigate('/404')
            })
    }, [shelterId, navigate]);

    useEffect(() => {
        PetListingService.getByShelter(shelterId)
            .then(res => {
                setListings(res.data.results)
            })
            .catch(err => {
                console.log("error fetching listings:", err)
                setListings([])
            })
    }, [shelterId])

    useEffect(() => {
        ReviewService.list(shelterId, currReviewPage)
            .then(res => {
                setReviews(res.data.results)
                setTotalReviewPages(Math.ceil(res.data.count / reviewPerPage))
            })
            .catch(err => {
                console.log("error fetching reviews:", err)
                setReviews([])
            })
    }, [shelterId, currReviewPage])

    const totalPages = Math.ceil(listings.length / listingsPerPage)
    const indexOfLastListing = currPage * listingsPerPage
    const indexOfFirstListing = indexOfLastListing - listingsPerPage
    const currListings = listings.slice(indexOfFirstListing, indexOfLastListing)

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-14 flex flex-col gap-y-10">
            {user && listings.length != 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-16">
                    <Container className="pb-4">
                    <div className="flex flex-col items-center">
                        <Heading><h1 class="mt-4 text-[2rem] font-semibold mb-4">{shelter.shelter_name}</h1></Heading>
                        <p className="text-md font-semibold mb-4 text-center">
                            Location: {shelter.location}
                        </p>
                        <div className="flex justify-center items-center">
                            <img src="https://i.ebayimg.com/images/g/fTEAAOSwvrBkDaUa/s-l1200.jpg" alt="Profile Icon" className="h-64 w-64 rounded-lg" />
                        </div>
                        <p className="mt-8 font-semibold text-xl mb-2 text-center">
                            Our Mission Statement:
                        </p>
                        <p className="font-medium text-md mb-2 text-center">
                            {shelter.mission_statement}
                        </p>
                        <p className="mt-8 font-semibold text-xl mb-2">
                            Contact Us!
                        </p>
                        <p className="text-[#290005] text-center">
                            <a href={`mailto:${shelter.contact_email}`} className="hover:underline">
                                {shelter.contact_email}
                            </a>
                        </p>
                    </div>
                    </Container>
                    <Container className="flex flex-col justify-center px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-items-center">
                            {currListings.map((listing) => (
                                <ShelterListingCard listing={listing} />
                            ))}
                        </div>
                        <div className="flex justify-center items-center gap-4 mt-5">
                            <Button
                                variant="text"
                                className="flex items-center gap-2 rounded-full"
                                onClick={() => setCurrPage(currPage - 1)}
                                disabled={currPage === 1}
                            >
                                <ArrowLeftIcon strokeWidth={3} className="h-4 w-4" /> 
                            </Button>
                            <Button
                                variant="text"
                                className="flex items-center gap-2 rounded-full"
                                onClick={() => setCurrPage(currPage + 1)}
                                disabled={currPage === totalPages}
                            >
                                <ArrowRightIcon strokeWidth={3} className="h-4 w-4" /> 
                            </Button>
                        </div>
                    </Container>
                </div>
            ) : (
                <Container>
                <div className="flex flex-col items-center pb-10">
                    <Heading><h1 class="mt-10 text-[2rem] font-semibold mb-4">{shelter.shelter_name}</h1></Heading>
                    <p className="text-md font-semibold mb-4 text-center">
                        Location: {shelter.location}
                    </p>
                    <div className="flex justify-center items-center">
                        <img src="https://i.ebayimg.com/images/g/fTEAAOSwvrBkDaUa/s-l1200.jpg" alt="Profile Icon" className="h-64 w-64 rounded-lg" />
                    </div>
                    <p className="mt-8 font-semibold text-xl mb-2 text-center">
                        Our Mission Statement:
                    </p>
                    <p className="font-medium text-md mb-2 text-center">
                        {shelter.mission_statement}
                    </p>
                    <p className="mt-8 font-semibold text-xl mb-2">
                        Contact Us!
                    </p>
                    <p className="text-[#290005] text-center">
                        <a href={`mailto:${shelter.contact_email}`} className="hover:underline">
                            {shelter.contact_email}
                        </a>
                    </p>
                </div>
                </Container> 
            )}
            <Container className="px-12 py-8">
                <div className="flex flex-row justify-between items-center">
                    <Heading><h1 class="mt-0 text-[1.75rem] font-semibold mb-4">Reviews</h1></Heading>
                    <Button className="flex items-center gap-3 px-3" onClick={handleOpen}><FaPen />Write a Review</Button>
                </div>
                <div className="flex flex-col gap-y-4 w-full">
                    {
                    !user ? (
                            <p>You must be logged in to view reviews.</p>
                        ) : (
                            reviews.sort((a, b) => (new Date(a.created_at) < new Date(b.created_at)) ? -1 : 1)
                            .map((review, i) => (
                                <Review review={review} key={i} />
                            ))
                        )
                    }
                </div>
                { user && (
                    <div className="flex justify-center items-center gap-4 mt-5">
                        <ShelterCircularPagination 
                            totalPages={totalReviewPages} 
                            onPageChange={(pageNum) => {
                                setCurrReviewPage(pageNum);
                            }}
                        />
                    </div>
                ) }
            </Container>

            <Dialog
                open={open}
                size={"sm"}
                handler={handleOpen}
            >
                <DialogHeader><Heading><h1>Write a Review</h1></Heading></DialogHeader>
                <DialogBody className="pt-0">
                    <Formik
                        initialValues={{
                            rating: 5,
                            text: ""
                        }}
                        validate={(values) => {
                            const errors = {};
                            if (values.rating < 0 || values.rating > 5) {
                                errors.rating = 'Rating must be between 1 and 5';
                            }
                            if (!values.text) {
                                errors.text = 'Review content cannot be blank';
                            }
                            return errors;
                        }}
                        onSubmit={(values) => {
                            ReviewService.create(shelterId, {
                                rating: values.rating,
                                text: values.text,
                                shelter: shelterId,
                            })
                                .then(res => {
                                    setReviews([res.data, ...reviews])
                                    handleOpen(false)
                                })
                                .catch(err => {
                                    console.log("error creating review:", err)
                                })
                        }}
                    >
                        {({ errors }) => (
                            <Form>
                                <div className="flex flex-col gap-y-4">
                                    <Field name="rating" as={RatingInput}/>
                                    {errors.rating && <Typography
                                        variant="small"
                                        color="red"
                                        className="mt-2 flex items-center gap-1 font-normal"
                                    >{errors.rating}</Typography>}

                                    
                                    <Field name="text" as={ReviewInput}/>
                                    {errors.text && <Typography
                                        variant="small"
                                        color="red"
                                        className="mt-0 flex items-center gap-1 font-normal"
                                    >{errors.text}</Typography>}

                                    <Button className="w-full" color="orange" type='submit'>Submit</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </DialogBody>
            </Dialog>
        </div>
    )
}

export default ShelterDetail;
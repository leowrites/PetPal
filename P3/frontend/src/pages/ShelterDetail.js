import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import ShelterService from "../services/ShelterService";
import PetListingService from "../services/PetListingService";
import Heading from '../components/layout/Heading';
import { useNavigate } from 'react-router-dom';
import ShelterListingCard from "../components/shelters/ShelterListingCard";
import { useUser } from "../contexts/UserContext";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";

const ShelterDetail = () => {
    const { user } = useUser()
    const { shelterId } = useParams()
    const [shelter, setShelter] = useState({})
    const [listings, setListings] = useState([])
    const [currPage, setCurrPage] = useState(1)
    const navigate = useNavigate()
    const listingsPerPage = 2

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

    const totalPages = Math.ceil(listings.length / listingsPerPage)
    const indexOfLastListing = currPage * listingsPerPage
    const indexOfFirstListing = indexOfLastListing - listingsPerPage
    const currListings = listings.slice(indexOfFirstListing, indexOfLastListing)

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-14">
            {user && listings.length != 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-40 gap-y-16">
                    <div className="flex flex-col items-center">
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
                    <div className="flex flex-col justify-center">
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
                    </div>
                </div>
            ) : ( 
                <div className="flex flex-col items-center">
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
            )}
            
        </div>
    )
}

export default ShelterDetail;
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import ShelterService from "../services/ShelterService";
import Heading from '../components/layout/Heading';
import { useNavigate } from 'react-router-dom';

const ShelterDetail = () => {
    const { shelterId } = useParams()
    const [shelter, setShelter] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        ShelterService.getById(shelterId)
            .then(res => {
                setShelter(res.data)
            })
            .catch(err => {
                navigate('/404')
            })
    }, [shelterId, navigate]);

    return (
        <div className="flex flex-col items-center mt-5">
            <Heading><h1 class="text-[2rem] font-semibold mb-4">{shelter.shelter_name}</h1></Heading>
            <p className="text-md font-semibold mb-4 text-center">
                Location: {shelter.location}
            </p>
            <div className="flex justify-center items-center h-full">
                <img src="https://m.media-amazon.com/images/I/81LspF1zOvL._AC_UF894,1000_QL80_.jpg" alt="Profile Icon" className="h-2/5 w-2/5" />
            </div>
            <p className="mt-8 font-semibold text-xl mb-2 text-center">
                Our Mission Statement:
            </p>
            <p className="font-medium text-md mb-2">
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
    )
}

export default ShelterDetail;
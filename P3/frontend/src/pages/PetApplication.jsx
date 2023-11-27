import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/inputs/Button'
import { PetOverviewPanel } from "../components/pet/common"

const PetImage = ({ src }) => {
    return (
        <div>
            <img
                src="/dog_photo1.png"
                alt=""
                class="w-full h-full object-cover pet-photo rounded-xl aspect-square"
            />
        </div>
    )
}

const ApplicationForm = () => {
    return (
        <div
            class="order-3 md:order-2 md:col-span-2 md:row-span-3 pet-overview-box p-5 rounded-xl"
        ></div>
    )
}


export default function PetApplication() {
    const { listingId } = useParams()
    const [petDetail, setPetDetail] = useState({})
    const navigate = useNavigate()
    useEffect(() => {
        // fetch pet details
        fetch(`http://localhost:8000/shelters/1/listings/${listingId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => {
                if (res.status === 404) {
                    console.log("Navigating")
                    navigate('/404')
                }
                return res.json()
            })
            .then(data => setPetDetail(data))
    }, [])
    const petListingOverview = {
        name: petDetail.name,
        listingTime: petDetail.listed_date,
        status: petDetail.status,
        shelter: petDetail.shelter,
        breed: petDetail.breed,
        age: petDetail.age,
        description: petDetail.bio
    }
    return (
        <div class="order-1 grid md:grid-cols-3 gap-4 h-fit">
            <PetImage />
            <ApplicationForm />
            <div class="order-2 md:order-3 md:row-span-2 flex flex-col gap-1 p-5 rounded-xl pet-overview-box">
                <PetOverviewPanel petListingOverview={petListingOverview} />
            </div>
        </div>
    )
}
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import Button from '../components/inputs/Button'

const DescriptionSection = ({ sectionTitle, sectionDetails }) => {
    return (<div>
        <p className="text-lg font-semibold">{sectionTitle}</p>
        <p className="text-sm">{sectionDetails}</p>
    </div>)
}

const PetImages = ({ imagePath }) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="col-span-2">
                <img className="rounded-xl w-full object-cover pet-photo" src={imagePath} />
            </div>
            <div className="col-span-1">
                <img
                    className="rounded-xl max-w-full h-full object-cover pet-photo"
                    src={imagePath}
                />
            </div>
            <div className="col-span-1">
                <img
                    className="rounded-xl max-w-full h-full object-cover pet-photo"
                    src={imagePath}
                />
            </div>
        </div>
    )
}

const PetDetailLeftPanel = ({ petListingIDetails }) => {
    return <div
        className="col-span-1 md:col-span-3 p-5 py-10 rounded-xl pet-detail-box order-last md:order-first"
    >
        <div className="flex flex-col gap-2">
            {
                petListingIDetails.map((detail, i) => (
                    <DescriptionSection key={i} sectionTitle={detail.sectionTitle} sectionDetails={detail.sectionDetails} />
                ))
            }
        </div>
    </div>
}

const PetDetailRightPanel = ({ petListingOverview }) => {
    return (<div
        className="col-span-1 md:col-span-2 p-5 py-10 rounded-xl pet-overview-box order-first md:order-last"
    >
        <div className="flex flex-col gap-1">
            <p className="text-lg font-bold">{petListingOverview.name}</p>
            <p className="text-sm">{petListingOverview.listingTime}</p>
            <p className="text-sm pet-overview-box-status">Status: {petListingOverview.status}</p>
            <a className="text-sm underline pet-overview-box-shelter" href="../shelter/shelter.html">{petListingOverview.shelter}</a>
            <p className="text-sm pet-overview-box-breed">{petListingOverview.breed}</p>
            <p className="text-sm pet-overview-box-breed">Age {petListingOverview.age}</p>
            <p className="text-sm"> {petListingOverview.description}</p>
            <Button text={"Adopt"} />
        </div>
    </div>)
}

export default function PetDetail() {
    const { petId } = useParams()
    const [petDetail, setPetDetail] = useState({})
    useEffect(() => {
        // fetch pet details
        fetch(`http://localhost:8000/shelters/1/listings/${petId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => setPetDetail(data))
    }, [])
    console.log(petDetail)
    const petListingIDetails = [
        {
            sectionTitle: 'Medical History',
            sectionDetails: petDetail.medical_history,
        },
        {
            sectionTitle: 'Behavior',
            sectionDetails: petDetail.behavior
        },
        {
            sectionTitle: 'Other Notes',
            sectionDetails: petDetail.other_notes
        }
    ]
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
        <div>
            <PetImages imagePath={"/dog_photo1.png"} />
            <div className="grid grid-cols-1 my-5 gap-5 md:grid-cols-5">
                <PetDetailLeftPanel petListingIDetails={petListingIDetails} />
                <PetDetailRightPanel petListingOverview={petListingOverview} />
            </div>
        </div>
    )
}
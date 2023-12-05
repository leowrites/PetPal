import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from 'react-router-dom'
import Button from '../components/inputs/Button'
import { PetOverviewPanel } from "../components/pet/common"
import PetDetailService from "../services/PetDetailService"
import { setAuthToken } from "../services/ApiService"
import Skeleton from "react-loading-skeleton"
import PetApplicationService from "../services/PetApplicationService"
import Page from "../components/layout/Page"

const DescriptionSection = ({ sectionTitle, sectionDetails, loading }) => {
    return (<div>
        <p className="text-lg font-semibold">{sectionTitle}</p>
        {
            loading ? <Skeleton />
            : <p className="text-sm">{sectionDetails}</p>
        }
    </div>)
}

const PetImages = ({ images }) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 h-fit">
            <div className="col-span-2 w-full">
                <img className="rounded-xl h-96 w-full object-cover" src={images ? images[0] : '/logo_dark_mode.svg'} alt={'dog-placeholder.svg'}/>
            </div>
            <div className="col-span-1 w-full">
                <img className="rounded-xl h-96 w-full object-cover" src={images ? images[1] : '/logo_dark_mode.svg'} alt={'dog-placeholder.svg'}/>
            </div>
            <div className="col-span-1 w-full">
                <img className="rounded-xl h-96 w-full object-cover" src={images ? images[2] : '/logo_dark_mode.svg'} alt={'dog-placeholder.svg'}/>
            </div>
        </div>
    )
}

const PetDetailLeftPanel = ({ petListingIDetails, loading }) => {
    return <div
        className="col-span-1 md:col-span-3 p-5 py-10 rounded-xl pet-detail-box order-last md:order-first"
    >
        <div className="flex flex-col gap-2">
            {
                petListingIDetails.map((detail, i) => (
                    <DescriptionSection key={i} sectionTitle={detail.sectionTitle} sectionDetails={detail.sectionDetails} loading={loading} />
                ))
            }
        </div>
    </div>
}

export default function PetDetail() {
    const { listingId } = useParams()
    const [petDetail, setPetDetail] = useState({})
    const [loading, setLoading] = useState(true)
    const [applicationId, setApplicationId] = useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        PetDetailService.get(listingId)
            .then(res => {
                setPetDetail(res.data)
                setLoading(false)
            })
            .catch(err => {
                if (err.response.status === 404) {
                    navigate('/404')
                }
                console.error(err)
            })
        // check if user already applied for this pet
        PetApplicationService.list()
        .then(res => {
            res.data.results.forEach(application => {
                if (application.listing.id === parseInt(listingId)) {
                    setApplicationId(application.id)
                }
            })
        })
    }, [listingId])
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
        id: listingId,
        name: petDetail.name,
        listingTime: (new Date(petDetail.listed_date)).toLocaleTimeString('en-US', {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        status: petDetail.status === 'available' ? 'Available' : 'Not Available',
        shelter: petDetail.shelter?.shelter_name,
        shelterOwner: petDetail.shelter?.owner,
        breed: petDetail.breed,
        age: petDetail.age,
        description: petDetail.bio,
    }


    return (
        <Page>
            <PetImages images={petDetail.images} />
            <div className="grid grid-cols-1 my-5 gap-5 md:grid-cols-5">
                <PetDetailLeftPanel petListingIDetails={petListingIDetails} loading={loading}/>
                <div
                    className="col-span-1 md:col-span-2 p-5 py-10 rounded-xl pet-overview-box order-first md:order-last"
                >
                    <PetOverviewPanel petListingOverview={petListingOverview} detailsView={true}
                                      applicationId={applicationId} loading={loading}/>
                </div>
            </div>
        </Page>
    )
}
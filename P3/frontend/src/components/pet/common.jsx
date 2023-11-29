import { useParams, useNavigate, Link } from 'react-router-dom'
import Button from '../inputs/Button'
import Skeleton from 'react-loading-skeleton'


const SkeletonArray = () => {
    return (
        <>
            {
                Array.from({ length: 5 }, (_, i) => <Skeleton className='mr-2 mb-2 box-content' height='1rem' key={i} inline />)
            }
        </>
    )
}

export const PetOverviewPanel = ({ petListingOverview, detailsView, loading }) => {
    return (
        <div className="flex flex-col gap-1">
            {
                loading ?
                    <SkeletonArray />
                    :
                    <>
                        <p className="text-lg font-bold">{petListingOverview.name}</p>
                        <p className="text-sm">Listing Time: {petListingOverview.listingTime}</p>
                        <p className="text-sm pet-overview-box-status">Status: {petListingOverview.status}</p>
                        <a className="text-sm underline pet-overview-box-shelter" href="../shelter/shelter.html">{petListingOverview.shelter}</a>
                        <p className="text-sm pet-overview-box-breed">{petListingOverview.breed}</p>
                        <p className="text-sm pet-overview-box-breed">Age {petListingOverview.age}</p>
                        <p className="text-sm"> {petListingOverview.description}</p>
                        {
                            detailsView
                                ?
                                <Link to='applications'>
                                    <Button>Adopt</Button>
                                </Link>
                                : null
                        }
                    </>
            }
        </div>
    )
}
import { useParams, useNavigate, Link } from 'react-router-dom'
import Button from '../inputs/Button'
import Skeleton from 'react-loading-skeleton'
import { useUser } from '../../contexts/UserContext'

const SkeletonArray = () => {
    return (
        <>
            {
                Array.from({ length: 5 }, (_, i) => <Skeleton className='mr-2 mb-2 box-content' height='1rem' key={i} inline />)
            }
        </>
    )
}

export const PetOverviewPanel = ({ petListingOverview, detailsView, applicationId, loading }) => {
    const { user } = useUser()
    const ActionButton = () => {
        return (
            applicationId ?
                <Link to={`/applications/${applicationId}`}>
                    <Button>View Application</Button>
                </Link>
                : detailsView ?
                <Link to='applications'>
                    <Button>Adopt</Button>
                </Link>
                : null
        )
    }
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
            <div class="flex flex-row gap-2">
                <ActionButton />
                {
                    user.is_shelter && user.id === petListingOverview.shelterOwner ?
                        <Link to={`/pets/${petListingOverview.listingId}/edit`}>
                            <Button>Edit</Button>
                        </Link>
                        : null
                }
            </div>
            </>
        }
        </div>
    )
}
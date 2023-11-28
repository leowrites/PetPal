import { useParams, useNavigate, Link } from 'react-router-dom'
import Button from '../inputs/Button'
export const PetOverviewPanel = ({ petListingOverview, detailsView, applicationId }) => {
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
            <p className="text-lg font-bold">{petListingOverview.name}</p>
            <p className="text-sm">Listing Time: {petListingOverview.listingTime}</p>
            <p className="text-sm pet-overview-box-status">Status: {petListingOverview.status}</p>
            <a className="text-sm underline pet-overview-box-shelter" href="../shelter/shelter.html">{petListingOverview.shelter}</a>
            <p className="text-sm pet-overview-box-breed">{petListingOverview.breed}</p>
            <p className="text-sm pet-overview-box-breed">Age {petListingOverview.age}</p>
            <p className="text-sm"> {petListingOverview.description}</p>
            <ActionButton />
        </div>
    )
}
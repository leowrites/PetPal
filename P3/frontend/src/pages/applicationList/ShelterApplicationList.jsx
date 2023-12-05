import { useEffect, useState } from "react";
import PetApplicationService from "../../services/PetApplicationService";
import { ApplicationTable } from "../../components/pet/common";
import { useUser } from "../../contexts/UserContext";

export default function ShelterApplicationList() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [filters, setFilters] = useState({})
    const { user } = useUser()

    const addPageNumber = () => {
        setPageNumber(pageNumber + 1);
    }
    const subPageNumber = () => {
        setPageNumber(pageNumber - 1);
    }
    const updateFilters = (newFilters) => {
        setPageNumber(1);
        setFilters(newFilters);
    }

    useEffect(() => {
        setIsLoading(true);
        const params = {
            ...filters,
            page: pageNumber,
        }
        PetApplicationService.list(params)
            .then(res => {
                setApplications(
                    res.data.results.map((res) => {
                        return {
                            id: res.id,
                            petName: res.listing.name,
                            applicant: res.applicant.username,
                            status: res.status,
                            lastUpdated: res.last_updated,
                            created: res.application_time
                        }
                    }))
                setHasNextPage(res.data.next !== null);
                setIsLoading(false);
            })
    }, [pageNumber, filters]);
    return (
        <ApplicationTable applications={applications} pageNumber={pageNumber} hasNextPage={hasNextPage}
            addPageNumber={addPageNumber} subPageNumber={subPageNumber} isLoading={isLoading} updateFilters={updateFilters} 
            filters={filters} isShelter={user.is_shelter}/>
    )
}


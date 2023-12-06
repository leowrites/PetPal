import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Button from "../components/inputs/Button"
import Page from "../components/layout/Page"
import { ListingTable } from "../components/pet/common"
import PetListingService from "../services/PetListingService"
import { useUser } from "../contexts/UserContext";

export default function () {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [filters, setFilters] = useState({name: ''})
    const [deleted, setDeleted] = useState(false)
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

    const deleteListing = (id) => {
        PetListingService.delete(id)
            .then(res => {
                setDeleted((prev) => !prev)
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(true);
            console.log(pageNumber)
            const params = {
                ...filters,
                shelter: user.shelter_id,
                page: pageNumber,
            }
            PetListingService.getByParams(params)
                .then(res => {
                    setListings(
                        res.data.results.map((res) => {
                            console.log(res)
                            return {
                                id: res.id,
                                petName: res.name,
                                status: res.status,
                                lastUpdated: res.last_updated,
                                created: res.listed_date,
                                image: res.image,
                            }
                        }))
                    setHasNextPage(res.data.next !== null);
                    setIsLoading(false);
                })
        }, 500);

        return () => clearTimeout(timer);
    }, [pageNumber, filters, deleted]);


    return (
        <Page>
            <ListingTable 
                listings={listings} 
                pageNumber={pageNumber} 
                hasNextPage={hasNextPage}
                addPageNumber={addPageNumber} 
                subPageNumber={subPageNumber} 
                isLoading={isLoading} 
                updateFilters={updateFilters} 
                filters={filters} 
                isShelter={user.is_shelter}
                deleteListing={deleteListing}
            />
        </Page>
    )
}
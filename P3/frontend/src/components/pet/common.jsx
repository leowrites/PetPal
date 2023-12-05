import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Button from '../inputs/Button'
import Skeleton from 'react-loading-skeleton'
import { useUser } from '../../contexts/UserContext'
import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    Chip,
    CardFooter,
    IconButton,
    Select,
    Option,
    Avatar,
} from "@material-tailwind/react";
import { MdDriveFileRenameOutline } from 'react-icons/md'
import SearchTextInput from '../search/SearchTextInput';
import SearchSortSelector from '../search/SearchSortSelector'

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
        // don't let shelters adopt anything
        if (user.is_shelter) return null
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
                        <div class="flex flex-row gap-2 mt-4">
                            <ActionButton />
                            {
                                user.is_shelter && user.id === petListingOverview.shelterOwner ?
                                    <Link to={`/listings/${petListingOverview.id}/edit`}>
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

const ApplicationRows = ({ applications, isShelter }) => {

    const navigate = useNavigate();
    return applications.map(
        ({ id, petName, applicant, status, lastUpdated, created }, index) => {
            const isLast = index === applicant.length - 1;
            const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

            return (
                <tr className='hover:cursor-pointer' key={id} onClick={() => { navigate(`/applications/${id}`) }}>
                    <td className={classes}>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {id}
                                </Typography>
                            </div>
                        </div>
                    </td>
                    <td className={classes}>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {petName}
                                </Typography>
                            </div>
                        </div>
                    </td>
                    {
                        isShelter &&
                        <td className={classes}>
                            <div className="flex flex-col">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {applicant}
                                </Typography>
                            </div>
                        </td>
                    }
                    <td className={classes}>
                        <div className="w-max">
                            <Chip
                                variant="ghost"
                                size="sm"
                                value={status}
                                color={status === 'pending' ? "green" : "red"}
                            />
                        </div>
                    </td>
                    <td className={classes}>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {
                                new Date(lastUpdated).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                            }
                        </Typography>
                    </td>
                    <td className={classes}>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {
                                new Date(created).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                            }
                        </Typography>
                    </td>
                    <td className={classes}>
                        <IconButton variant="text" onClick={() => { navigate(`/applications/${id}`) }}>
                            <p>
                                VIEW
                            </p>
                        </IconButton>
                    </td>
                </tr>
            );
        },
    )
}

export function ApplicationTable({ applications, pageNumber, hasNextPage, addPageNumber, subPageNumber, isLoading, updateFilters, filters, isShelter }) {
    const TABLE_HEAD = ["Id", "Pet Name", "Status", "Last Updated", 'Created', ''];
    if (isShelter) {
        TABLE_HEAD.splice(2, 0, 'Applicant')
    }
    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <p className='font-semibold text-2xl'>
                        Pet Applications
                    </p>
                </div>
            </CardHeader>
            <CardBody className="overflow-x-auto px-0">
                <div className="flex flex-wrap w-full w-72 px-4 gap-2">
                    <div className="w-full md:w-72">
                        <Select label="Select Status" onChange={(val) => { updateFilters({ ...filters, 'status': val }) }}>
                            <Option value="">All</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="approved">Approved</Option>
                            <Option value="accepted">Accepted</Option>
                            <Option value="withdrawn">Withdrawn</Option>
                        </Select>
                    </div>
                    <div className='w-full md:w-72'>
                        <Select label="Sort by" onChange={(val) => { updateFilters({ ...filters, 'ordering': val }) }}>
                            <Option value="-application_time">Created Time</Option>
                            <Option value="-last_updated">Last Updated Time</Option>
                        </Select>
                    </div>
                </div>
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isLoading ?
                                Array.from(Array(15).keys()).map((i) => (
                                    <tr key={i}>
                                        {
                                            Array.from(Array(TABLE_HEAD.length).keys()).map((i) => (
                                                <td>
                                                    <Skeleton height='2rem' width='10rem' />
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                                : <ApplicationRows applications={applications} isShelter={isShelter} />
                        }
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <div></div>
                <div className="flex gap-2">
                    <Button className='hover:pointer-events-none' variant="outlined" size="sm" onClick={subPageNumber} disabled={isLoading || pageNumber === 1}>
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm" onClick={addPageNumber} disabled={isLoading || !hasNextPage} >
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

const ListingRows = ({ listings, isShelter }) => {

    const navigate = useNavigate();
    return listings.map(
        ({ id, petName, status, lastUpdated, created, image }, index) => {
            const isLast = index === listings.length - 1;
            const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

            return (
                <tr className='hover:cursor-pointer' key={id} onClick={() => { navigate(`/listings/${id}`) }}>
                    <td className={classes}>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <Avatar variant='circular' size="regular" src={image} alt={`${petName}${id}`}
                                    onError={({ currentTarget }) => {
                                        currentTarget.onerror = null
                                        currentTarget.src="logo.svg";
                                      }}
                                />
                            </div>
                        </div>
                    </td>
                    <td className={classes}>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {id}
                                </Typography>
                            </div>
                        </div>
                    </td>
                    <td className={classes}>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                >
                                    {petName}
                                </Typography>
                            </div>
                        </div>
                    </td>
                    <td className={classes}>
                        <div className="w-max">
                            <Chip
                                variant="ghost"
                                size="sm"
                                value={status}
                                color={status === 'available' ? "green" : "red"}
                            />
                        </div>
                    </td>
                    <td className={classes}>
                        <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                        >
                            {
                                new Date(created).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                            }
                        </Typography>
                    </td>
                    <td className={classes}>
                        <IconButton variant="text" onClick={() => { navigate(`/listings/${id}`) }
                        }>
                            <p>
                                VIEW
                            </p>
                        </IconButton>
                    </td>
                    <td className={classes}>
                        <IconButton variant="text" onClick={(e) => {e.stopPropagation() ;navigate(`/listings/${id}/edit`) }
                        }>
                            <p>
                                EDIT
                            </p>
                        </IconButton>
                    </td>
                </tr>
            );
        }
    )
}

export function ListingTable({ listings, pageNumber, hasNextPage, addPageNumber, subPageNumber, isLoading, updateFilters, filters, isShelter }) {
    const [sortValue, setSortValue] = useState('-listed_date')
    const TABLE_HEAD = ['', "Id", "Pet Name", "Status", 'Created', '', ''];

    useEffect(() => {
        updateFilters({ ...filters, 'ordering': sortValue })
    }, [sortValue])

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-2 flex items-center justify-between pt-[1rem] gap-8">
                    <p className='font-semibold text-2xl'>
                        Pet Listings
                    </p>
                    <Link to='/questions'>
                        <Button>
                            Manage Questions
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardBody className="overflow-x-auto px-0 pb-0">
                <div className="flex flex-wrap flex-col sm:flex-row px-4 gap-[.5rem]">
                    <SearchTextInput label={"Search by pet name"} value={filters.name} icon={<MdDriveFileRenameOutline />} onChange={(e) => updateFilters({...filters, name: e.target.value})}/>
                    <div className="w-full sm:w-[12.5rem]">
                        <Select label="Select Status" color='orange' onChange={(val) => { updateFilters({ ...filters, 'status': val }) }}>
                            <Option value="">All</Option>
                            <Option value="available">Available</Option>
                            <Option value="not_available">Unavailable</Option>
                        </Select>
                    </div>
                    <SearchSortSelector sortValue={sortValue} setSortValue={setSortValue} />
                </div>
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isLoading ?
                                Array.from(Array(15).keys()).map((i) => (
                                    <tr key={i}>
                                        {
                                            Array.from(Array(TABLE_HEAD.length).keys()).map((i) => (
                                                <td>
                                                    <Skeleton height='2rem' width='10rem' />
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                                : <ListingRows listings={listings} isShelter={isShelter} />
                        }
                    </tbody>
                </table>
                {listings && listings.length === 0 && !isLoading && <p className='text-center py-[2rem]'>No listings found, please adjust search terms</p>}
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <div></div>
                <div className="flex gap-2">
                    <Button className='hover:pointer-events-none' variant="outlined" size="sm" onClick={subPageNumber} disabled={isLoading || pageNumber === 1}>
                        Previous
                    </Button>
                    <Button variant="outlined" size="sm" onClick={addPageNumber} disabled={isLoading || !hasNextPage} >
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
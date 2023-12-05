import { useEffect, useState } from "react";
import PetApplicationService from "../../services/PetApplicationService";
import Skeleton from "react-loading-skeleton"
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    IconButton,
    Select,
    Option
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

// pet name, application status, application time, last updated, applicant name
const TABLE_HEAD = ["Id", "Pet Name", "Applicant", "Status", "Last Updated", 'Created', ''];

const ApplicationRows = ({ applications }) => {
    const navigate = useNavigate();
    return applications.map(
        ({ id, petName, applicant, status, lastUpdated, created }, index) => {
            const isLast = index === applicant.length - 1;
            const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

            return (
                <tr key={id}>
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

export function ApplicationTable({ applications, pageNumber, hasNextPage, addPageNumber, subPageNumber, isLoading, updateFilters, filters }) {
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
                <div className="flex w-72 px-4 gap-2">
                    <div className="w-72">
                        <Select label="Select Status" onChange={(val) => { updateFilters({ ...filters, 'status': val }) }}>
                            <Option value="">All</Option>
                            <Option value="pending">Pending</Option>
                            <Option value="approved">Approved</Option>
                            <Option value="accepted">Accepted</Option>
                            <Option value="withdrawn">Withdrawn</Option>
                        </Select>
                    </div>
                    <div className='w-72'>
                        <Select className="w-72" label="Sort by" onChange={(val) => { updateFilters({ ...filters, 'ordering': val }) }}>
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
                                : <ApplicationRows applications={applications} />
                        }
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <div></div>
                <div className="flex gap-2">
                    <Button variant="outlined" size="sm" onClick={subPageNumber} disabled={isLoading || pageNumber == 1}>
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

export default function ShelterApplicationList() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [filters, setFilters] = useState({})

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
            addPageNumber={addPageNumber} subPageNumber={subPageNumber} isLoading={isLoading} updateFilters={updateFilters} filters={filters} />
    )
}


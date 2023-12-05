import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
    Tooltip,
    IconButton,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

import { FaBirthdayCake } from "react-icons/fa";

export default function SearchListingCard({listing}) {
    const navigate = useNavigate();

    return (
        <Card className="w-full max-w-[26rem] shadow-lg">
            <CardHeader floated={false}
            shadow={false}
            color="transparent"
            className="px-[1rem] text-[#290005] rounded-none text-3xl hover:cursor-pointer transition hover:text-[#ff9447] " onClick={() => navigate(`/listings/${listing.id}`)}> <h1>{listing.name}</h1> </CardHeader>
            <CardHeader floated={false} color="blue-gray" onClick={() => navigate(`/listings/${listing.id}`)}>
                <img
                src={listing.image}
                className="w-[26rem] h-[16rem] object-cover"
                alt={`${listing.name} ${listing.id} image`}
                />
                <div className="hover:cursor-pointer opacity-0 hover:opacity-100 to-bg-black-10 absolute inset-0 h-full w-full transition bg-gradient-to-tr from-transparent via-black/10 to-black/20 " />
            </CardHeader>
            <CardBody>
                <div className="mb-3 flex items-center justify-between">
                <Typography variant="h5" color="blue-gray" className="font-medium">
                    {listing.breed.charAt(0).toUpperCase() + listing.breed.slice(1)}
                </Typography>
                <Typography
                    color="blue-gray"
                    className="flex flex-row items-center gap-1.5 font-normal text-xs"
                >
                    <div>{listing.age} Year Old</div> <FaBirthdayCake className="mb-[.1rem]" />
                </Typography>
                </div>
                <Typography variant="lead" color="gray" className="ml-[.5rem] mt-[.25rem] font-normal text-md">
                    {listing.bio}
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <Button size="md" fullWidth={true} onClick={() => navigate(`/shelters/${listing.shelter.id}`)}>
                    View {listing.shelter.shelter_name}
                </Button>
            </CardFooter>
        </Card>
    );
};
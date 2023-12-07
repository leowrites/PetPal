import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Chip
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

import { FaBirthdayCake } from "react-icons/fa";

export default function ShelterListingCard({listing}) {
    const navigate = useNavigate();

    return (
        <Card className="w-full max-w-[26rem] shadow-lg">
            <CardHeader floated={false}
                shadow={false}
                color="transparent"
                className="relative px-[1rem] text-[#290005] rounded-none text-3xl hover:cursor-pointer whitespace-nowrap transition hover:text-[#ff9447] font-[500]" onClick={() => navigate(`/listings/${listing.id}`)}> 
                {listing.name}
                <div className="absolute right-0 top-0 h-full w-[20%] transition bg-gradient-to-r from-transparent via-white/50 to-white " />
            </CardHeader>
            <CardHeader floated={false} color="blue-gray" onClick={() => navigate(`/listings/${listing.id}`)}>
                <img
                src={listing.image}
                alt={listing.name}
                className="w-[26rem] h-[16rem] object-cover bg-[#e7e7e7]"
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src="logo.svg";
                  }}
                />
                <div className="hover:cursor-pointer opacity-0 hover:opacity-100 to-bg-black-10 absolute inset-0 h-full w-full transition bg-gradient-to-tr from-transparent via-black/10 to-black/20 " />
                <div className="!absolute top-4 right-4 rounded-full">
                  {listing.status === "available" ? (<Chip color="green" variant="gradient" value="Available" size="sm" />) : (<Chip color="red" variant="gradient" value="Unavailable" size="sm" />)}
                </div>
            </CardHeader>
            <CardBody>
                <div className="mb-3 flex items-center justify-between">
                <div variant="h5" color="blue-gray" className="font-medium">
                    {listing.breed.charAt(0).toUpperCase() + listing.breed.slice(1)}
                </div>
                <div
                    color="blue-gray"
                    className="flex flex-row items-center gap-1.5 font-normal text-xs"
                >
                    <div>{listing.age} Year Old</div> <FaBirthdayCake className="mb-[.1rem]" />
                </div>
                </div>
                <div variant="lead" color="gray" className="relative ml-[.5rem] mt-[.25rem] font-normal text-md whitespace-nowrap overflow-hidden">
                    {listing.bio}
                    <div className="absolute right-0 top-0 h-full w-[20%] transition bg-gradient-to-r from-transparent via-white/50 to-white " />
                </div>
            </CardBody>
            <CardFooter className="pt-0">
                { listing.status === "available" ? (
                    <Button className="bg-[#ff9447]" size="md" fullWidth={true} onClick={() => navigate(`/listings/${listing.id}`)}>
                        Adopt
                    </Button>
                ) : (
                    <div className="opacity-0">
                        <Button size="md" fullWidth={true} disabled>
                            Adopt
                        </Button>
                    </div>
                )} 
            </CardFooter>
        </Card>
    );
};
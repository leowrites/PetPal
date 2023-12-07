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

function timeSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;
  
    if(secondsPast < 60) {
      return parseInt(secondsPast) + ` second${secondsPast === 1 ? 's' : ''} ago`;
    }
    if(secondsPast < 3600) {
      return parseInt(secondsPast/60) + ` minute${secondsPast >= 120 ? 's' : ''} ago`;
    }
    if(secondsPast <= 86400) {
      return parseInt(secondsPast/3600) + ` hour${secondsPast >= 7200 ? 's' : ''} ago`;
    }
    if(secondsPast > 86400) {
      let day = date.getDate();
      let month = date.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
      let year = date.getFullYear() === now.getFullYear() ? "" :  " "+date.getFullYear();
      return day + " " + month + year;
    }
  }

export default function SearchListingCard({listing}) {
    const navigate = useNavigate();

    return (
        <Card className="w-full max-w-[26rem] shadow-lg">
            <CardHeader floated={false}
            shadow={false}
            color="transparent"
            className="relative px-[1rem] text-[#290005] rounded-none text-3xl hover:cursor-pointer whitespace-nowrap transition hover:text-[#ff9447] font-[500] overflow-hidden" onClick={() => navigate(`/listings/${listing.id}`)}> 
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
                <div className="!absolute top-4 right-4 rounded-full flex flex-col items-end gap-[.2rem]">
                    <Chip color="blue-gray" variant="gradient" value={`Listed ${timeSince(listing.listed_date)}`} size="sm" />
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
                    <div>{listing.age} Year{listing.age !== 1 ? 's' : ''} Old</div> <FaBirthdayCake className="mb-[.1rem]" />
                </div>
                </div>
                <div variant="lead" color="gray" className="relative ml-[.5rem] mt-[.25rem] font-normal text-md whitespace-nowrap overflow-hidden">
                    {listing.bio}
                    <div className="absolute right-0 top-0 h-full w-[20%] transition bg-gradient-to-r from-transparent via-white/50 to-white " />
                </div>
            </CardBody>
            <CardFooter className="pt-0">
                <Button size="md" color="orange" fullWidth={true} onClick={() => navigate(`/listings/${listing.id}`)}>
                    View
                </Button>
            </CardFooter>
        </Card>
    );
};
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    div,
    Button,
    Tooltip,
    IconButton,
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
      let year = date.getFullYear() == now.getFullYear() ? "" :  " "+date.getFullYear();
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
            className="px-[1rem] text-[#290005] rounded-none text-3xl hover:cursor-pointer transition hover:text-[#ff9447] font-[500]" onClick={() => navigate(`/listings/${listing.id}`)}> {listing.name} </CardHeader>
            <CardHeader floated={false} color="blue-gray" onClick={() => navigate(`/listings/${listing.id}`)}>
                <img
                src={listing.image}
                className="w-[26rem] h-[16rem] object-cover bg-[#e7e7e7]"
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null
                    currentTarget.src="logo.svg";
                  }}
                alt={`${listing.name} ${listing.id} image`}
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
                    <div>{listing.age} Year Old</div> <FaBirthdayCake className="mb-[.1rem]" />
                </div>
                </div>
                <div variant="lead" color="gray" className="ml-[.5rem] mt-[.25rem] font-normal text-md">
                    {listing.bio}
                </div>
            </CardBody>
            <CardFooter className="pt-0">
                <Button size="md" fullWidth={true} onClick={() => navigate(`/shelters/${listing.shelter.id}`)}>
                    View {listing.shelter.shelter_name}
                </Button>
            </CardFooter>
        </Card>
    );
};
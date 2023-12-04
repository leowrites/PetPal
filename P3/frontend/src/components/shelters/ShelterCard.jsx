import {
    Card,
    CardHeader,
    CardBody,
  } from "@material-tailwind/react";
import Button from "../inputs/Button";
import { Link } from "react-router-dom";
   
  export default function ShelterCard({ shelter }) {
    return (
      <Card className="w-full xl:flex-row">
        <CardHeader
          shadow={false}
          floated={false}
          className="m-0 w-2/5 shrink-0 rounded-r-none"
        >
          <div className="flex justify-center items-center h-full">
            <img src="https://m.media-amazon.com/images/I/81LspF1zOvL._AC_UF894,1000_QL80_.jpg" alt="Profile Icon" className="h-3/5 w-3/5" />
          </div>
        </CardHeader>

        <CardBody className="flex flex-col justify-between">
            <div className="w-full overflow-hidden">
                <p className="w-full text-[#290005] font-semibold text-xl mb-2">
                    {shelter.shelter_name}
                </p>
                <p className="w-full text-[#ff9447] font-semibold text-sm mb-2">
                    <a href={`mailto:${shelter.contact_email}`} className="hover:underline">
                        {shelter.contact_email}
                    </a>
                </p>
                <p className="w-full text-[#290005] font-medium text-sm mb-2">
                    {shelter.mission_statement}
                </p>
            </div>
            <div>
                <Link to={`/shelters/${shelter.id}`} className="inline-block">
                <Button className="flex items-center gap-1 px-1 py-1">
                    <p className='text-xs'>Learn More</p>
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-3 w-3"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                    </svg>
                </Button>
                </Link>
            </div>
        </CardBody>
      </Card>
    );
}

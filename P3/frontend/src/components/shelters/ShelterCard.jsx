import {
    Card,
    CardHeader,
    CardBody,
  } from "@material-tailwind/react";
import Button from "../inputs/Button";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
   
  export default function ShelterCard({ shelter, loading }) {
    return (
        <>
            {loading ? <Skeleton /> :
                <Card className="w-full xl:flex-row bg-[#FFF8F4]">
                    <CardHeader
                    shadow={false}
                    floated={false}
                    className="m-0 w-2/5 shrink-0 rounded-r-none"
                    >
                    <div className="hidden xl:flex justify-center items-center h-full bg-[#FFF8F4]">
                        <img src="https://i.ebayimg.com/images/g/fTEAAOSwvrBkDaUa/s-l1200.jpg" alt="Profile Icon" className="rounded-xl h-4/5 w-4/5" />
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
                            <p className="w-full text-[#290005] font-semibold text-sm mb-2">
                                {shelter.location}
                            </p>
                            <div className="relative w-full mb-2">
                                <p className="text-[#290005] font-medium text-sm line-clamp-2 overflow-hidden" style={{ height: '3rem' }}> {/* Adjust height as needed */}
                                    {shelter.mission_statement}
                                </p>
                                <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#FFF8F4]"></div> {/* Adjust gradient color */}
                            </div>
                        </div>
                        <div>
                            <Link to={`/shelters/${shelter.id}`} className="inline-block">
                            <Button className="flex items-center gap-1 px-1 py-1">
                                <p className='text-xs'>View {shelter.shelter_name}</p>
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
            }
        </>
    );
}

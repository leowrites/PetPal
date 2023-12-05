import { useState, useEffect } from "react"
import Heading from '../components/layout/Heading';
import ShelterService from "../services/ShelterService";
import ShelterCard from "../components/shelters/ShelterCard";
import ShelterCircularPagination from "../components/shelters/ShelterCircularPagination";

const Shelters = () => {
    const [shelters, setShelters] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const getShelters = async (currPage) => {
            try {
                const response = await ShelterService.getAll(currPage);
                setShelters(response.data.results);
                setTotalPages(Math.ceil(response.data.count / itemsPerPage));
            }
            catch (error) {
                return;
            }
        }
        getShelters(currPage);
    }, [currPage])

    return (
        <div className="container mx-auto mt-10 px-5 sm:px-5 md:px-5 lg:px-20">
            <Heading>
                <h1 className="text-[2rem] font-semibold mb-4">Shelters A-Z</h1>
            </Heading>

            <div className="w-full mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shelters.map(shelter => (
                    <ShelterCard shelter={shelter} />
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <div className="mr-7">
                <ShelterCircularPagination 
                    totalPages={totalPages} 
                    onPageChange={(pageNum) => {
                        setCurrPage(pageNum);
                    }}
                />
                </div>
            </div>
        </div>
    )
}

export default Shelters;
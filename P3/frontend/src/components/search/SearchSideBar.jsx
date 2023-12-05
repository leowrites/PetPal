import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import { FaFilter, FaBuilding } from "react-icons/fa";
import { MdOutlinePets, MdDriveFileRenameOutline } from "react-icons/md";
import SearchTextInput from "./SearchTextInput";
import SearchFilterSelector from "./SearchFilterSelector";
import AgeMultiRange from "./AgeMultiRange";
import PetDetailService from "../../services/PetDetailService";
import { ApiService } from "../../services/ApiService";
import SearchSortSelector from "./SearchSortSelector";
import LoadingSpinner from "../presenter/LoadingSpinner";

export default function SearchSideBar({ setListings, pageRequested, setPageRequested, loading, setLoading }) {
    const [listingStatus, setListingStatus] = useState("available");
    const [petNameInput, setPetNameInput] = useState("");
    const [shelterNameInput, setShelterNameInput] = useState("");
    const [breedInput, setBreedInput] = useState("");
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(20);
    const [nextPageLink, setNextPageLink] = useState(null);
    const [sortValue, setSortValue] = useState("name");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);
            PetDetailService.getPetListings(
                sortValue,
                petNameInput,
                shelterNameInput,
                listingStatus,
                breedInput,
                minAge,
                maxAge
            ).then((response) => {
                setListings(response.data.results);
                setNextPageLink(response.data.next);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
            });
        }, 500);
    
        return () => clearTimeout(timer);
    }, [sortValue, listingStatus, petNameInput, shelterNameInput, breedInput, minAge, maxAge, setLoading, setListings]);

    useEffect(() => {
        if (nextPageLink === null || pageRequested === 1) return;
        setLoading(true);
        ApiService.get(nextPageLink).then((response) => {
            setListings((prevListings) => [...prevListings, ...response.data.results]);
            setNextPageLink(response.data.next);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
        });
    }, [pageRequested, setLoading, setListings, setNextPageLink]);

    return (
        <Card className="w-full max-w-[20rem] p-4 shadow-xl">
            <div className="relative">
                <div className="mb-2 flex items-center gap-4 pt-4">
                    <img src="logo.svg" alt="brand" className="h-8 w-8"/>
                    <h1 className="text-2xl text-[#290005]">
                        Find Your Pal!
                    </h1>
                </div>
                <div className="absolute right-[12.5%] top-[35%]">
                    {loading && <LoadingSpinner />}
                </div>
            </div>
            <div className="flex flex-col p-[1rem] gap-[1rem] justify-start">
                <div className="text-[#290005] mx-[.75rem] text-lg flex flex-row items-center justify-between">
                    <div>Search</div>
                    <SearchSortSelector sortValue={sortValue} setSortValue={setSortValue} />
                </div>
                <SearchTextInput label={"Search by pet name"} value={petNameInput} icon={<MdDriveFileRenameOutline />} onChange={(e) => setPetNameInput(e.target.value)}/>
                <SearchTextInput label={"Search by shelter name"} value={shelterNameInput} icon={<FaBuilding />} onChange={(e) => setShelterNameInput(e.target.value)}/>
                <SearchTextInput label={"Search by breed"} value={breedInput} icon={<MdOutlinePets />} onChange={(e) => setBreedInput(e.target.value)}/>
                <hr className="border-blue-gray-50" />
                <div className="text-[#290005] mx-[.75rem] text-lg flex flex-row justify-between">
                    <div>Filter</div>
                    <FaFilter />
                </div>
                <SearchFilterSelector 
                        options={[
                            {label:'All', value: ''},
                            {label:'Available', value: 'available'},
                            {label:'Unavailable', value: 'not_available'}
                        ]} 
                        label="Listing Status"
                        filterState={listingStatus}
                        setFilterState={setListingStatus}
                        setLoading={setLoading}
                    />
                <AgeMultiRange minVal={minAge} maxVal={maxAge} setMinVal={setMinAge} setMaxVal={setMaxAge} />
            </div>
        </Card>
    );
}

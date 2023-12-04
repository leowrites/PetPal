import React, { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react";
import { FaFilter, FaSearch, FaBuilding } from "react-icons/fa";
import { MdOutlinePets, MdDriveFileRenameOutline } from "react-icons/md";
import SearchTextInput from "./SearchTextInput";
import SearchFilterSelector from "./SearchFilterSelector";
import AgeMultiRange from "./AgeMultiRange";
import PetDetailService from "../../services/PetDetailService";
import { ApiService } from "../../services/ApiService";

export default function SearchSideBar({ setListings, pageRequested, setPageRequested, loading, setLoading }) {
    const [listingStatus, setListingStatus] = useState("available");
    const [petNameInput, setPetNameInput] = useState("");
    const [shelterNameInput, setShelterNameInput] = useState("");
    const [breedInput, setBreedInput] = useState("");
    const [minAge, setMinAge] = useState(0);
    const [maxAge, setMaxAge] = useState(20);
    const [nextPageLink, setNextPageLink] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true);
            PetDetailService.getPetListings(
                '',
                petNameInput,
                shelterNameInput,
                listingStatus,
                breedInput,
                minAge,
                maxAge
            ).then((response) => {
                setListings(response.data);
                setNextPageLink(response.data.next);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
            });
        }, 500);
    
        return () => clearTimeout(timer);
    }, [listingStatus, petNameInput, shelterNameInput, breedInput, minAge, maxAge]);

    useEffect(() => {
        if (nextPageLink === null) return;
        setLoading(true);
        ApiService.get(nextPageLink).then((response) => {
            setListings((prevListings) => [...prevListings, ...response.data.results]);
            setNextPageLink(response.data.next);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
        });
    }, [pageRequested]);

    return (
        <Card className="w-full max-w-[20rem] p-4 shadow-xl">
            <div className="mb-2 flex items-center gap-4 pt-4">
                <img src="logo.svg" alt="brand" className="h-8 w-8"/>
                <h1 className="text-2xl text-[#290005]">
                    Find Your Pal!
                </h1>
            </div>
            <div className="flex flex-col p-[1rem] gap-[1rem] justify-start">
                <div className="text-[#290005] mx-[.75rem] text-lg flex flex-row justify-between">
                    <div>Search</div>
                    <FaSearch />
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

import React from "react";

export default function ListingCard({listing}) {
    return (
        <div class="rounded-[20px]" style={{boxShadow: "0px 7px 22px 0px rgba(0, 0, 0, 0.20)"}}>
            <div class="w-[300px] h-[200px] rounded-[20px]" style={{backgroundImage: "url(/dog_photo1.png)"}}></div>
                <div class="pb-[1rem] pt-[.5rem] px-[.5rem]">
                    <div class="flex flex-row flex-nowrap justify-between items-center">
                        <div class="font-semibold">{listing.name}</div>
                        <div class="text-[.75rem]">Listed {listing.listed_date}</div>
                    </div>
                    <div class="flex flex-row flex-nowrap justify-between items-center text-[#5A2028]">
                        <div class="text-[.625rem]">{listing.shelter.name}</div>
                    <div class="text-[.625rem]">{listing.breed} (Age {listing.age})</div>
                </div>
            </div>
        </div>
    );
};
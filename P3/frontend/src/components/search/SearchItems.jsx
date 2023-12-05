import React from "react";
import SearchListingCard from "./SearchListingCard";

export default function SearchItems({ listings, lastListingElementRef }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.slice(0, listings.length-1).map((listing) => (
                <SearchListingCard listing={listing} key={listing.id} />
            ))}
            <div ref={lastListingElementRef} >
                <SearchListingCard listing={listings[listings.length-1]} key={listings[listings.length-1].id}/>
            </div>
        </div>
    );
};
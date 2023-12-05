import React from "react";
import SearchListingCard from "./SearchListingCard";
import Skeleton from 'react-loading-skeleton'

const SkeletonArray = Array.from({ length: 10 }, (_, i) => <Skeleton className='mr-[20rem] h-[28rem] rounded-lg' key={i} inline />)

export default function SearchItems({ listings, lastListingElementRef, loading }) {

    if (listings.length === 0 && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <div className="text-2xl font-semibold">No listings found</div>
                <div className="text-sm">Try adjusting your search filters</div>
            </div>
        );
    }

    if (listings.length === 0 && loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                {SkeletonArray}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.slice(0, listings.length-1).map((listing) => (
                <SearchListingCard listing={listing} />
            ))}
            <div ref={lastListingElementRef} >
                <SearchListingCard listing={listings[listings.length-1]} />
            </div>
            {loading ? SkeletonArray : null}
        </div>
    );
};
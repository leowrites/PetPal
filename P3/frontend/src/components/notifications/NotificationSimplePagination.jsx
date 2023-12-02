import React from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
 
export default function SimplePagination({ pageNumber, setPageNumber, lastPage, setLoading}) {
 
    const next = () => {
        if (lastPage) return;
        setPageNumber(pageNumber + 1);
        setLoading(true);
    }
    const prev =  () => {
        if (pageNumber === 1) return;
        setPageNumber(pageNumber - 1);
        setLoading(true);
    }
 
    return (
        <div className="flex items-center justify-center gap-6">
        <IconButton
            size="sm"
            variant="text"
            onClick={prev}
            disabled={pageNumber === 1}
        >
            <SlArrowLeft className="h-4 w-4" />
        </IconButton>
        <Typography color="gray" className="font-normal">
            Page <strong className="text-gray-900">{pageNumber}</strong>
        </Typography>
        <IconButton
            size="sm"
            variant="text"
            onClick={next}
            disabled={lastPage}
        >
            <SlArrowRight strokeWidth={2} className="h-4 w-4" />
        </IconButton>
        </div>
    );
}
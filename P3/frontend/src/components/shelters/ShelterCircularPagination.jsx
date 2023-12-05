import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ShelterCircularPagination({ totalPages, onPageChange }) {
    const [activePage, setActivePage] = React.useState(1);

    React.useEffect(() => {
        onPageChange(activePage);
    }, [activePage, onPageChange]);

    const getItemProps = (index) => {
        let activeButtonClass = activePage === index ? "bg-[#FF9447] hover:opacity-[80%] focus:border-2 hover:cursor-pointer transition duration-300 py-[.5rem] rounded-full px-[.5rem]" : "hidden sm:flex";
    
        return {
            variant: "text",
            onClick: () => setActivePage(index),
            className: `rounded-full ${activeButtonClass}`
        };
    };

    const renderPaginationButtons = () => {
        let buttons = [];
        let startPage = Math.max(1, activePage - 2);
        let endPage = Math.min(totalPages, activePage + 2);

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <IconButton key={i} {...getItemProps(i)}>
                    <span className="text-lg text-[#290005]">{i}</span>
                </IconButton>
            );
        }

        return buttons;
    };

    const next = () => {
        if (activePage < totalPages) {
            setActivePage(activePage + 1);
        }
    };

    const prev = () => {
        if (activePage > 1) {
            setActivePage(activePage - 1);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={prev}
                disabled={activePage === 1}
            >
                <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> 
                <p className='text-md hidden sm:block'>Previous</p>
            </Button>
            {renderPaginationButtons()}
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={next}
                disabled={activePage === totalPages}
            >
                <p className='text-md hidden sm:block'>Next</p> 
                <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
}

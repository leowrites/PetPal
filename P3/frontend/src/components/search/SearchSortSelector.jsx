import React from "react";
import {
    Popover,
    PopoverHandler,
    PopoverContent,
    List,
    ListItem,
    IconButton,
    ListItemSuffix,
  } from "@material-tailwind/react";
import { 
    FaSortAlphaDown,
    FaSortAlphaUp,
    FaSortNumericDown,
    FaSortNumericUp 
} from "react-icons/fa";

function getIconBySortValue(sortValue) {
    switch (sortValue) {
        case "name":
            return <FaSortAlphaDown/>;
        case "-name":
            return <FaSortAlphaUp/>;
        case "age":
            return <FaSortNumericDown/>;
        case "-age":
            return <FaSortNumericUp/>;
        default:
            return <FaSortAlphaDown/>;
    }
}

function SearchSortSelector({ sortValue, setSortValue }) {

    return (
        <Popover placement="bottom-end">
            <PopoverHandler>
                <IconButton ripple="light" color="orange" className="text-md ">
                    {getIconBySortValue(sortValue)}
                </IconButton>
            </PopoverHandler>
            <PopoverContent className="p-0">
                <List className="flex flex-col gap-1 p-[.25rem]">
                    <ListItem 
                        selected={["name", "-name"].includes(sortValue)}
                        ripple="light"
                        className="flex flex-row justify-between items-center hover:opacity-80"
                        onClick={() => setSortValue((prev) => prev === "name" ? "-name" : "name" )}>
                        Name
                        <ListItemSuffix>
                            {sortValue === "-name" ? <FaSortAlphaUp/> : <FaSortAlphaDown/>}
                        </ListItemSuffix>
                    </ListItem>
                    <ListItem 
                        selected={["age", "-age"].includes(sortValue)}
                        ripple="light"
                        className="flex flex-row justify-between items-center hover:opacity-80"
                        onClick={() => setSortValue((prev) => prev === "age" ? "-age" : "age" )}>
                        Age
                        <ListItemSuffix>
                            {sortValue === "-age" ? <FaSortNumericUp/> : <FaSortNumericDown/>}
                        </ListItemSuffix>
                    </ListItem>

                </List>
            </PopoverContent>
        </Popover>
    );
}

export default SearchSortSelector;
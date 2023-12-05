import React, { useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";

export default function SearchFilterSelector({ options, label, filterState, setFilterState, setLoading }) {

    return (
        <Select
            id={label}
            onChange={(e) => {
                if (e === filterState) return;
                setFilterState(e);
                setLoading(true);
            }}
            value={filterState}
            color="orange"
            variant="outlined"
            label={label}
            className="relative"
            >
            {options.map((option) => (
                <Option value={option.value}>{option.label}</Option>
            ))}
        </Select>
    );
    }
import React, { useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";

export default function ReadFilterSelector({ readFilter, setReadFilter }) {


    return (
        <Select
        id="readFilter"
        onChange={(e) => {
            setReadFilter(e);
        }}
        value={readFilter}
        color="orange"
        variant="outlined"
        label="Filter"
        >
        <Option value="all">All</Option>
        <Option value="read">Read</Option>
        <Option value="unread" selected>Unread</Option>
        </Select>
    );
    }
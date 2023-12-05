import React from 'react';
import { IoStar } from "react-icons/io5";

const Rating = ({ rating }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars.push(<IoStar color='#ff9447' key={i} />);
        } else {
            stars.push(<IoStar color='#d9d9d9' key={i} />);
        }
    }

    return (
        <div class="text-sm flex item-center gap-1 py-2">
            {stars}
        </div>
    );
};

export default Rating;
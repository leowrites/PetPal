import React, { useState, useEffect } from 'react';
import Rating from './Rating';
import UserDetailService from '../../services/UserDetailService';
import { Avatar } from '@material-tailwind/react'

const Review = ({ review }) => {
    const [reviewUser, setReviewUser] = useState(null);

    useEffect(() => {
        UserDetailService.getPublicById(review.user)
            .then((res) => {
                setReviewUser(res.data);
            })
    }, [review.user]);

    return (
        <div class="review py-4 flex flex-row items-start gap-4">
            {
                reviewUser?.avatar && (
                    <Avatar src={reviewUser?.avatar} alt="profile" className="w-16 h-16" />
                )
            }
            <div className="w-full">
                <div class="flex flex-row justify-between">
                    <p class="text-md font-semibold">{reviewUser?.username}</p>
                    <p class="text-md font-semibold text-[#ff9447]">{(new Date(review.date_created)).toLocaleTimeString('en-US', {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}</p>
                </div>
                <Rating rating={review.rating} />
                <p>
                    {review.text}
                </p>
            </div>
        </div>
    );
};

export default Review;
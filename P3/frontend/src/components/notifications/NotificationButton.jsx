import React from 'react';

export default function NotificationButton() {
    return (
        <div className="bg-[#FF9447] hover:opacity-[80%] focus:border-2 hover:cursor-pointer transition duration-300 py-[.5rem] rounded-full px-[.5rem]" id="notificationButton">
            <img className="w-[2rem] h-[2rem]" src="/notification.svg" alt="notification"/>
        </div>
    )
}
import React from 'react';
import { FaBell } from 'react-icons/fa';

export default function NotificationButton({ newNotifications }) {
    return (
        (newNotifications) ?
        <div className="bg-[#FF9447] hover:opacity-[80%] focus:border-2 hover:cursor-pointer transition duration-300 py-[.5rem] rounded-full px-[.5rem]" id="notificationButton">
            <FaBell className="w-[1.5rem] h-[1.5rem]" color='white'/>
        </div> :
        <div className="bg-[#290005] hover:opacity-[80%] focus:border-2 hover:cursor-pointer transition duration-300 p-[.5rem] rounded-full" id="notificationButton">
            <FaBell className="w-[1.5rem] h-[1.5rem]" color='white'/>
        </div>
    )
}
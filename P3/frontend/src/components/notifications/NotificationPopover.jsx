import React from 'react';
import NotificationButton from './NotificationButton';
import NotificationList from './NotificationList';
import {
    Popover,
    PopoverHandler,
    PopoverContent,
  } from "@material-tailwind/react";

export default function NotificationPopover({ children, notifications }) {
    return (
        <Popover 
            placement="bottom" 
            boxShadow=""
            animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: -25 },
          }}>
            <PopoverHandler>
                <div>
                    <NotificationButton />
                </div>
            </PopoverHandler>
            <PopoverContent className='rounded-md p-[1rem] bg-white shadow-lg'>
                <NotificationList notifications={notifications}/>
            </PopoverContent>
        </Popover>
    )
}
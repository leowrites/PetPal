import React, { useEffect, useState } from 'react';
import NotificationButton from './NotificationButton';
import NotificationList from './NotificationList';
import NotificationSimplePagination from './NotificationSimplePagination';
import ReadFilterSelector from './ReadFilterSelector';
import NotificationService from '../../services/NotificationService';
import {
    Popover,
    PopoverHandler,
    PopoverContent
} from "@material-tailwind/react";

export default function NotificationPopover({ children, notifications }) {

    const [readFilter, setReadFilter] = useState("unread");
    const [pageNumber, setPageNumber] = useState(1);
    const [notificationData, setNotificationData] = useState(notifications);

    useEffect(() => {

    }, [readFilter, pageNumber])

    useEffect(() => {
        console.log(readFilter);
    }, [readFilter]);

    return (
        <Popover 
            placement="bottom" 
            boxShadow=""
            animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: .8, y: -20 },
          }}>
            <div onClick={(e) => {e.stopPropagation()}}>
                <PopoverHandler>
                    <div>
                        <NotificationButton />
                    </div>
                </PopoverHandler>
            </div>
            <PopoverContent>
                <ReadFilterSelector readFilter={readFilter} setReadFilter={setReadFilter} />
                <NotificationList notifications={notifications}/>
                <NotificationSimplePagination pageNumber={pageNumber} setPageNumber={setPageNumber} lastPage={false} />
            </PopoverContent>
        </Popover>
    )
}
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

    const [userHasUnreadNotifications, setUserHasUnreadNotifications] = useState(false);
    const [notificationData, setNotificationData] = useState(notifications);
    const [readFilter, setReadFilter] = useState("unread");
    const [pageNumber, setPageNumber] = useState(1);
    
    useEffect(() => {
        NotificationService.getNotifications(1, "unread")
            .then((response) => {
                setUserHasUnreadNotifications(response.data.count > 0);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    useEffect(() => {
        NotificationService.getNotifications(pageNumber, readFilter)
            .then((response) => {
                setNotificationData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [readFilter, pageNumber])

    if (!notificationData) {
        return (<></>)
    }

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
                <NotificationList notifications={notificationData.results}/>
                <NotificationSimplePagination pageNumber={pageNumber} setPageNumber={setPageNumber} lastPage={(notificationData.next === null)} />
            </PopoverContent>
        </Popover>
    )
}
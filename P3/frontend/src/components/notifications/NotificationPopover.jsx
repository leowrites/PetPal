import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationButton from './NotificationButton';
import NotificationList from './NotificationList';
import NotificationSimplePagination from './NotificationSimplePagination';
import ReadFilterSelector from './ReadFilterSelector';
import NotificationService from '../../services/NotificationService';
import LoadingSpinner from '../presenter/LoadingSpinner';
import {
    Popover,
    PopoverHandler,
    PopoverContent
} from "@material-tailwind/react";

export default function NotificationPopover() {

    const [userHasUnreadNotifications, setUserHasUnreadNotifications] = useState(false);
    const [notificationData, setNotificationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [readFilter, setReadFilter] = useState("unread");
    const [pageNumber, setPageNumber] = useState(1);
    const navigate = useNavigate();
    const popoverButton = useRef(null);

    useEffect(() => {setPageNumber(1)}, [readFilter])

    useEffect(() => {
        NotificationService.getNotifications(pageNumber, readFilter)
            .then((response) => {
                if (readFilter === "unread") setUserHasUnreadNotifications(response.data.count > 0);
                setNotificationData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [readFilter, pageNumber, reload])



    const deleteNotification = (notificationId) => {
        setLoading(true);
        NotificationService.deleteNotification(notificationId)
            .then((response) => {
                NotificationService.getNotifications(pageNumber, readFilter)
                    .then((response) => {
                        setNotificationData(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log(error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }

    const createNotificationClickHandler = (notification) => 
        (e) => {
            if (loading) return;
            setLoading(true);
            NotificationService.getNotification(notification.id)
                .then((response) => {
                    popoverButton.current.click();
                    setReload((prev) => !prev);
                    if (response.data.type === "applicationMessage") {navigate(`/applications/${response.data.applicationId}/comments`);}
                    else if (response.data.type === "applicationStatusChange") {navigate(`/applications/${response.data.applicationId}`);}
                    else if (response.data.type === "application") {navigate(`/applications/${response.data.applicationId}`);}
                    else if (response.data.type === "petListing") {navigate(`/listings/${response.data.listingId}`);}
                    else if (response.data.type === "review") {navigate(`/shelters/${response.data.shelterId}/reviews`);}
                })
                .catch((error) => {
                    console.log(error);
                })
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
                <PopoverHandler ref={popoverButton}>
                    <div>
                        <NotificationButton newNotifications={userHasUnreadNotifications} />
                    </div>
                </PopoverHandler>
            </div>
            <PopoverContent>
                {notificationData ? 
                    (<>
                        <ReadFilterSelector readFilter={readFilter} setReadFilter={setReadFilter} setLoading={setLoading} />
                        {(notificationData.count !== 0) ?
                            <NotificationList 
                                notifications={notificationData.results} 
                                createNotificationClickHandler={createNotificationClickHandler}
                                deleteNotification={deleteNotification}
                                loading={loading}
                            />: 
                            <div className='p-[1rem]'>There are no {readFilter !== "all" ? readFilter : ''} notifications</div>
                        }
                        <div className='relative'>
                            <NotificationSimplePagination 
                                pageNumber={pageNumber} 
                                setPageNumber={setPageNumber} 
                                lastPage={(notificationData.count / 10) <= pageNumber}
                                loading={loading}
                                setLoading={setLoading}
                            />
                            {loading ? 
                                <div className='absolute bottom-[40%] right-0'>
                                    <LoadingSpinner /> 
                                </div>
                            : <></>}
                        </div>
                    </>
                ): <>
                </> } 
                
                
            </PopoverContent>
        </Popover>
    )
}
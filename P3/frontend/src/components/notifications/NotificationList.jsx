import React from "react";
import {
    List,
    ListItem,
    ListItemSuffix,
    IconButton
} from "@material-tailwind/react";
import { FaCircle, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationService from "../../services/NotificationService";

export default function NotificationList({ notifications, deleteNotification, popoverButton, setReload }) {
    const navigate = useNavigate();
    
    const createNotificationClickHandler = (notification) => 
        (e) => {
            popoverButton.current.click();
            navigate('/')
            NotificationService.getNotification(notification.id)
                .then((response) => {
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
        <List>
            {notifications.map((notification) => (
                <ListItem key={notification.id} selected={false} className="h-[3rem] w-[20rem]" onClick={createNotificationClickHandler(notification)}>
                        {notification.message}
                        <ListItemSuffix>
                            <div className="flex flex-row items-center">
                                {!notification.read ? 
                                    <FaCircle color="orange" className="mr-[.5rem]"/> : 
                                    <></>
                                }
                                <IconButton variant="text" onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);}}>
                                    <FaRegTrashAlt />
                                </IconButton>
                            </div>
                        </ListItemSuffix>
                </ListItem>
            ))}
        </List>
    )
}

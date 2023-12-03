import React from "react";
import {
    List,
    ListItem,
    ListItemSuffix,
    IconButton
} from "@material-tailwind/react";
import { FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationService from "../../services/NotificationService";

function TrashIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path
          fillRule="evenodd"
          d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
          clipRule="evenodd"
        />
      </svg>
    );
}

export default function NotificationList({ notifications, deleteNotification, popoverButton, setReload }) {
    const navigate = useNavigate();

    const createNotificationDeleteHandler = (notification) => 
        (e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
        }
    
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
                                <IconButton variant="text" onClick={createNotificationDeleteHandler(notification)}>
                                    <TrashIcon />
                                </IconButton>
                            </div>
                        </ListItemSuffix>
                </ListItem>
            ))}
        </List>
    )
}

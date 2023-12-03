import React from "react";
import {
    List,
    ListItem,
    ListItemSuffix,
    IconButton
} from "@material-tailwind/react";
import { FaCircle, FaRegTrashAlt } from "react-icons/fa";

export default function NotificationList({ notifications, createNotificationClickHandler, deleteNotification, loading}) {
    
    return (
        <List>
            {notifications.map((notification) => (
                <ListItem key={notification.id} disabled={loading} selected={false} className="h-[3rem] w-[20rem]" onClick={createNotificationClickHandler(notification)}>
                        {notification.message}
                        <ListItemSuffix>
                            <div className="flex flex-row items-center">
                                {!notification.read ? 
                                    <FaCircle color="orange" className="mr-[.5rem]"/> : 
                                    <></>
                                }
                                <IconButton variant="text" disabled={loading} onClick={(e) => {
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

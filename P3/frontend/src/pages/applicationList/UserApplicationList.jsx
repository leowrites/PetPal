import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

export default function UserApplicationList() {
    const [applications, setApplications] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();
    return (
        <div>
            <h1>User Application List</h1>
        </div>
    )
}
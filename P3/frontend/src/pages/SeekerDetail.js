import { useState, useEffect } from "react"
import UserDetailService from "../services/UserDetailService"
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Heading from '../components/layout/Heading';
import { useUser } from "../contexts/UserContext"

const SeekerDetail = () => {
    const { user } = useUser()
    const { userId } = useParams()
    const navigate = useNavigate()
    const [viewUser, setViewUser] = useState({})

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        UserDetailService.getById(userId)
            .then(res => {
                setViewUser(res.data)
            })
            .catch(err => {
                navigate('/404')
            })
    }, [userId, navigate])

    return (
        <div className="flex flex-col items-center mt-5">
            <Heading><h1 class="text-[2rem] font-semibold mb-4">{viewUser.username}</h1></Heading>
            {viewUser.avatar && (
                <img 
                    src={viewUser.avatar} 
                    alt={`${viewUser.username}'s avatar`} 
                    className="w-32 h-32 rounded-full object-cover mt-2" // Adjust size as needed
                />
            )}
            <p className="mt-3">{viewUser.email}</p>
        </div>
    )
}

export default SeekerDetail;
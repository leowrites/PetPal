import { useState, useEffect } from "react"
import UserDetailService from "../services/UserDetailService"
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Heading from '../components/layout/Heading';
import { useUser } from "../contexts/UserContext"
import Page from "../components/layout/Page"

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
        <Page>
            <div className="flex flex-col items-center mt-5">
                <Heading><h1 class="text-[2rem] font-semibold mb-4">{viewUser.username}</h1></Heading>
                <img 
                    src={viewUser.avatar ? viewUser.avatar : "https://upload.wikimedia.org/wikipedia/commons/1/18/Mi_villano_Favorito.jpg"}
                    alt={`${viewUser.username ? viewUser.username : "User"}'s avatar`} 
                    className="w-48 h-48 rounded-xl object-contain mt-2">
                </img>
                <p className="mt-3">{viewUser.email}</p>
            </div>
        </Page>
    )
}

export default SeekerDetail;
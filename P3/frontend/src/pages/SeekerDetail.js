import { useState, useEffect } from "react"
import UserDetailService from "../services/UserDetailService"
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Heading from '../components/layout/Heading';
import { useUser } from "../contexts/UserContext"
import Page from "../components/layout/Page"
import Skeleton from "react-loading-skeleton"

const SeekerDetail = () => {
    const { user } = useUser()
    const { userId } = useParams()
    const navigate = useNavigate()
    const [viewUser, setViewUser] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        UserDetailService.getById(userId)
            .then(res => {
                setViewUser(res.data)
                setLoading(false)
            })
            .catch(err => {
                navigate('/404')
            })
    }, [userId, navigate])

    return (
        <Page>
            <div className="flex flex-col items-center mt-5">
                <Heading><h1 class="text-[2rem] font-semibold mb-4">{viewUser.username}</h1></Heading>
                {
                    loading ? <Skeleton /> :
                    <>
                        <img 
                            src={viewUser.avatar ? viewUser.avatar : "/logo.svg"}
                            alt={`${viewUser.username ? viewUser.username : "User"}'s avatar`} 
                            className="w-48 h-48 rounded-xl object-contain mt-2">
                        </img>
                        <p className="mt-6">
                            <a href={`mailto:${viewUser.email}`} className="hover:text-[#ff9447]">
                                {viewUser.email}
                            </a>
                        </p>
                    </>
                }
            </div>
        </Page>
    )
}

export default SeekerDetail;
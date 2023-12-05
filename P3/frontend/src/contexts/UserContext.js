import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAuthToken } from "../services/ApiService";
import UserDetailService from "../services/UserDetailService";

const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage['token'])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        console.log(token)
        if (token) {
            localStorage.setItem('token', token)
            setAuthToken(token)
            UserDetailService.getSelf()
                .then((response) => {
                    setUser(response.data)
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error)
                    localStorage.removeItem('token')
                    setAuthToken(null)
                    setUser(null)
                    setLoading(false)
                })
        }
        else {
            localStorage.removeItem('token')
            setAuthToken(null)
            setUser(null)
            setLoading(false)
        }
    }, [token])

    const contextValue = useMemo(() => {
        return {
            user,
            setUser,
            setToken
        }
    }, [token, user])

    return (
        <UserContext.Provider value={contextValue}>
            {loading ? null : children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);
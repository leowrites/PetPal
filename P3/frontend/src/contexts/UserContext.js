import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAuthToken } from "../services/ApiService";
import UserDetailService from "../services/UserDetailService";

const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage['token'])
    const [user, setUser] = useState(null)
    useEffect(() => {
        console.log(token)
        if (token) {
            setAuthToken(token)
            UserDetailService.getSelf()
                .then((response) => {
                    setUser(response.data)
                })
        }
        else {
            localStorage.removeItem('token')
            setAuthToken(null)
            setUser(null)
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
        <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);
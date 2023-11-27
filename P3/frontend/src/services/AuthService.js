import { ApiService, setAuthToken } from "./ApiService";


class AuthService {
    static async login(username, password) {
        await ApiService.post("/api/token/", {
            username,
            password
        })
            .then(res => {
                const token = res.data.access
                localStorage.setItem("token", token)
                setAuthToken(token)
            })
            .catch(err => {
                console.log(err)
            })
    }
}

export default AuthService;
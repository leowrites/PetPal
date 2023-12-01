import { ApiService, setAuthToken } from "./ApiService";


class AuthService {
    static async login(username, password) {
        return await ApiService.post("/api/token/", {
            username,
            password
        })
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
    }

    static async signup(username, password, password2, email) {
        await ApiService.post("/users/", {
            username,
            password,
            password2,
            email
        })
            .catch(err => {
                throw err
            })
    }

    static async signupShelter(username, password, password2, email, shelterName, contactEmail, location, missionStatement) {
        await ApiService.post("/shelters/", {
            "user_data": {
                "username": username,
                "password": password,
                "password2": password2,
                "email": email
            },
            "shelter_name": shelterName,
            "contact_email": contactEmail,
            location,
            "mission_statement": missionStatement,
        })
            .catch(err => {
                throw err
            })
    }
}

export default AuthService;
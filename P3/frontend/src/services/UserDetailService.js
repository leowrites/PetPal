import { ApiService } from "./ApiService";


class UserDetailService {
    static async getById(id) {
        const response = await ApiService.get(`users/${id}`)
        return response
    }
    static async getSelf() {
        const response = await ApiService.get(`users/`)
        return response
    }
}

export default UserDetailService;
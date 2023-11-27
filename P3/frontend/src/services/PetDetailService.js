import { ApiService, setAuthToken } from "./ApiService";


class PetDetailService {
    static async get(id) {
        const response = await ApiService.get(`/listings/${id}`)
        return response
    }
}

export default PetDetailService;
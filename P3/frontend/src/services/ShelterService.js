import { ApiService } from "./ApiService";

class ShelterService {
    static async getAll() {
        const response = await ApiService.get(`shelters/`)
        return response
    }

    static async getById(id) {
        const response = await ApiService.get(`shelters/${id}`)
        return response
    }

    static async patch(id, data) {
        const response = await ApiService.patch(`shelters/${id}`, data)
        return response
    }
}

export default ShelterService;
import { ApiService } from "./ApiService";


class PetApplicationService {
    static async get(applicationId) {
        const response = await ApiService.get(`/applications/${applicationId}`)
        return response
    }
    static async post(listingId, answers) {
        const response = await ApiService.post(`/listings/${listingId}/applications`, answers)
        return response
    }
    static async list(params) {
        const response = await ApiService.get(`/applications/`, { params })
        return response
    }
    static async update(applicationId, body) {
        const response = await ApiService.patch(`/applications/${applicationId}`, body)
        return response
    }
}

export default PetApplicationService;
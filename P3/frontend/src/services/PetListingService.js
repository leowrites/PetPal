import { ApiService } from "./ApiService";

class PetListingService {
    static async create(shelterId, data) {
        const response = await ApiService.post(`/shelters/${shelterId}/listings`, data)
        return response
    }

    static async getByShelter(shelterId, page) {
        const response = await ApiService.get(`/shelters/${shelterId}/listings?page=${page}`)
        return response
    }

    static async getByParams(params) {
        const response = await ApiService.get(`/listings/`, {params : params})
        return response
    }

    static async update(id, data) {
        const response = await ApiService.patch(`/listings/${id}`, data)
        return response
    }

    static async delete(id) {
        const response = await ApiService.delete(`/listings/${id}`)
        return response
    }
}

export default PetListingService;

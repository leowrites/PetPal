import { ApiService } from "./ApiService";

class PetListingService {
    static async create(shelterId, data) {
        const response = await ApiService.post(`/shelters/${shelterId}/listings`, data)
        return response
    }
    static async update(id, data) {
        const response = await ApiService.patch(`/listings/${id}`, data)
        return response
    }
}

export default PetListingService;

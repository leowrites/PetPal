import { ApiService } from "./ApiService";

class PetListingService {
    static async create(shelterId, data) {
        const response = await ApiService.post(`/shelters/${shelterId}/listings`, data)
        return response
    }
}

export default PetListingService;

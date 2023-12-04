import { ApiService } from "./ApiService";

class PetListingService {
    static async create(
        shelterId,
        name,
        breed,
        age,
        bio,
        medical_history,
        behavior,
        other_notes,
        image,
    ) {
        const response = await ApiService.post(`/shelters/${shelterId}/listings/`, {
            name,
            breed,
            age,
            bio,
            medical_history,
            behavior,
            other_notes,
            image,
        })
        return response
    }
}

export default PetListingService;

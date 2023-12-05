import { ApiService } from "./ApiService";


class PetDetailService {
    static async get(id) {
        const response = await ApiService.get(`/listings/${id}`)
        return response
    }

    static async getPetListings(ordering, name, shelter_name, status, breed, min_age, max_age) {
        const params = {
            ordering: ordering,
            name: name,
            shelter_name: shelter_name,
            status: status,
            breed: breed,
            min_age: min_age,
            max_age: max_age,
        }
        const response = await ApiService.get(
            `/listings/`,
            { params: params }
        )
        return response
    }
}

export default PetDetailService;
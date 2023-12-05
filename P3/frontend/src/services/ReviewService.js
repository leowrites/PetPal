import { ApiService } from "./ApiService";


class ReviewService {
    static async list(shelterId, page) {
        const response = await ApiService.get(`/shelters/${shelterId}/reviews?page=${page}`)
        return response
    }
    static async create(shelterId, review) {
        const response = await ApiService.post(`/shelters/${shelterId}/reviews`, review)
        return response
    }
}

export default ReviewService;
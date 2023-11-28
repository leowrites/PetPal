import { ApiService } from "./ApiService";


class QuestionService {
    static async list() {
        const response = await ApiService.get('/questions/')
        return response
    }
    static async create(question) {
        const response = await ApiService.post('/questions/', question)
        return response
    }
    static async delete(id) {
        const response = await ApiService.delete(`/questions/${id}`)
        return response
    }
}

export default QuestionService;
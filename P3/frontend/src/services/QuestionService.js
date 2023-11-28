import { ApiService } from "./ApiService";


class QuestionService {
    static async list() {
        const response = await ApiService.get('/questions/')
        return response
    }
}

export default QuestionService;
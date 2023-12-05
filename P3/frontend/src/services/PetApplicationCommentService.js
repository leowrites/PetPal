import { ApiService } from "./ApiService";

class PetApplicationCommentService {
    static async list(applicationId) {
        const response = await ApiService.get(`/applications/${applicationId}/comments`);
        return response;
    }
    static async create(applicationId, text) {
        const response = await ApiService.post(
            `applications/${applicationId}/comments`,
            {
                text: text,
            }
            );
        return response;
    }
}

export default PetApplicationCommentService;

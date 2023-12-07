import { ApiService } from "./ApiService";

class ListingQuestionService {
  static async list(listingId) {
    const response = await ApiService.get(`/listings/${listingId}/questions`);
    return response;
  }
  static async get(listingId, listingQuestionId) {
    const response = await ApiService.get(`/listings/${listingId}/questions/${listingQuestionId}`);
    return response;
  }
  static async create(listingId, questionId) {
    const response = await ApiService.post(`/listings/${listingId}/questions`, {
        question: questionId,
    });
    return response;
  }
  static async delete(listingId, listingQuestionId) {
    const response = await ApiService.delete(`/listings/${listingId}/questions/${listingQuestionId}`);
    return response;
  }
  static async update(listingId, listingQuestionId, question) {
    const response = await ApiService.patch(`/listings/${listingId}/questions/${listingQuestionId}`, question);
    return response;
  }
}

export default ListingQuestionService;

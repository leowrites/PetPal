import { ApiService } from "./ApiService";

class NotificationService {
    static async getNotificationList() {
        const response = await ApiService.get(`/notifications/`)
        return response
    }
    static async delete(id) {
        const response = await ApiService.delete(`/notifications/${id}`)
        return response
    }
}
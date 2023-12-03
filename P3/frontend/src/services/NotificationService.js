import { ApiService } from "./ApiService";

class NotificationService {
    static async getNotifications(page, read) {
        const params = {
            page: page,
        }

        if (read !== "all") {
            params.read = (read === "read")
        }

        const response = await ApiService.get(
            `/notifications/`, 
            { params: params }
            )
        return response
    }
    static async deleteNotification(id) {
        const response = await ApiService.delete(`/notifications/${id}`)
        return response
    }
    static async getNotification(id) {
        const response = await ApiService.get(`/notifications/${id}`)
        return response
    }
}

export default NotificationService;
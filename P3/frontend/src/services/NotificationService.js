import { ApiService } from "./ApiService";

class NotificationService {
    static async getNotificationList(pageNumber, Filter) {
        const response = await ApiService.get(`/notifications/`, { params: { pageNumber, Filter } })
        return response
    }
    static async delete(id) {
        const response = await ApiService.delete(`/notifications/${id}`)
        return response
    }
}

export { NotificationService }
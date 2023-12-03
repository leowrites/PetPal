import { ApiService } from "./ApiService";

class NotificationPreferenceService {
    static async get() {
        const response = await ApiService.get(`/notifications/preferences`)
        return response
    }

    static async patch(data) {
        const response = await ApiService.patch('/notifications/preferences', data)
        return response
    }
}

export default NotificationPreferenceService;
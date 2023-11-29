import axiosInstance from "./axiosInstance";


export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else delete axiosInstance.defaults.headers.common["Authorization"];
};

export class ApiService {
    static checkStatus(response) {
        if (response.status >= 400 && response.status < 500) {
            throw new Error(`Client error: ${response.status}`);
        }
        return response;
    }

    static async get(url, config = {}) {
        try {
            const response = await axiosInstance.get(url, config);
            return this.checkStatus(response);
        } catch (error) {
            throw error;
        }
    }

    static async post(url, data, config = {}) {
        try {
            const response = await axiosInstance.post(url, data, config);
            return this.checkStatus(response);
        } catch (error) {
            throw error;
        }
    }

    static async patch(url, data, config = {}) {
        try {
            const response = await axiosInstance.patch(url, data, config);
            return this.checkStatus(response);
        } catch (error) {
            throw error;
        }
    }

    static async delete(url, config = {}) {
        try {
            const response = await axiosInstance.delete(url, config);
            return this.checkStatus(response);
        } catch (error) {
            throw error;
        }
    }
}

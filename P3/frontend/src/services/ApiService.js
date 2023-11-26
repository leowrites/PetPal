import axiosInstance from "./axiosInstance";


export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else delete axiosInstance.defaults.headers.common["Authorization"];
};

export class ApiService {
    static get(url, config = {}) {
        return axiosInstance.get(url, config);
    }

    static post(url, data, config = {}) {
        return axiosInstance.post(url, data, config);
    }

    static patch(url, data, config = {}) {
        return axiosInstance.patch(url, data, config);
    }

    static delete(url, config = {}) {
        return axiosInstance.delete(url, config);
    }
}

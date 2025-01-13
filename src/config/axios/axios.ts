import axios from "axios";
import { RootState, store } from "../../core/store/store";
import toast from "react-hot-toast";
import { logout, updateNewAccessToken } from "../../core/store/slice/userSlice";

const baseURL = "http://34.124.196.11:8080/api/v1/";

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(
  (config) => {
    const state: RootState = store.getState();
    const user = state.user;
    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  const response = await axios.post(`${baseURL}/refresh`, refreshToken);
  const { accessToken } = response.data.data;
  return accessToken;
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const state: RootState = store.getState();
        const user = state.user;
        const newAccessToken = await refreshToken(user.refreshToken);
        store.dispatch(updateNewAccessToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (error) {
        store.dispatch(logout());
        window.location.href = "/login";
        toast.error("Expired Login");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

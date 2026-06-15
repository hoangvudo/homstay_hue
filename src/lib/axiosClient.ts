import axios from 'axios';
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Thêm interceptor để nhét token vào header của mọi request
axiosClient.interceptors.request.use(
  (config) => {
    // Chỉ lấy token nếu đang ở client-side
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (error) {
          console.error("Error parsing user from localStorage", error);
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Thêm interceptor để xử lý lỗi response (ví dụ: 401, 403)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export default axiosClient;

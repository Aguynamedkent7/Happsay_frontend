import axios from 'axios';

const api = axios.create({
  baseURL: 'https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/',
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
    },
  async (error) => {
    // Handle 401 Unauthorized error
    const originalRequest = error.config;

    // If the request is unauthorized, try to refresh the access token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      // If refresh token is available, send a request to refresh the access token
      if (refreshToken) {
        try {
          const response = await axios.post(`https://happsay-backend-dev.ap-southeast-1.elasticbeanstalk.com/token/refresh/`, {
            refresh: refreshToken,
          });

          localStorage.setItem('access_token', response.data.access);

          // Update the Authorization header and retry the original request
          api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          
          return api(originalRequest);
        } catch (err) {
          console.error('Failed to refresh token', err);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/';
        }
      } else {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
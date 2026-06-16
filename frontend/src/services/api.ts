import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理token过期
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` }
          });
          
          const { access_token } = response.data;
          useAuthStore.getState().updateAccessToken(access_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 认证API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  register: (data: {
    username: string;
    password: string;
    role: 'student' | 'teacher';
    name: string;
    no: string;
  }) => api.post('/auth/register', data),
};

// 学生API
export const studentApi = {
  getAvailableCourses: () => api.get('/student/courses'),
  enrollCourse: (courseId: number) =>
    api.post('/student/enroll', { course_id: courseId }),
  getMyCourses: () => api.get('/student/my-courses'),
  getMyScores: () => api.get('/student/scores'),
  getMyStatistics: () => api.get('/student/statistics'),
};

// 教师API
export const teacherApi = {
  getStudents: (params?: { student_no?: string; name?: string }) =>
    api.get('/teacher/students', { params }),
  getMyCourses: () => api.get('/teacher/courses'),
  createCourse: (data: { name: string; description?: string }) =>
    api.post('/teacher/courses', data),
  updateCourse: (courseId: number, data: { name?: string; description?: string }) =>
    api.put(`/teacher/courses/${courseId}`, data),
  getCourseStudents: (courseId: number) =>
    api.get(`/teacher/courses/${courseId}/students`),
  setScores: (courseId: number, scores: { student_id: number; score: number | null }[]) =>
    api.post(`/teacher/courses/${courseId}/scores`, { scores }),
  getCourseStatistics: (courseId: number) =>
    api.get(`/teacher/courses/${courseId}/statistics`),
};

export default api;

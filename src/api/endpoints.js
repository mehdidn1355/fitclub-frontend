import axios from 'axios'

// ============================================
// تنظیمات پایه Axios
// ============================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================
// اینترسپتور برای ارسال توکن (JWT)
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ============================================
// اینترسپتور برای مدیریت خطای 401 (توکن منقضی شده)
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // اگر توکن منقضی شده بود، کاربر را به لاگین بفرست
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ============================================
// ۱. احراز هویت (Auth)
// ============================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

// ============================================
// ۲. کاربران (Users)
// ============================================
export const usersAPI = {
  getTrainers: () => api.get('/users/trainers'),
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  getAll: () => api.get('/users'), // فقط ادمین
}

// ============================================
// ۳. دوره‌ها (Courses)
// ============================================
export const coursesAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getLessons: (id) => api.get(`/courses/${id}/lessons`),
  create: (data) => api.post('/courses', data),
  updateLessonVideo: (lessonId, videoUrl) => api.put(`/courses/lessons/${lessonId}/video`, { video_url: videoUrl }),
}

// ============================================
// ۴. محصولات (Products)
// ============================================
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
}

// ============================================
// ۵. سفارش‌ها (Orders)
// ============================================
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  myOrders: () => api.get('/orders/my'),
  getAll: () => api.get('/orders'), // فقط ادمین
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status?status=${status}`),
}

// ============================================
// ۶. برنامه‌های تمرینی (Plans)
// ============================================
export const plansAPI = {
  // ساخت هوشمند برنامه
  generate: (data) => api.post('/plans/generate', data),
  
  // دریافت یک برنامه خاص (برای صفحه PlanView)
  get: (id) => api.get(`/plans/${id}`),
  
  // دریافت لیست برنامه‌های کاربر (برای صفحه MyPlans)
  my: () => api.get('/plans/my'),
  
  // درخواست برنامه از مربی
  request: (data) => api.post('/plans/request', data),
  
  // دریافت لیست برنامه‌های ارسال شده به مربی (برای پنل مربی)
  incoming: () => api.get('/plans/incoming'),
  
  // آپدیت برنامه توسط مربی
  updateItems: (planId, items) => api.put(`/plans/${planId}/items`, items),
}

// ============================================
// ۷. تغذیه (Nutrition)
// ============================================
export const nutritionAPI = {
  create: (data) => api.post('/nutrition', data),
  my: () => api.get('/nutrition/my'),
  getCustomerPlan: (customerId) => api.get(`/nutrition/customer/${customerId}`),
}

// ============================================
// ۸. حرکات تمرینی (Exercises)
// ============================================
export const exercisesAPI = {
  getAll: (params) => api.get('/exercises', { params }),
  getById: (id) => api.get(`/exercises/${id}`),
  getBodyParts: () => api.get('/exercises/body-parts'),
}

// ============================================
// ۹. آپلود فایل (Upload)
// ============================================
export const uploadAPI = {
  uploadVideo: (formData) => api.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteVideo: (filename) => api.delete(`/videos/${filename}`),
}

// ============================================
// ۱۰. چت‌بات هوشمند (Chat)
// ============================================
export const chatAPI = {
  sendMessage: (data) => api.post('/chat/message', data),
  getHistory: (sessionToken) => api.get(`/chat/history/${sessionToken}`),
  getFaqs: (category) => api.get('/chat/faqs', { params: { category } }),
  getSuggestions: () => api.get('/chat/suggestions'),
  getSupportInfo: () => api.get('/chat/support-info'),
}

// ============================================
// ۱۱. پنل ادمین (Admin)
// ============================================
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getRevenueChart: () => api.get('/admin/reports/revenue'),
  getTopProducts: (limit = 5) => api.get('/admin/reports/top-products', { params: { limit } }),
  getTopTrainers: () => api.get('/admin/reports/top-trainers'),
  getCustomerStats: () => api.get('/admin/reports/customer-stats'),
  getRecentOrders: () => api.get('/admin/orders'),
  createUser: (data, role) => api.post(`/admin/users?role=${role}`, data),
}

// ============================================
// خروجی پیش‌فرض (برای استفاده در صورت نیاز)
// ============================================
// آدرس پایه برای پخش ویدیوهای دوره‌ها
export const VIDEO_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/api/videos/` 
  : 'http://localhost:8000/api/videos/'
  
export default api
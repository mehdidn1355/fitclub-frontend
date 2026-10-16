import client from './client'

// ============ AUTH ============
export const authAPI = {
  register: (data) => client.post('/api/auth/register', data),
  login: (data) => client.post('/api/auth/login', data),
  me: () => client.get('/api/auth/me'),
}

// ============ COURSES ============
export const coursesAPI = {
  list: (params) => client.get('/api/courses', { params }),
  get: (id) => client.get(`/api/courses/${id}`),
  lessons: (id) => client.get(`/api/courses/${id}/lessons`),
  updateLessonVideo: (lessonId, videoUrl) =>
    client.put(`/api/courses/lessons/${lessonId}/video`, {
      video_url: videoUrl,
    }),
}

// ============ PRODUCTS ============
export const productsAPI = {
  list: (params) => client.get('/api/products', { params }),
  get: (id) => client.get(`/api/products/${id}`),
}

// ============ USERS ============
export const usersAPI = {
  trainers: () => client.get('/api/users/trainers'),
  me: () => client.get('/api/users/me'),
  updateMe: (data) => client.put('/api/users/me', data),
}

// ============ ORDERS ============
export const ordersAPI = {
  create: (data) => client.post('/api/orders', data),
  my: () => client.get('/api/orders/my'),
  all: () => client.get('/api/orders'),
}

// ============ ADMIN ============
export const adminAPI = {
  stats: () => client.get('/api/admin/stats'),
  recentOrders: () => client.get('/api/admin/orders'),
  revenueChart: () => client.get('/api/admin/reports/revenue'),
  topProducts: (limit = 5) =>
    client.get('/api/admin/reports/top-products', { params: { limit } }),
  topTrainers: () => client.get('/api/admin/reports/top-trainers'),
  customerStats: () => client.get('/api/admin/reports/customer-stats'),
}

// ============ EXERCISES ============
export const exercisesAPI = {
  list: (params) => client.get('/api/exercises', { params }),
  get: (id) => client.get(`/api/exercises/${id}`),
  bodyParts: () => client.get('/api/exercises/body-parts'),
}

// ============ PLANS ============
export const plansAPI = {
  request: (data) => client.post('/api/plans/request', data),
  create: (data) => client.post('/api/plans', data),
  my: () => client.get('/api/plans/my'),
  get: (id) => client.get(`/api/plans/${id}`),
  incoming: () => client.get('/api/plans/incoming'),
  updateItems: (planId, items) =>
    client.put(`/api/plans/${planId}/items`, items),
  suggestedProducts: (id) => client.get(`/api/plans/${id}/suggested-products`),
}

// ============ NUTRITION ============
export const nutritionAPI = {
  create: (data) => client.post('/api/nutrition', data),
  my: () => client.get('/api/nutrition/my'),
  customer: (customerId) =>
    client.get(`/api/nutrition/customer/${customerId}`),
}

// ============ UPLOAD ============
export const uploadAPI = {
  video: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return client.post('/api/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    })
  },
  deleteVideo: (filename) => client.delete(`/api/videos/${filename}`),
}

// Base URL برای ویدئوها
export const VIDEO_BASE_URL = 'http://127.0.0.1:8000'

// ============ CHAT ============
export const chatAPI = {
  sendMessage: (data) => client.post('/api/chat/message', data),
  history: (sessionToken) =>
    client.get(`/api/chat/history/${sessionToken}`),
  suggestions: () => client.get('/api/chat/suggestions'),
  supportInfo: () => client.get('/api/chat/support-info'),
  faqs: (category) =>
    client.get('/api/chat/faqs', { params: { category } }),
}
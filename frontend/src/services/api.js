import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token to every request (prioritize based on request path)
api.interceptors.request.use((config) => {
  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('thanhtdh_token') : null;
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('thanhtdh_user') : null;
  let userToken = null;
  try { userToken = userRaw ? JSON.parse(userRaw)?.state?.token : null; } catch {}

  const url = config.url || '';
  const isUserRoute = 
    url.includes('users') ||
    url.includes('contact') ||
    url.includes('quote') ||
    url.includes('consult');

  const token = isUserRoute ? (userToken || adminToken) : (adminToken || userToken);
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (typeof window !== 'undefined' && url !== '/debug-log') {
    window.fetch('/api/debug-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'request',
        url,
        isUserRoute,
        userToken: userToken ? (userToken.substring(0, 15) + '...') : null,
        adminToken: adminToken ? (adminToken.substring(0, 15) + '...') : null,
        finalToken: token ? (token.substring(0, 15) + '...') : null
      })
    }).catch(() => {});
  }

  return config;
});

// Handle 401 & 403 - auto logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      const url = err.config?.url || '';
      const method = (err.config?.method || '').toLowerCase();
      
      const isUserRoute = 
        url.includes('users/me') ||
        url.includes('users/login') ||
        url.includes('users/register') ||
        url.includes('users/google') ||
        url.includes('users/facebook') ||
        url.includes('users/change-password') ||
        url.includes('users/history');

      const isUserAuthAttempt = 
        url.includes('users/login') ||
        url.includes('users/register') ||
        url.includes('users/google') ||
        url.includes('users/facebook');

      if (isUserAuthAttempt) {
        // Do not redirect anywhere when user login/register/google fails
        return Promise.reject(err);
      }

      const isAdminRequest = 
        url.includes('/admin') ||
        url.includes('/auth') ||
        url.includes('/all') ||
        url.includes('/upload') ||
        (url.includes('users') && !isUserRoute) ||
        (url.includes('contact') && method === 'get') ||
        ((method === 'post' || method === 'put' || method === 'delete') &&
         (url.includes('banners') ||
          url.includes('services') ||
          url.includes('projects') ||
          url.includes('products') ||
          url.includes('courses') ||
          url.includes('partners') ||
          url.includes('company')));

      if (isUserRoute && !isUserAuthAttempt) {
        localStorage.removeItem('thanhtdh_user');
        window.location.href = '/login';
      } else if (isAdminRequest) {
        localStorage.removeItem('thanhtdh_token');
        localStorage.removeItem('thanhtdh_admin');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// Public API calls
export const getBanners = () => api.get('/banners').then(r => r.data.data);
export const getServices = () => api.get('/services').then(r => r.data.data);
export const getServiceBySlug = (slug) => api.get(`/services/${slug}`).then(r => r.data.data);
export const submitConsultation = (slug, data) => api.post(`/services/${slug}/consult`, data).then(r => r.data);
export const getProjects = (params) => {
  const cleanParams = (params && typeof params === 'object' && !params.queryKey) ? params : undefined;
  return api.get('/projects', { params: cleanParams }).then(r => r.data.data);
};
export const getProjectBySlug = (slug) => api.get(`/projects/${slug}`).then(r => r.data.data);
export const getProducts = (params) => api.get('/products', { params }).then(r => r.data.data);
export const getProductBySlug = (slug) => api.get(`/products/${slug}`).then(r => r.data.data);
export const submitQuote = (slug, data) => api.post(`/products/${slug}/quote`, data).then(r => r.data);
export const getCourses = (params) => api.get('/courses', { params }).then(r => r.data.data);
export const getCourseBySlug = (slug) => api.get(`/courses/${slug}`).then(r => r.data.data);
export const submitCourseQuote = (slug, data) => api.post(`/courses/${slug}/quote`, data).then(r => r.data);
export const getCompany = () => api.get('/company').then(r => r.data.data);
export const getPartners = () => api.get('/partners').then(r => r.data.data);
export const submitContact = (data) => api.post('/contact', data).then(r => r.data);

// Admin API
export const adminLogin = (data) => api.post('/auth/login', data).then(r => r.data);
export const getMe = () => api.get('/auth/me').then(r => r.data.admin);
export const getDashboard = () => api.get('/admin/dashboard').then(r => r.data.data);

export const adminGetBanners = () => api.get('/banners/all').then(r => r.data.data);
export const adminCreateBanner = (data) => api.post('/banners', data).then(r => r.data);
export const adminUpdateBanner = (id, data) => api.put(`/banners/${id}`, data).then(r => r.data);
export const adminDeleteBanner = (id) => api.delete(`/banners/${id}`).then(r => r.data);

export const adminGetServices = () => api.get('/services/admin/all').then(r => r.data.data);
export const adminCreateService = (data) => api.post('/services', data).then(r => r.data);
export const adminUpdateService = (id, data) => api.put(`/services/${id}`, data).then(r => r.data);
export const adminDeleteService = (id) => api.delete(`/services/${id}`).then(r => r.data);

export const adminGetProjects = () => api.get('/projects/admin/all').then(r => r.data.data);
export const adminCreateProject = (data) => api.post('/projects', data).then(r => r.data);
export const adminUpdateProject = (id, data) => api.put(`/projects/${id}`, data).then(r => r.data);
export const adminDeleteProject = (id) => api.delete(`/projects/${id}`).then(r => r.data);

export const adminGetProducts = () => api.get('/products/admin/all').then(r => r.data.data);
export const adminCreateProduct = (data) => api.post('/products', data).then(r => r.data);
export const adminUpdateProduct = (id, data) => api.put(`/products/${id}`, data).then(r => r.data);
export const adminDeleteProduct = (id) => api.delete(`/products/${id}`).then(r => r.data);

export const adminGetCourses = () => api.get('/courses/admin/all').then(r => r.data.data);
export const adminCreateCourse = (data) => api.post('/courses', data).then(r => r.data);
export const adminUpdateCourse = (id, data) => api.put(`/courses/${id}`, data).then(r => r.data);
export const adminDeleteCourse = (id) => api.delete(`/courses/${id}`).then(r => r.data);

export const adminGetContacts = (params) => api.get('/contact', { params }).then(r => r.data.data);
export const adminUpdateContact = (id, data) => api.put(`/contact/${id}`, data).then(r => r.data);
export const adminDeleteContact = (id) => api.delete(`/contact/${id}`).then(r => r.data);

export const adminGetPartners = () => api.get('/partners/all').then(r => r.data.data);
export const adminCreatePartner = (data) => api.post('/partners', data).then(r => r.data);
export const adminUpdatePartner = (id, data) => api.put(`/partners/${id}`, data).then(r => r.data);
export const adminDeletePartner = (id) => api.delete(`/partners/${id}`).then(r => r.data);

export const adminGetCompany = () => api.get('/company').then(r => r.data.data);
export const adminUpdateCompany = (data) => api.put('/company', data).then(r => r.data);

// IMPORTANT: Do NOT manually set Content-Type for FormData uploads.
// Axios automatically sets 'multipart/form-data' with the correct boundary when it detects FormData.
// Manually setting it omits the boundary, causing multer to fail with a 500 error.
export const uploadFile = (formData) => api.post('/upload', formData, { headers: { 'Content-Type': undefined } }).then(r => r.data);
export const uploadMultiple = (formData) => api.post('/upload/multiple', formData, { headers: { 'Content-Type': undefined } }).then(r => r.data);

// ─── User Auth API ──────────────────────────────────────────────────────────
export const userRegister = (data) => api.post('/users/register', data).then(r => r.data);
export const userLogin = (data) => api.post('/users/login', data).then(r => r.data);
export const userGoogleLogin = (data) => api.post('/users/google', typeof data === 'string' ? { token: data } : data).then(r => r.data);
export const userFacebookLogin = (accessToken) => api.post('/users/facebook', { accessToken }).then(r => r.data);
export const getUserMe = () => {
  if (typeof window !== 'undefined') {
    window.fetch('/api/debug-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'getUserMe_start' })
    }).catch(() => {});
  }
  return api.get('/users/me').then(r => {
    if (typeof window !== 'undefined') {
      window.fetch('/api/debug-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'getUserMe_success', user: r.data?.user })
      }).catch(() => {});
    }
    return r.data.user;
  }).catch(err => {
    if (typeof window !== 'undefined') {
      window.fetch('/api/debug-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'getUserMe_error', message: err.message, status: err.response?.status, data: err.response?.data })
      }).catch(() => {});
    }
    throw err;
  });
};
export const updateUserMe = (data) => api.put('/users/me', data).then(r => r.data);
export const changePassword = (data) => api.put('/users/change-password', data).then(r => r.data);
export const getUserHistory = () => api.get('/users/history').then(r => r.data);

// Admin: user management
export const adminGetUsers = () => api.get('/users').then(r => r.data.data);
export const adminToggleUser = (id) => api.put(`/users/${id}/toggle`).then(r => r.data);


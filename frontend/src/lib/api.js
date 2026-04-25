import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle token refresh
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE}/api/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  requestOTP: (phone) => api.post('/auth/otp/request', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/otp/verify', { phone, otp }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ============================================
// SHIPMENT API
// ============================================

export const shipmentAPI = {
  create: (data) => api.post('/shipments', data),
  getEstimate: (data) => api.post('/shipments/estimate', data),
  getOne: (id) => api.get(`/shipments/${id}`),
  list: (params) => api.get('/shipments', { params }),
  updateStatus: (id, status) => api.patch(`/shipments/${id}/status`, { status }),
  assignDriver: (id, driverId, vehicleId) => api.post(`/shipments/${id}/assign`, { driver_id: driverId, vehicle_id: vehicleId }),
  autoAssign: (id) => api.post(`/shipments/${id}/auto-assign`),
  getStats: () => api.get('/shipments/stats'),
};

// ============================================
// TRACKING API
// ============================================

export const trackingAPI = {
  recordLocation: (tripId, data) => api.post(`/tracking/trip/${tripId}/location`, data),
  getTripLocations: (tripId) => api.get(`/tracking/trip/${tripId}/locations`),
  getCurrentPosition: (tripId) => api.get(`/tracking/trip/${tripId}/position`),
  updateTripStatus: (tripId, status) => api.patch(`/tracking/trip/${tripId}/status`, { status }),
  getActiveTrip: () => api.get('/tracking/active-trip'),
};

// ============================================
// PAYMENT API
// ============================================

export const paymentAPI = {
  createOrder: (shipmentId, method) => api.post('/payments/create-order', { shipment_id: shipmentId, method }),
  verifyPayment: (paymentId, data) => api.post(`/payments/${paymentId}/verify`, data),
  list: (params) => api.get('/payments', { params }),
};

// ============================================
// FLEET API
// ============================================

export const fleetAPI = {
  addVehicle: (data) => api.post('/fleet/vehicles', data),
  listVehicles: (params) => api.get('/fleet/vehicles', { params }),
  updateVehicle: (id, data) => api.put(`/fleet/vehicles/${id}`, data),
  deleteVehicle: (id) => api.delete(`/fleet/vehicles/${id}`),
  assignDriver: (vehicleId, driverId) => api.post(`/fleet/vehicles/${vehicleId}/assign-driver`, { driver_id: driverId }),
  getStats: () => api.get('/fleet/stats'),
};

// ============================================
// DRIVER API
// ============================================

export const driverAPI = {
  toggleOnline: (isOnline) => api.patch('/drivers/status', { is_online: isOnline }),
  updateLocation: (lat, lng) => api.post('/drivers/location', { lat, lng }),
  acceptTrip: (tripId) => api.post(`/drivers/trips/${tripId}/accept`),
  rejectTrip: (tripId, reason) => api.post(`/drivers/trips/${tripId}/reject`, { reason }),
  getEarnings: (period) => api.get('/drivers/earnings', { params: { period } }),
  getTripHistory: (params) => api.get('/drivers/trip-history', { params }),
  uploadKYC: (data) => api.post('/drivers/kyc', data),
};

// ============================================
// PRICING API
// ============================================

export const pricingAPI = {
  getRules: () => api.get('/pricing/rules'),
  updateRule: (id, data) => api.put(`/pricing/rules/${id}`, data),
  estimate: (data) => api.post('/pricing/estimate', data),
};

// ============================================
// ADMIN API
// ============================================

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  listUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  getAllShipments: (params) => api.get('/admin/shipments', { params }),
};

export default api;

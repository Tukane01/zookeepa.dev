/**
 * API Service Layer - Centralized API calls for the frontend
 * All data fetching and manipulation should go through this service
 */

const API_BASE = '/api';

// Helper function to make API requests
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

// ============ AUTH API ============
export const authAPI = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email, password, full_name) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    }),
};

// ============ USERS API ============
export const usersAPI = {
  getProfile: () => apiCall('/users/profile'),
  updateProfile: (data) =>
    apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getAllUsers: () => apiCall('/users'),
};

// ============ PRODUCTS API ============
export const productsAPI = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`),
  create: (data) =>
    apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// ============ ORDERS API ============
export const ordersAPI = {
  getAll: () => apiCall('/orders'),
  getById: (id) => apiCall(`/orders/${id}`),
  getMyOrders: () => apiCall('/orders/my'),
  create: (data) =>
    apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ============ CAREERS API ============
export const careersAPI = {
  getAll: () => apiCall('/careers'),
  getById: (id) => apiCall(`/careers/${id}`),
  create: (data) =>
    apiCall('/careers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/careers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/careers/${id}`, {
      method: 'DELETE',
    }),
};

// ============ EVENTS API ============
export const eventsAPI = {
  getAll: () => apiCall('/events'),
  getById: (id) => apiCall(`/events/${id}`),
  create: (data) =>
    apiCall('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/events/${id}`, {
      method: 'DELETE',
    }),
};

// ============ GALLERY API ============
export const galleryAPI = {
  getAll: () => apiCall('/gallery'),
  getById: (id) => apiCall(`/gallery/${id}`),
  create: (data) =>
    apiCall('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/gallery/${id}`, {
      method: 'DELETE',
    }),
};

// ============ PARTNERS API ============
export const partnersAPI = {
  getAll: () => apiCall('/partners'),
  getById: (id) => apiCall(`/partners/${id}`),
  create: (data) =>
    apiCall('/partners', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/partners/${id}`, {
      method: 'DELETE',
    }),
};

// ============ TEAM API ============
export const teamAPI = {
  getAll: () => apiCall('/team'),
  getById: (id) => apiCall(`/team/${id}`),
  create: (data) =>
    apiCall('/team', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/team/${id}`, {
      method: 'DELETE',
    }),
};

// ============ PROMOTIONS API ============
export const promotionsAPI = {
  getAll: () => apiCall('/promotions'),
  getById: (id) => apiCall(`/promotions/${id}`),
  create: (data) =>
    apiCall('/promotions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/promotions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    apiCall(`/promotions/${id}`, {
      method: 'DELETE',
    }),
};

// ============ SITE SETTINGS API ============
export const siteSettingsAPI = {
  getAll: () => apiCall('/site-settings'),
  getById: (id) => apiCall(`/site-settings/${id}`),
  create: (data) =>
    apiCall('/site-settings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    apiCall(`/site-settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export default {
  authAPI,
  usersAPI,
  productsAPI,
  ordersAPI,
  careersAPI,
  eventsAPI,
  galleryAPI,
  partnersAPI,
  teamAPI,
  promotionsAPI,
  siteSettingsAPI,
};

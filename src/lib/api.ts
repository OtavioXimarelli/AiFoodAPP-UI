import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

console.log('🌐 API Base URL:', baseURL);
console.log('🌐 Environment:', import.meta.env.MODE);
console.log('🌐 All ENV vars:', import.meta.env);

export const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json"
  },
  // Enable credentials for OAuth2 session-based authentication
  withCredentials: true,
  // Additional settings for production
  validateStatus: function (status) {
    // Accept status codes 200-299 and 401 (to handle properly)
    return (status >= 200 && status < 300) || status === 401;
  }
});

// Utility function to get CSRF token from cookies
export const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => 
    cookie.trim().startsWith('XSRF-TOKEN=')
  );
  
  if (csrfCookie) {
    return decodeURIComponent(csrfCookie.split('=')[1]);
  }
  
  return null;
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to:`, config.url);
    
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
      console.log('🔒 Added CSRF token to request');
    } else {
      console.log('⚠️ No CSRF token found');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    
    // Check if we received HTML instead of JSON
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html') && typeof response.data === 'string') {
      console.warn('⚠️ Received HTML response instead of JSON - likely redirected to login page');
      console.warn('⚠️ Response data preview:', response.data.substring(0, 200));
      // Transform HTML response to indicate authentication failure
      throw new Error('Authentication required - received HTML login page');
    }
    
    return response;
  },
  (error) => {
    console.error('❌ Full error object:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - backend may not be running');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network error - backend may not be running or CORS issue');
      console.error('❌ Check if CORS is properly configured on backend for domain:', window.location.origin);
    } else if (error.response) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}:`, error.response?.data);
      
      // Handle specific error cases
      if (error.response.status === 401) {
        console.log('🔑 Unauthorized - user needs to login');
      } else if (error.response.status === 403) {
        console.log('🔑 Forbidden - user lacks permission');
      } else if (error.response.status >= 500) {
        console.log('🔧 Server error - backend issue');
      }
    } else {
      console.error('❌ Unknown error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Client class
export class ApiClient {
  // Authentication endpoints - these will be proxied through nginx
  async getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response.data;
  }

  async logout() {
    await api.post('/api/auth/logout');
  }

  // Food endpoints - these will be proxied through nginx
  async getFoodItems() {
    const response = await api.get('/api/foods/list');
    return response.data;
  }

  async createFoodItem(foodItem: any) {
    const response = await api.post('/api/foods/create', foodItem);
    return response.data;
  }

  async updateFoodItem(foodItem: any) {
    const response = await api.put('/api/foods/update', foodItem);
    return response.data;
  }

  async deleteFoodItem(id: number) {
    await api.delete(`/api/foods/delete/${id}`);
  }

  // Recipe endpoints - these will be proxied through nginx
  async generateRecipes() {
    const response = await api.get('/api/recipes/gen');
    return response.data;
  }

  async analyzeRecipe(id: number) {
    const response = await api.get(`/api/recipes/analyze/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
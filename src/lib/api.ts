import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

console.log('🌐 API Base URL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json"
  },
  // Enable credentials for OAuth2 session-based authentication
  withCredentials: true
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
      // Transform HTML response to indicate authentication failure
      throw new Error('Authentication required - received HTML login page');
    }
    
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - backend may not be running');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network error - backend may not be running or CORS issue');
    } else {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}:`, error.response?.data);
    }
    
    if (error.response?.status === 401) {
      console.log('🔑 Unauthorized - user needs to login');
    }
    
    return Promise.reject(error);
  }
);

// API Client class
export class ApiClient {
  // Authentication endpoints
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  async logout() {
    await api.post('/auth/logout');
  }

  // Food endpoints
  async getFoodItems() {
    const response = await api.get('/foods/list');
    return response.data;
  }

  async createFoodItem(foodItem: any) {
    const response = await api.post('/foods/create', foodItem);
    return response.data;
  }

  async updateFoodItem(foodItem: any) {
    const response = await api.put('/api/foods/update', foodItem);
    return response.data;
  }

  async deleteFoodItem(id: number) {
    await api.delete(`/foods/delete/${id}`);
  }

  // Recipe endpoints
  async generateRecipes() {
    const response = await api.get('/recipes/gen');
    return response.data;
  }

  async analyzeRecipe(id: number) {
    const response = await api.get(`/recipes/analyze/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
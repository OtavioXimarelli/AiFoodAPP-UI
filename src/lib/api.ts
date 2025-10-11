import axios from 'axios';

// Configuração simplificada: use o valor EXATO da variável de ambiente
const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://api.aifoodapp.site';

// Modo de desenvolvimento para logs detalhados
const isDevelopment = import.meta.env.MODE === 'development';

// Log inicial apenas em desenvolvimento
if (isDevelopment) {
  console.log('🌐 API Base URL:', baseURL);
  console.log('🌐 Environment:', import.meta.env.MODE);
}

export const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
  },
  // Enable credentials for OAuth2 session-based authentication
  withCredentials: true,
  // Additional settings for production
  validateStatus: function (status) {
    // Accept status codes 200-299 and 401 (to handle properly)
    return (status >= 200 && status < 300) || status === 401;
  },
});

// Utility function to get CSRF token from cookies
export const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));

  if (csrfCookie) {
    return decodeURIComponent(csrfCookie.split('=')[1]);
  }

  return null;
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  config => {
    // Log apenas em desenvolvimento e para endpoints não comuns
    const isCommonEndpoint = config.url?.includes('/auth/status');

    if (isDevelopment && !isCommonEndpoint) {
      console.log(`🚀 ${config.method?.toUpperCase()} request to:`, config.url);
    }

    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
      if (isDevelopment && !isCommonEndpoint) {
        console.log('🔒 Added CSRF token to request');
      }
    }

    return config;
  },
  error => {
    if (isDevelopment) {
      console.error('❌ Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  response => {
    const isCommonEndpoint = response.config.url?.includes('/auth/status');

    if (isDevelopment && !isCommonEndpoint) {
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
      );
    }

    // Verificar resposta HTML inesperada (erro de servidor)
    const contentType = response.headers['content-type'];
    if (contentType?.includes('text/html') && typeof response.data === 'string') {
      const htmlData = response.data as string;
      const isServerError =
        htmlData.includes('Whitelabel Error Page') ||
        htmlData.includes('Internal Server Error') ||
        htmlData.includes('status=500');

      if (isServerError) {
        if (isDevelopment) {
          console.error('🔥 Server error page detected in response');
        }
        throw new Error('Server error (500) - The server encountered an error');
      }

      // Para endpoints de autenticação, interpretar HTML como não autenticado
      const isAuthEndpoint = response.config.url?.includes('/auth/');
      if (isAuthEndpoint) {
        response.data = {
          authenticated: false,
          status: 401,
          error: 'Unauthorized',
          message: 'Authentication required',
        };
      } else {
        throw new Error('Authentication required - unexpected HTML response');
      }
    }

    // Normalizar respostas 401 para endpoints de autenticação
    const isAuthEndpoint = response.config.url?.includes('/auth/');
    if (isAuthEndpoint && response.status === 401 && response.data?.status === 401) {
      const isAuthStatusEndpoint = response.config.url?.includes('/auth/status');
      if (isAuthStatusEndpoint) {
        response.data = { authenticated: false };
      }
    }

    return response;
  },
  async error => {
    if (isDevelopment) {
      console.error('❌ API Error:', error.message);
    }

    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');
    const needsRetry =
      error.response?.status === 401 &&
      originalRequest &&
      !isAuthEndpoint &&
      !originalRequest._retry;

    // Tentar refresh do token em caso de 401
    if (needsRetry) {
      if (isDevelopment) {
        console.log('🔄 Token expired, attempting to refresh session...');
      }
      originalRequest._retry = true;

      try {
        await apiClient.refreshToken();
        if (isDevelopment) {
          console.log('🔄 Session refreshed successfully, retrying request');
        }
        return api(originalRequest);
      } catch (refreshError) {
        const refreshErrorStr =
          refreshError instanceof Error ? refreshError.message : String(refreshError);

        // Só redirecionar se for realmente um problema de autenticação
        if (
          refreshErrorStr.includes('401') ||
          refreshErrorStr.includes('403') ||
          refreshErrorStr.includes('Maximum refresh attempts exceeded') ||
          refreshErrorStr.includes('Authentication required')
        ) {
          localStorage.removeItem('is_authenticated');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Logs de erro apenas em desenvolvimento
    if (isDevelopment) {
      if (error.code === 'ECONNABORTED') {
        console.error('❌ Request timeout - backend may not be running');
      } else if (error.code === 'ERR_NETWORK') {
        console.error('❌ Network error - check backend connection and CORS');
      } else if (error.response) {
        console.error(
          `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`
        );

        if (error.response.status === 401) {
          console.log('🔑 Unauthorized - authentication required');
        } else if (error.response.status === 403) {
          console.log('🔑 Forbidden - insufficient permissions');
        } else if (error.response.status >= 500) {
          console.log('� Server error - backend issue');
        }
      }
    }

    return Promise.reject(error);
  }
);

// API Client class
export class ApiClient {
  // Authentication endpoints
  async getCurrentUser() {
    const response = await api.get('/api/auth/me');
    return response.data;
  }

  async getAuthLoginUrl() {
    const response = await api.get('/api/auth/login/google');
    return response.data;
  }

  // Private method for debugging cookies (apenas em desenvolvimento)
  #logCookiesForDebugging() {
    if (!isDevelopment) return;

    const cookies = document.cookie;
    if (!cookies) {
      console.log('🍪 No cookies found');
      return;
    }

    const cookieList = cookies.split(';').map(c => c.trim());
    const sessionCookies = cookieList.filter(
      cookie =>
        cookie.toLowerCase().includes('session') ||
        cookie.toLowerCase().includes('jsessionid') ||
        cookie.toLowerCase().startsWith('remember-me=')
    );

    if (sessionCookies.length > 0) {
      console.log('🍪 Session cookies:', sessionCookies.length);
    }

    const csrfCookie = cookieList.find(cookie => cookie.toLowerCase().includes('xsrf'));
    if (csrfCookie) {
      console.log('🍪 CSRF cookie present');
    }
  }

  // Cache para evitar chamadas repetidas em um curto período de tempo
  #authStatusCache: {
    data: any;
    timestamp: number;
    pending: Promise<any> | null;
  } = {
    data: null,
    timestamp: 0,
    pending: null,
  };

  async getAuthStatus() {
    // Não checar status na página de login
    if (window.location.pathname.includes('/login')) {
      return { authenticated: false };
    }

    // OAuth2 callback permite checagens frescas
    const isOAuth2Callback =
      window.location.pathname.includes('/oauth2/callback') ||
      window.location.pathname.includes('/login/oauth2/code/');

    this.#logCookiesForDebugging();

    // Reusarpromise pendente (exceto em OAuth2 callback)
    if (this.#authStatusCache.pending && !isOAuth2Callback) {
      return this.#authStatusCache.pending;
    }

    // Retornar cache válido (exceto em OAuth2 callback)
    const now = Date.now();
    const cacheAge = now - this.#authStatusCache.timestamp;
    const cacheValidTime = isOAuth2Callback ? 1000 : 10000;

    if (this.#authStatusCache.data && cacheAge < cacheValidTime) {
      if (isDevelopment) {
        console.log(`🔍 Cached auth status (${(cacheAge / 1000).toFixed(1)}s old)`);
      }
      return this.#authStatusCache.data;
    }

    const localAuthFlag = localStorage.getItem('is_authenticated') === 'true';

    try {
      this.#authStatusCache.pending = (async () => {
        if (isDevelopment) {
          console.log('🔍 Checking auth status...');
        }

        try {
          // Delay adicional para OAuth2 callbacks
          if (isOAuth2Callback) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.#logCookiesForDebugging();
          }

          const response = await api.get('/api/auth/status');
          const statusData =
            typeof response.data === 'object' ? response.data : { authenticated: false };

          // Verificar resposta unauthorized padrão
          if (statusData.status === 401 && statusData.error === 'Unauthorized') {
            return { authenticated: false };
          }

          // Inferir autenticação se não explícito
          if (statusData.authenticated === undefined) {
            statusData.authenticated =
              !!statusData.user || !!statusData.username || !!statusData.email;
          }

          // Atualizar cache
          this.#authStatusCache.data = statusData;
          this.#authStatusCache.timestamp = Date.now();

          if (statusData.authenticated) {
            localStorage.setItem('is_authenticated', 'true');
          }

          return statusData;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          const errorResponse = (error as any)?.response?.data;

          const isAuthError =
            (errorResponse && errorResponse.status === 401) ||
            errorMessage.includes('Authentication required');

          if (isAuthError) {
            this.#authStatusCache.data = { authenticated: false };
            this.#authStatusCache.timestamp = now;

            // Tentar refresh se tínhamos flag local
            if (localAuthFlag) {
              try {
                if (isDevelopment) {
                  console.log('🔄 Attempting token refresh...');
                }
                await this.refreshToken();

                const refreshResponse = await api.get('/api/auth/status');
                const refreshStatusData =
                  typeof refreshResponse.data === 'object'
                    ? refreshResponse.data
                    : { authenticated: false };

                this.#authStatusCache.data = refreshStatusData;
                this.#authStatusCache.timestamp = Date.now();

                return refreshStatusData;
              } catch (refreshError) {
                localStorage.removeItem('is_authenticated');
                return { authenticated: false };
              }
            }
          }

          // Usar flag local se disponível
          if (localAuthFlag) {
            return { authenticated: true };
          }

          return { authenticated: false };
        }
      })();

      const result = await this.#authStatusCache.pending;
      this.#authStatusCache.pending = null;
      return result;
    } catch (error) {
      if (isDevelopment) {
        console.error('🔍 Error getting auth status:', error);
      }
      this.#authStatusCache.pending = null;
      return { authenticated: localAuthFlag };
    }
  }

  // Variável para rastrear tentativas de refresh para evitar loops
  #refreshAttempts = 0;
  #lastRefreshTime = 0;
  #refreshPromise: Promise<any> | null = null;

  async refreshToken() {
    // Spring Security OAuth2 gerencia refresh automaticamente via cookies de sessão
    // Este método apenas verifica o status de autenticação atual
    const now = Date.now();

    // Rate limiting (máximo 1x a cada 5 segundos)
    if (now - this.#lastRefreshTime < 5000) {
      if (isDevelopment) {
        console.log('🔄 Rate limiting auth status check');
      }
      return Promise.reject(new Error('Auth status check rate limited'));
    }

    // Reusar promise pendente
    if (this.#refreshPromise) {
      if (isDevelopment) {
        console.log('🔄 Reusing pending auth status check');
      }
      return this.#refreshPromise;
    }

    // Reset contador após 30s
    if (now - this.#lastRefreshTime > 30000) {
      this.#refreshAttempts = 0;
    }

    // Limitar tentativas (máximo 3)
    if (this.#refreshAttempts >= 3) {
      if (isDevelopment) {
        console.error('🔄 Maximum auth check attempts exceeded');
      }
      localStorage.removeItem('is_authenticated');
      return Promise.reject(new Error('Maximum auth check attempts exceeded'));
    }

    this.#refreshAttempts++;
    this.#lastRefreshTime = now;

    try {
      this.#refreshPromise = api
        .get('/api/auth/status')
        .then(response => {
          if (isDevelopment) {
            console.log('🔄 Auth status check successful');
          }

          this.#authStatusCache.data = { authenticated: response.data.authenticated };
          this.#authStatusCache.timestamp = Date.now();
          
          if (response.data.authenticated) {
            localStorage.setItem('is_authenticated', 'true');
          } else {
            localStorage.removeItem('is_authenticated');
          }

          return response.data;
        })
        .catch(error => {
          if (isDevelopment) {
            console.error('🔄 Auth status check failed:', error.message);
          }

          const errorStatus = error.response?.status;
          const errorData = error.response?.data;

          if (
            errorStatus === 401 ||
            errorStatus === 403 ||
            errorData?.status === 401 ||
            errorData?.error === 'Unauthorized'
          ) {
            localStorage.removeItem('is_authenticated');
          }

          throw error;
        })
        .finally(() => {
          this.#refreshPromise = null;
        });

      return await this.#refreshPromise;
    } catch (error) {
      this.#refreshPromise = null;
      throw error;
    }
  }

  async logout() {
    try {
      if (isDevelopment) {
        console.log('🔑 Logging out...');
      }

      await api.post(
        '/api/auth/logout',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Limpar cache
      this.#authStatusCache = {
        data: null,
        timestamp: 0,
        pending: null,
      };

      // Limpar cookies
      const cookiesToClear = ['JSESSIONID', 'remember-me', 'XSRF-TOKEN', 'SESSION'];
      cookiesToClear.forEach(cookieName => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
    } catch (error) {
      if (isDevelopment) {
        console.error('🔑 Logout error:', error);
      }

      // Limpar cache mesmo com erro
      this.#authStatusCache = {
        data: null,
        timestamp: 0,
        pending: null,
      };
    }
  }

  /**
   * Inicia o processo de login OAuth2
   */
  async initiateOAuth2Login(provider: string = 'google') {
    try {
      if (isDevelopment) {
        console.log('🔑 Starting OAuth2 login...');
      }

      sessionStorage.setItem('oauth_login_in_progress', 'true');
      sessionStorage.setItem('oauth_login_started_at', new Date().toISOString());
      localStorage.removeItem('is_authenticated');

      // URL direta do OAuth2 - o baseURL já está configurado corretamente
      const oauthUrl = `${baseURL}/oauth2/authorization/${provider}`;

      if (isDevelopment) {
        console.log('🔑 Redirecting to:', oauthUrl);
      }

      window.location.href = oauthUrl;
    } catch (error) {
      if (isDevelopment) {
        console.error('🔑 OAuth2 error:', error);
      }
      sessionStorage.removeItem('oauth_login_in_progress');
      sessionStorage.removeItem('oauth_login_started_at');
      throw error;
    }
  }

  // Food endpoints
  async getFoodItems() {
    const response = await api.get('/api/foods');
    return response.data;
  }

  async getFoodItem(id: number) {
    const response = await api.get(`/api/foods/${id}`);
    return response.data;
  }

  async createFoodItem(foodItem: any) {
    if (isDevelopment) {
      console.log('🍕 Creating food item:', foodItem);
    }
    const response = await api.post('/api/foods/create', foodItem);
    return response.data;
  }

  async updateFoodItem(foodItem: any) {
    if (isDevelopment) {
      console.log('🔄 Updating food item:', foodItem.id);
    }
    const response = await api.put(`/api/foods/${foodItem.id}`, foodItem);
    return response.data;
  }

  async deleteFoodItem(id: number) {
    await api.delete(`/api/foods/${id}`);
  }

  // Nutrition AI analysis
  async analyzeFoodNutrition(request: { name: string; quantity?: number }) {
    if (isDevelopment) {
      console.log('🤖 Analyzing nutrition:', request);
    }
    const response = await api.post('/api/nutrition/analyze', request);
    return response.data;
  }

  // Recipe endpoints
  async generateRecipes() {
    const response = await api.get('/api/recipes/gen');
    return response.data;
  }

  // NOTE: This endpoint doesn't exist in the backend API
  // The backend only has /api/recipes/gen and /api/recipes/analyze/{id}
  // Keeping this method for potential future implementation
  async getRecipe(id: number) {
    console.warn('⚠️ /api/recipes/{id} endpoint not implemented in backend');
    const response = await api.get(`/api/recipes/${id}`);
    return response.data;
  }

  async analyzeRecipe(id: number) {
    const response = await api.get(`/api/recipes/analyze/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();

# AI Food App - Frontend Developer API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication & Security](#authentication--security)
3. [API Base Configuration](#api-base-configuration)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
6. [Error Handling](#error-handling)
7. [Implementation Examples](#implementation-examples)
8. [WebSocket/Real-time Features](#websocketreal-time-features)

## Overview

The AI Food App is a Spring Boot application that provides food management and AI-powered recipe generation. The backend uses OAuth2 authentication, PostgreSQL database, and integrates with Maritaca AI for recipe generation and nutritional analysis.

### Key Features
- Food item CRUD operations
- AI-powered recipe generation
- Nutritional analysis
- OAuth2 authentication (Google, etc.)
- CORS-enabled for frontend integration

## Authentication & Security

### Authentication Flow
The application uses **OAuth2** with session-based authentication, not JWT tokens as initially planned. The security configuration shows OAuth2 login is the primary authentication method.

### Security Headers
```javascript
// Required headers for authenticated requests
const headers = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Accept': 'application/json'
};
```

### CSRF Protection
CSRF protection is enabled with cookie-based tokens:
```javascript
// Get CSRF token from cookie
function getCsrfToken() {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
}

// Add CSRF token to headers
headers['X-CSRF-TOKEN'] = getCsrfToken();
```

### Authentication Endpoints
```
GET  /oauth2/authorization/{provider}  # Initiate OAuth2 login
GET  /api/auth                        # Get current user info
POST /api/auth/logout                 # Logout user
```

### Credentials & CORS
All requests must include credentials:
```javascript
fetch(url, {
  method: 'GET',
  credentials: 'include', // IMPORTANT: Include cookies
  headers: headers
});
```

## API Base Configuration

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:8080'; // Development
// const API_BASE_URL = 'https://your-domain.com'; // Production
```

### Frontend URL Configuration
The backend expects the frontend URL to be configured in `application.properties`:
```properties
app.frontend.url=http://localhost:3000  # Your frontend URL
```

## Data Models

### FoodItem Model
```typescript
interface FoodItem {
  id?: number;
  name: string;
  quantity: number;
  expiration: string; // ISO date format: "2024-12-31"
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrates?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  foodGroup: FoodGroup;
  tags: string; // Comma-separated values
}

enum FoodGroup {
  FRUITS = "FRUITS",
  VEGETABLES = "VEGETABLES", 
  GRAINS = "GRAINS",
  PROTEIN = "PROTEIN",
  DAIRY = "DAIRY",
  FATS_OILS = "FATS_OILS",
  BEVERAGES = "BEVERAGES",
  SWEETS_SNACKS = "SWEETS_SNACKS"
}
```

### Recipe Model
```typescript
interface Recipe {
  id?: number;
  name: string;
  description: string;
  nutritionalInfo: string[];
  instructions: string[];
  ingredientsList: RecipeIngredient[];
}

interface RecipeIngredient {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
}
```

### User Model
```typescript
interface User {
  id?: number;
  email: string;
  name: string;
  role: string;
}
```

### Validation Requirements
Based on the DTO validation annotations:
- All food item fields marked as `@NotNull` are required
- Authentication fields cannot be empty
- Use client-side validation to match server expectations

## API Endpoints

### Authentication Endpoints

#### Get Current User
```http
GET /api/auth
Content-Type: application/json
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER"
}
```

**Error Responses:**
- `401 Unauthorized` - User not authenticated
- `404 Not Found` - User not found

---

### Food Items Endpoints

#### Create Food Items
```http
POST /api/foods/create
Content-Type: application/json
```

**Request Body:**
```json
[
  {
    "name": "Apple",
    "quantity": 5,
    "expiration": "2024-12-31",
    "calories": 52.0,
    "protein": 0.3,
    "fat": 0.2,
    "carbohydrates": 14.0,
    "fiber": 2.4,
    "sugar": 10.0,
    "sodium": 1.0,
    "foodGroup": "FRUITS",
    "tags": "fresh,organic,red"
  }
]
```

**Response:** `201 Created`
```json
[
  {
    "id": 1,
    "name": "Apple",
    "quantity": 5,
    "expiration": "2024-12-31",
    "calories": 52.0,
    "protein": 0.3,
    "fat": 0.2,
    "carbohydrates": 14.0,
    "fiber": 2.4,
    "sugar": 10.0,
    "sodium": 1.0,
    "foodGroup": "FRUITS",
    "tags": "fresh,organic,red"
  }
]
```

#### Get All Food Items
```http
GET /api/foods/list
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Apple",
    "quantity": 5,
    "expiration": "2024-12-31",
    "calories": 52.0,
    "protein": 0.3,
    "fat": 0.2,
    "carbohydrates": 14.0,
    "fiber": 2.4,
    "sugar": 10.0,
    "sodium": 1.0,
    "foodGroup": "FRUITS",
    "tags": "fresh,organic,red"
  }
]
```

#### Get Food Item by ID
```http
GET /api/foods/list/{id}
```

**Response:** `200 OK` (same structure as above)
**Error:** `404 Not Found` if item doesn't exist

#### Update Food Item
```http
PUT /api/foods/update
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 1,
  "name": "Green Apple",
  "quantity": 3,
  "expiration": "2024-12-31",
  "calories": 52.0,
  "protein": 0.3,
  "fat": 0.2,
  "carbohydrates": 14.0,
  "fiber": 2.4,
  "sugar": 10.0,
  "sodium": 1.0,
  "foodGroup": "FRUITS",
  "tags": "fresh,organic,green"
}
```

**Response:** `200 OK` (updated item)
**Error:** `404 Not Found` with message "The item was not found, please try again and check the item ID"

#### Delete Food Item
```http
DELETE /api/foods/delete/{id}
```

**Response:** `204 No Content` (success)
**Error:** `404 Not Found` with message "Item not found"

---

### Recipe Endpoints

#### Generate Recipe with AI
```http
GET /api/recipes/gen
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Apple Cinnamon Oatmeal",
    "description": "15 minutes",
    "nutritionalInfo": [
      "Calories: 320 kcal",
      "Protein: 8 g",
      "Carbohydrates: 58 g",
      "Fat: 7 g"
    ],
    "instructions": [
      "Heat water in a pot",
      "Add oats and cook for 5 minutes",
      "Add diced apple and cinnamon",
      "Cook for another 3 minutes",
      "Serve hot"
    ],
    "ingredientsList": [
      {
        "id": 1,
        "name": "Oats",
        "quantity": 0.5,
        "unit": "cup"
      },
      {
        "id": 2,
        "name": "Apple",
        "quantity": 1.0,
        "unit": "piece"
      }
    ]
  }
]
```

**Error:** `404 Not Found` if no food items available or generation fails

#### Analyze Recipe Nutrition
```http
GET /api/recipes/analyze/{id}
```

**Response:** `200 OK`
```json
"Esta receita de Aveia com Maçã e Canela oferece um perfil nutricional equilibrado. Com aproximadamente 320 calorias por porção, é uma excelente opção para o café da manhã. Rica em fibras provenientes da aveia e da maçã, ajuda na digestão e saciedade..."
```

**Error:** `404 Not Found` if recipe doesn't exist

---

## Error Handling

### Global Error Responses

The application uses `@RestControllerAdvice` for global error handling:

#### Validation Errors (`400 Bad Request`)
```json
{
  "name": "Name is required",
  "quantity": "Quantity must be positive",
  "expiration": "Expiration date is required"
}
```

#### Authentication Errors (`401 Unauthorized`)
```json
"Invalid username or password"
```

#### Not Found Errors (`404 Not Found`)
```json
"User not found with username: johndoe"
```

#### Server Errors (`500 Internal Server Error`)
Generic server error response - check server logs.

### HTTP Status Codes Used
- `200` - OK (successful GET, PUT requests)
- `201` - Created (successful POST requests)
- `204` - No Content (successful DELETE requests)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (user already exists)
- `500` - Internal Server Error

## Implementation Examples

### React/Next.js Implementation

#### API Client Setup
```javascript
// api/client.js
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      },
      ...options
    };

    // Add CSRF token if available
    const csrfToken = this.getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle different content types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  getCsrfToken() {
    const cookies = document.cookie.split(';');
    const csrfCookie = cookies.find(cookie => 
      cookie.trim().startsWith('XSRF-TOKEN=')
    );
    return csrfCookie ? decodeURIComponent(csrfCookie.split('=')[1]) : null;
  }

  // Food Items API
  async getFoodItems() {
    return this.request('/api/foods/list');
  }

  async createFoodItems(items) {
    return this.request('/api/foods/create', {
      method: 'POST',
      body: JSON.stringify(items)
    });
  }

  async updateFoodItem(item) {
    return this.request('/api/foods/update', {
      method: 'PUT',
      body: JSON.stringify(item)
    });
  }

  async deleteFoodItem(id) {
    return this.request(`/api/foods/delete/${id}`, {
      method: 'DELETE'
    });
  }

  // Recipe API
  async generateRecipe() {
    return this.request('/api/recipes/gen');
  }

  async analyzeRecipe(id) {
    return this.request(`/api/recipes/analyze/${id}`);
  }

  // Auth API
  async getCurrentUser() {
    return this.request('/api/auth');
  }
}

export const apiClient = new ApiClient('http://localhost:8080');
```

#### React Hook Example
```javascript
// hooks/useFoodItems.js
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export const useFoodItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const items = await apiClient.getFoodItems();
      setFoodItems(items);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createFoodItem = async (items) => {
    try {
      const newItems = await apiClient.createFoodItems(items);
      setFoodItems(prev => [...prev, ...newItems]);
      return newItems;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteFoodItem = async (id) => {
    try {
      await apiClient.deleteFoodItem(id);
      setFoodItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  return {
    foodItems,
    loading,
    error,
    refetch: fetchFoodItems,
    createFoodItem,
    deleteFoodItem
  };
};
```

#### Form Validation Example
```javascript
// utils/validation.js
export const validateFoodItem = (item) => {
  const errors = {};
  
  if (!item.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!item.quantity || item.quantity <= 0) {
    errors.quantity = 'Quantity must be positive';
  }
  
  if (!item.expiration) {
    errors.expiration = 'Expiration date is required';
  } else {
    const expirationDate = new Date(item.expiration);
    if (expirationDate < new Date()) {
      errors.expiration = 'Expiration date must be in the future';
    }
  }
  
  if (!item.foodGroup) {
    errors.foodGroup = 'Food group is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

### Vue.js Implementation Example
```javascript
// composables/useApi.js
import { ref, reactive } from 'vue';

export function useApi() {
  const loading = ref(false);
  const error = ref(null);

  const request = async (url, options = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, request };
}
```

## WebSocket/Real-time Features

Currently, the application doesn't implement WebSocket connections. All communication is through REST API endpoints. If you need real-time features, consider:

1. **Polling**: Periodically fetch data using `setInterval`
2. **Server-Sent Events**: For one-way real-time updates
3. **WebSocket**: Would require backend implementation

## Development Tips

### 1. Environment Configuration
Set up environment variables for different stages:
```javascript
// config/environment.js
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080'
  },
  production: {
    API_BASE_URL: 'https://api.yourapp.com'
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

### 2. Error Handling Best Practices
```javascript
// Create a centralized error handler
export const handleApiError = (error, showToast) => {
  if (error.status === 401) {
    // Redirect to login
    window.location.href = '/oauth2/authorization/google';
  } else if (error.status === 404) {
    showToast('Resource not found', 'error');
  } else {
    showToast('Something went wrong. Please try again.', 'error');
  }
};
```

### 3. Loading States
Always show loading states for better UX:
```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await apiClient.createFoodItems(items);
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    setLoading(false);
  }
};
```

### 4. Authentication Flow
```javascript
// Check authentication status on app load
useEffect(() => {
  const checkAuth = async () => {
    try {
      const user = await apiClient.getCurrentUser();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      // Redirect to OAuth login if needed
    }
  };
  
  checkAuth();
}, []);
```

This documentation provides all the technical details needed for frontend development. The API is well-structured with clear data models, comprehensive error handling, and follows REST conventions.
# AI Food App - Frontend

A React-based frontend application for the AI Food App that connects to a Spring Boot backend with OAuth2 authentication.

## Features

- **OAuth2 Authentication**: Secure login with Google
- **Food Inventory Management**: Add, edit, delete, and track food items with expiration dates
- **AI Recipe Generation**: Generate recipes based on your food inventory using AI
- **Nutritional Analysis**: Get detailed nutritional analysis of recipes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** for form handling

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8080`

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-food-app-frontend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Frontend URL (should match backend configuration)
VITE_FRONTEND_URL=http://localhost:5173
```

### 3. Backend Configuration

Make sure your Spring Boot backend is configured with:

```properties
# application.properties
app.frontend.url=http://localhost:5173
```

And CORS is properly configured to allow requests from `http://localhost:5173`.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Backend Integration

This frontend is designed to work with a Spring Boot backend that provides:

### Authentication
- OAuth2 authentication with Google
- Session-based authentication (no JWT tokens)
- CSRF protection with cookies

### API Endpoints
- `GET /api/auth` - Get current user
- `POST /api/auth/logout` - Logout user
- `GET /api/foods/list` - Get all food items
- `POST /api/foods/create` - Create food items
- `PUT /api/foods/update` - Update food item
- `DELETE /api/foods/delete/{id}` - Delete food item
- `GET /api/recipes/gen` - Generate AI recipes
- `GET /api/recipes/analyze/{id}` - Analyze recipe nutrition

### Data Models

The frontend expects the following data structure from the backend:

```typescript
interface FoodItem {
  id?: number;
  name: string;
  quantity: number;
  expiration: string; // ISO date format
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

interface Recipe {
  id?: number;
  name: string;
  description: string;
  nutritionalInfo: string[];
  instructions: string[];
  ingredientsList: RecipeIngredient[];
}
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── shared/         # Shared components (Layout, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
├── services/           # API service functions
└── store/              # Zustand store definitions
```

## Key Features Implementation

### Authentication Flow
1. User clicks "Login with Google"
2. Redirected to backend OAuth2 endpoint
3. After successful authentication, redirected back to frontend
4. Frontend checks authentication status via `/api/auth`
5. User data stored in Zustand store

### Food Management
- Add food items with nutritional information
- Track expiration dates with visual indicators
- Edit and delete existing items
- Categorize by food groups

### Recipe Generation
- Generate recipes based on available food items
- View detailed recipe instructions and ingredients
- Get AI-powered nutritional analysis

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Variables for Production

Update your production environment variables:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_FRONTEND_URL=https://your-frontend-domain.com
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend CORS configuration includes your frontend URL
2. **Authentication Issues**: Verify OAuth2 configuration in backend
3. **API Connection**: Check that `VITE_API_BASE_URL` matches your backend URL

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
VITE_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
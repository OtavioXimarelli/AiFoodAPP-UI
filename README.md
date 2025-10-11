# AI Food App - Frontend

React + TypeScript application for AI-powered food management and recipe generation.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + Shadcn/ui
- Zustand (state management)
- Axios (API client)

## Quick Start

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Format code
bun run format
```

## Environment Configuration

Create `.env` file:

```env
VITE_API_BASE_URL=https://api.aifoodapp.site
```

## Project Structure

```
src/
├── components/     # React components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── lib/            # Utilities & API client
├── services/       # API service layer
├── store/          # Zustand stores
└── styles/         # Global styles
```

## Available Scripts

- `bun run dev` - Start development server on port 8082
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting

## Documentation

- [API Documentation](./ai_food_app_api_docs.md) - Backend API reference

## Features

- OAuth2 authentication (Google)
- Food inventory management
- AI recipe generation
- Nutritional analysis
- Responsive design

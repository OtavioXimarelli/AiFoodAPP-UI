import { useEffect, Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { ClickSparkProvider } from '@/components/ClickSparkProvider';
import { sessionService } from './services/sessionService';
import { LoadingAnimation } from '@/components/ui/animated';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import './utils/logoutDebug'; // Import debug utilities
import { DEV_CONFIG, logDevStatus } from '@/config/dev';
import { DevBypass } from '@/components/shared/DevBypass';

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const OAuth2Callback = lazy(() => import('./pages/OAuth2Callback'));
const DashboardLayout = lazy(() => import('./components/shared/DashboardLayout'));
const ProtectedRoute = lazy(() => import('./components/shared/ProtectedRoute'));
const FoodInventory = lazy(() => import('./pages/dashboard/FoodInventory'));
const RecipeGenerator = lazy(() => import('./pages/dashboard/RecipeGenerator'));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const NutritionInsights = lazy(() => import('./pages/dashboard/NutritionInsights'));
const SavedData = lazy(() => import('./pages/dashboard/SavedData'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if ((error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <LoadingAnimation size="lg" />
      <p className="mt-4 text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

const App = () => {
  // Initialize session service - OTIMIZADO
  useEffect(() => {
    // Usar ref para garantir que só execute uma vez
    const hasInitialized = sessionStorage.getItem('app_initialized');
    
    if (hasInitialized) {
      return; // Já inicializou, não fazer nada
    }

    // Log status de desenvolvimento
    logDevStatus();

    // Apenas limpar marcadores órfãos, sem inicializar sessão automaticamente
    const logoutTimestamp = sessionStorage.getItem('logout_timestamp');
    if (logoutTimestamp) {
      const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);
      if (timeSinceLogout > 30000) {
        sessionStorage.removeItem('logout_in_progress');
        sessionStorage.removeItem('logout_timestamp');
      }
    } else if (sessionStorage.getItem('logout_in_progress') === 'true') {
      sessionStorage.removeItem('logout_in_progress');
    }

    console.log('🚀 App: Application initialized');
    sessionStorage.setItem('app_initialized', 'true');

    // Removido: verificação automática de sessão e polling
    // A sessão será verificada pelo ProtectedRoute quando necessário
  }, []); // Run only once on mount

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <ClickSparkProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Login />} />
                    <Route path="/oauth2/callback" element={<Login />} />
                    <Route path="/login/oauth2/code/google" element={<Login />} />

                    {/* Rotas protegidas do dashboard para usuários normais */}
                    <Route path="/dashboard" element={<ProtectedRoute />}>
                      <Route
                        path=""
                        element={
                          <DashboardLayout>
                            <DashboardHome />
                          </DashboardLayout>
                        }
                      />
                      <Route
                        path="inventory"
                        element={
                          <DashboardLayout>
                            <FoodInventory />
                          </DashboardLayout>
                        }
                      />
                      <Route
                        path="recipes"
                        element={
                          <DashboardLayout>
                            <RecipeGenerator />
                          </DashboardLayout>
                        }
                      />
                      <Route
                        path="nutrition"
                        element={
                          <DashboardLayout>
                            <NutritionInsights />
                          </DashboardLayout>
                        }
                      />
                      <Route
                        path="saved"
                        element={
                          <DashboardLayout>
                            <SavedData />
                          </DashboardLayout>
                        }
                      />
                    </Route>

                    {/* Rotas de desenvolvimento - apenas em localhost */}
                    {DEV_CONFIG.ENABLE_DEV_ACCESS && (
                      <Route
                        path="/dev-dashboard/*"
                        element={
                          <DevBypass>
                            <DashboardLayout>
                              <Routes>
                                <Route index element={<DashboardHome />} />
                                <Route path="inventory" element={<FoodInventory />} />
                                <Route path="recipes" element={<RecipeGenerator />} />
                                <Route path="nutrition" element={<NutritionInsights />} />
                                <Route path="saved" element={<SavedData />} />
                              </Routes>
                            </DashboardLayout>
                          </DevBypass>
                        }
                      />
                    )}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </ClickSparkProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

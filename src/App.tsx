import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuth2Callback from "./pages/OAuth2Callback";
import DashboardLayout from "./components/shared/DashboardLayout";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import FoodInventory from "./pages/dashboard/FoodInventory";
import './utils/logoutDebug'; // Import debug utilities
import RecipeGenerator from "./pages/dashboard/RecipeGenerator";
import DashboardHome from "./pages/dashboard/DashboardHome";
import NutritionInsights from "./pages/dashboard/NutritionInsights";
import SavedData from "./pages/dashboard/SavedData";
import { sessionService } from "./services/sessionService";

const queryClient = new QueryClient();

const App = () => {
  // Initialize session service
  useEffect(() => {
    // Inicializar apenas se não estivermos na página de login ou callback do OAuth2
    const shouldInitSession = !window.location.pathname.includes('/login') && 
                              !window.location.pathname.includes('/oauth2/callback') &&
                              !window.location.pathname.includes('/login/oauth2/code/');
    
    // Flag para controlar se devemos configurar verificações periódicas
    let shouldSetupPeriodicChecks = shouldInitSession;
    
    const initApp = async () => {
      try {
        // Limpar marcadores de logout órfãos no início da aplicação
        const logoutTimestamp = sessionStorage.getItem('logout_timestamp');
        if (logoutTimestamp) {
          const timeSinceLogout = Date.now() - parseInt(logoutTimestamp);
          if (timeSinceLogout > 30000) {
            console.log("🚀 App: Clearing old logout markers on startup");
            sessionStorage.removeItem('logout_in_progress');
            sessionStorage.removeItem('logout_timestamp');
          }
        } else if (sessionStorage.getItem('logout_in_progress') === 'true') {
          // Logout marker sem timestamp = órfão
          console.log("🚀 App: Clearing orphaned logout marker on startup");
          sessionStorage.removeItem('logout_in_progress');
        }
        
        if (!shouldInitSession) {
          console.log("🚀 App: Skipping session initialization on login/callback page");
          return;
        }
        
        console.log("🚀 App: Initializing session service...");
        
        // Verificar se já temos um indicador de sessão estabelecida
        const sessionTimestamp = localStorage.getItem('session_established_at');
        
        // Se já temos uma sessão estabelecida, apenas inicializar em segundo plano
        if (sessionTimestamp) {
          console.log("🚀 App: Found previous session from:", new Date(sessionTimestamp).toLocaleString());
          
          // Inicializar em background sem bloquear
          sessionService.initialize().catch(error => {
            console.error("🚀 App: Background session init failed:", error);
            shouldSetupPeriodicChecks = false;
          });
        } else {
          // Sem sessão anterior, verificar sincronamente
          await sessionService.initialize();
          console.log("🚀 App: Session service initialized successfully");
        }
      } catch (error) {
        console.error("🚀 App: Failed to initialize session service:", error);
        shouldSetupPeriodicChecks = false;
      }
    };
    
    // Inicializar o app
    initApp();
    
    // Configurar verificação periódica mais espaçada (a cada 15 minutos)
    // e apenas se não estivermos em páginas de autenticação
    let refreshInterval: number | null = null;
    
    if (shouldSetupPeriodicChecks) {
      refreshInterval = window.setInterval(() => {
        // Não verificar se estivermos em página de login/oauth
        if (window.location.pathname.includes('/login') || 
            window.location.pathname.includes('/oauth2/callback') ||
            window.location.pathname.includes('/login/oauth2/code/')) {
          return;
        }
        
        console.log("🔄 App: Running periodic session check");
        sessionService.checkPersistentSession().catch(error => {
          console.error("🔄 App: Periodic session check failed:", error);
        });
      }, 15 * 60 * 1000); // 15 minutos
    }
    
    return () => {
      if (refreshInterval !== null) {
        window.clearInterval(refreshInterval);
      }
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth2/callback" element={<OAuth2Callback />} />
              <Route path="/login/oauth2/code/google" element={<OAuth2Callback />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="food" element={<FoodInventory />} />
                  <Route path="recipes" element={<RecipeGenerator />} />
                  <Route path="insights" element={<NutritionInsights />} />
                  <Route path="saved" element={<SavedData />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
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
import RecipeGenerator from "./pages/dashboard/RecipeGenerator";
import DashboardHome from "./pages/dashboard/DashboardHome";
import NutritionInsights from "./pages/dashboard/NutritionInsights";
import { sessionService } from "./services/sessionService";

const queryClient = new QueryClient();

const App = () => {
  // Initialize session service
  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("🚀 App: Initializing session service...");
        
        // Verificar se temos um indicador de sessão estabelecida
        const sessionTimestamp = localStorage.getItem('session_established_at');
        if (sessionTimestamp) {
          console.log("🚀 App: Found previous session from:", new Date(sessionTimestamp).toLocaleString());
        }
        
        // Tentar inicializar o serviço de sessão imediatamente
        await sessionService.initialize();
        console.log("🚀 App: Session service initialized successfully");
        
        // Tentar verificar a sessão persistente
        const hasSession = await sessionService.checkPersistentSession();
        console.log("🚀 App: Persistent session check result:", hasSession ? "authenticated" : "not authenticated");
      } catch (error) {
        console.error("🚀 App: Failed to initialize session service:", error);
      }
    };
    
    // Inicializar o app
    initApp();
    
    // Configurar verificação periódica (a cada 5 minutos)
    const refreshInterval = setInterval(() => {
      console.log("🔄 App: Running periodic session check");
      sessionService.checkPersistentSession().catch(error => {
        console.error("🔄 App: Periodic session check failed:", error);
      });
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(refreshInterval);
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
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="food" element={<FoodInventory />} />
                  <Route path="recipes" element={<RecipeGenerator />} />
                  <Route path="insights" element={<NutritionInsights />} />
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
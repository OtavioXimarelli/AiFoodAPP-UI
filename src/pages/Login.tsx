import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Chrome, Loader2, ChefHat, Sparkles, Lock } from "lucide-react";
import { apiClient } from "@/lib/api";

const Login = () => {
  const { isAuthenticated, redirectToLogin, checkAuthentication } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/dashboard";

  // Check authentication status on mount and redirect if already authenticated
  useEffect(() => {
    // Se já estamos em processo de login via OAuth, não fazer verificação adicional
    const isOauthInProgress = sessionStorage.getItem('oauth_login_in_progress');
    
    // Se já estamos autenticados, redirecionar imediatamente sem verificações adicionais
    if (isAuthenticated) {
      console.log("✅ Login: Already authenticated in global state, redirecting");
      navigate(from, { replace: true });
      return;
    }
    
    // Se estamos em processo de OAuth, não fazer verificações adicionais
    if (isOauthInProgress) {
      console.log("🔄 Login: OAuth login in progress, skipping auth checks");
      return;
    }
    
    const checkAuthStatus = async () => {
      try {
        console.log("🔍 Login: Checking auth status...");
        
        // Verificar se já existe algum marcador local antes de fazer chamadas de API
        const localAuthFlag = localStorage.getItem('is_authenticated') === 'true';
        
        if (localAuthFlag) {
          console.log("✅ Login: Local auth flag found, proceeding with verification");
          await checkAuthentication();
          
          if (isAuthenticated) {
            console.log("✅ Login: Authenticated after check");
            navigate(from, { replace: true });
            return;
          } else {
            console.log("⚠️ Login: Local auth flag was wrong, not authenticated");
          }
        }
        
        // Verificar status de autenticação do servidor apenas se necessário
        const status = await apiClient.getAuthStatus();
        
        if (status && status.authenticated) {
          console.log("✅ Login: Authenticated according to status endpoint");
          await checkAuthentication(); // Obter detalhes do usuário
          navigate(from, { replace: true });
          return;
        }
        
        console.log("ℹ️ Login: Not authenticated, staying on login page");
      } catch (error) {
        console.log("❌ Login: Auth check error", error);
      }
    };
    
    checkAuthStatus();
  }, [isAuthenticated, navigate, from, checkAuthentication]);

  const handleGoogleLogin = () => {
    // Marcar que estamos iniciando o processo de login OAuth
    sessionStorage.setItem('oauth_login_in_progress', 'true');
    // Marcar quando iniciamos o login
    sessionStorage.setItem('oauth_login_started_at', new Date().toISOString());
    redirectToLogin('google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent/5 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-primary/10 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {/* Header section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl mb-6 shadow-lg shadow-primary/20">
            <ChefHat className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Bem-vindo de volta
          </h1>
          
          <p className="text-lg text-muted-foreground mb-4">
            Acesse sua conta e continue criando receitas incríveis com IA
          </p>
          
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <Lock className="w-3 h-3 mr-2" />
            Login Seguro
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/5 animate-scale-in">
          <CardContent className="p-8">
            <Button 
              onClick={handleGoogleLogin}
              className="w-full h-14 text-lg font-semibold bg-white hover:bg-gray-50 text-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              variant="outline"
            >
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm">
                  <Chrome className="h-5 w-5 text-gray-600" />
                </div>
                <span>Entrar com Google</span>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </Button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ao entrar, você concorda com nossos{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  termos de serviço
                </a>{" "}
                e{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  política de privacidade
                </a>
              </p>
            </div>

            {/* Features highlight */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-border/30">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">IA Avançada</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ChefHat className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Receitas Personalizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom text */}
        <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-sm text-muted-foreground">
            Primeira vez aqui? O login com Google já cria sua conta automaticamente! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
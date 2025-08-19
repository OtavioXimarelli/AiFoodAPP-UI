import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Chrome } from "lucide-react";

const Login = () => {
  const { isAuthenticated, redirectToLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGoogleLogin = () => {
    redirectToLogin('google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-background/60 p-4">
      <Card className="w-full max-w-md bg-card/60 backdrop-blur-xl border-border/30 shadow-2xl shadow-black/10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🍽️</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Bem-vindo ao AI Food App
          </CardTitle>
          <p className="text-muted-foreground">
            Entre para gerenciar sua despensa e gerar receitas com IA
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-card hover:bg-card/80 text-foreground border border-border/50 hover:border-border transition-all duration-200 h-12"
            variant="outline"
          >
            <Chrome className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Continuar com Google</span>
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Ao entrar, você concorda com nossos termos de serviço e política de privacidade.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
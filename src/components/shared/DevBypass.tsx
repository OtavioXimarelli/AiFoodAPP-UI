import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { DEV_CONFIG } from "@/config/dev";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";

interface DevBypassProps {
  children: React.ReactNode;
}

export const DevBypass = ({ children }: DevBypassProps) => {
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Se estamos em modo dev e não estamos autenticados, fazer login automático
    if (DEV_CONFIG.BYPASS_AUTH && !isAuthenticated) {
      console.log('🛠️ DevBypass: Fazendo login automático para desenvolvimento');
      setAuth(DEV_CONFIG.MOCK_USER);
    }
  }, [setAuth, isAuthenticated]);

  // Se não estamos em modo dev, não renderizar nada
  if (!DEV_CONFIG.ENABLE_DEV_ACCESS) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner de desenvolvimento */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2">
        <div className="container mx-auto">
          <Alert className="border-yellow-500/30 bg-yellow-500/5">
            <Wrench className="h-4 w-4" />
            <AlertDescription className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30">
                DESENVOLVIMENTO
              </Badge>
              Dashboard disponível para testes locais. Este acesso não estará disponível em produção.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      
      {children}
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ChefHat, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { EnhancedClickSpark } from "@/components/ui/enhanced-click-spark";
import GlassSurface from "@/components/GlassSurface/GlassSurface";

const Header = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  
  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <GlassSurface
        borderRadius={20}
        blur={12}
        opacity={0.15}
        backgroundOpacity={0.85}
        className="w-full shadow-2xl"
      >
        <div className="flex h-16 items-center justify-between px-8">
          <EnhancedClickSpark className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary transition-all duration-300"
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300">
                <ChefHat className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-bold">AI Food App</div>
                <div className="text-xs text-muted-foreground font-normal">Receitas Saudáveis com IA</div>
              </div>
            </Link>
          </EnhancedClickSpark>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <EnhancedClickSpark>
                  <Link to="/login">
                    <Button 
                      size="default"
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline">Entrar</span>
                    </Button>
                  </Link>
                </EnhancedClickSpark>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <EnhancedClickSpark>
                  <Link to="/dashboard">
                    <Button 
                      variant="outline" 
                      size="default"
                      className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200 bg-background/50"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                  </Link>
                </EnhancedClickSpark>
                <EnhancedClickSpark>
                  <Button 
                    variant="outline" 
                    size="default"
                    className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 bg-background/50" 
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sair</span>
                  </Button>
                </EnhancedClickSpark>
              </div>
            )}
          </div>
        </div>
      </GlassSurface>
    </header>
  );
};

export default Header;
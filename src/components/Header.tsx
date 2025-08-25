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
    <header className="fixed top-3 left-3 right-3 z-50 mx-auto max-w-none">
      <GlassSurface
        borderRadius={28}
        blur={23}
        opacity={0.95}
        backgroundOpacity={0.45}
        className="w-full shadow-lg bg-transparent border border-white/5"
      >
        <div className="flex h-12 items-center px-4 sm:h-16 sm:px-6 md:px-12 lg:px-16 xl:px-20 w-full">
          <EnhancedClickSpark className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-4 font-bold text-lg sm:text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary transition-all duration-300"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md hover:shadow-lg transition-all duration-300">
                <ChefHat className="h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground" />
              </div>
              {/* Hide text on very small screens, show from `sm` up */}
              <div className="hidden sm:block">
                <div className="text-xl sm:text-2xl font-bold">AI Food App</div>
                <div className="text-sm text-muted-foreground font-normal">Receitas Saudáveis com IA</div>
              </div>
            </Link>
          </EnhancedClickSpark>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <EnhancedClickSpark>
                  <Link to="/login">
                    <Button 
                      size="default"
                      aria-label="Entrar"
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 px-2 sm:px-6 py-2"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline">Entrar</span>
                    </Button>
                  </Link>
                </EnhancedClickSpark>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <EnhancedClickSpark>
                  <Link to="/dashboard">
                    <Button 
                      variant="outline" 
                      size="default"
                      aria-label="Dashboard"
                      className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200 bg-background/50 border-white/20 px-2 sm:px-6 py-2"
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
                    aria-label="Sair"
                    className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 bg-background/50 border-white/20 px-2 sm:px-6 py-2" 
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sair</span>
                  </Button>
                </EnhancedClickSpark>
              </div>
            )}
            <div className="ml-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </GlassSurface>
    </header>
  );
};

export default Header;
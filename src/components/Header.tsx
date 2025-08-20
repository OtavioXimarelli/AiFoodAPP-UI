import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ChefHat, LogIn, LayoutDashboard, LogOut } from "lucide-react";

const Header = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-in-top">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button 
                    className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Entrar</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200" 
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
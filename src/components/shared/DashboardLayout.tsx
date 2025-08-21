import { ReactNode, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { 
  LogOut, 
  User, 
  ChefHat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import BottomNavigation from "./BottomNavigation";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 dark:to-secondary/10">
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
        "dark:bg-background/90 dark:border-border/40",
        "light:bg-white/90 light:border-border/20",
        mounted && "animate-slide-in-top"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Left side - Logo */}
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 font-bold text-base md:text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary transition-all duration-300 touch-feedback"
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <ChefHat className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                </div>
                <span className="hidden sm:block">AI Food App</span>
              </Link>
            </div>
            
            {/* Right side - Theme toggle, User info and logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              {user && (
                <div className="flex items-center gap-2 md:gap-3">
                  <Avatar className="h-8 w-8 md:h-9 md:w-9 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40 hover:scale-105 cursor-pointer">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-xs md:text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-3 w-3 md:h-4 md:w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout} 
                className="gap-1 md:gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 text-xs md:text-sm px-2 md:px-3"
              >
                <LogOut className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] pb-20 lg:pb-6">
        <div className={cn(
          "container mx-auto px-4 py-4 md:py-6",
          mounted && "animate-fade-in"
        )}>
          {children ?? <Outlet />}
        </div>
      </main>
      
      {/* Bottom Navigation - now the primary navigation */}
      <BottomNavigation />
    </div>
  );
};

export default DashboardLayout;
import { ReactNode, useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { 
  LogOut, 
  Menu, 
  Salad, 
  Sandwich, 
  User, 
  X,
  ChefHat,
  Sparkles,
  Home,
  TrendingUp
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
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    
    // Close sidebar when clicking outside or pressing escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const closeMobileMenu = () => {
    setOpen(false);
  };

  const navigationItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Início",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      to: "/dashboard/food",
      icon: Salad,
      label: "Despensa",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      to: "/dashboard/recipes",
      icon: Sandwich,
      label: "Receitas",
      gradient: "from-orange-500 to-red-500"
    },
    {
      to: "/dashboard/insights",
      icon: TrendingUp,
      label: "Insights",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40",
        "dark:bg-background/70 dark:border-white/10 dark:backdrop-blur-xl",
        "light:bg-white/80 light:border-black/10 light:backdrop-blur-xl",
        mounted && "animate-slide-in-top"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Menu button and Logo */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="lg:hidden hover:bg-primary/10 transition-colors duration-200 touch-feedback press-animation" 
                onClick={() => setOpen(!open)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Alternar menu</span>
              </Button>
              
              <Link
                to="/dashboard"
                className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary transition-all duration-300 touch-feedback"
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <ChefHat className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="hidden sm:block">AI Food App</span>
              </Link>
            </div>
            
            {/* Right side - Theme toggle, User info and logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              {user && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40 hover:scale-105 cursor-pointer">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout} 
                className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200 touch-feedback press-animation ripple"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Desconectar</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeMobileMenu}
          style={{ bottom: '6rem' }} // Keep space for bottom nav
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 z-50 w-80 transform border-r border-white/10 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 transition-transform duration-200 ease-out lg:relative lg:translate-x-0 lg:w-64",
          "dark:bg-background/95 dark:border-white/10",
          "light:bg-white/95 light:border-black/10",
          "top-16 bottom-24 lg:top-0 lg:bottom-0 lg:inset-y-0", // Mobile: space for header and bottom nav
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full",
          mounted && "animate-slide-in-left"
        )}>
          {/* Mobile header - simpler for better performance */}
          <div className="flex h-14 items-center justify-between px-4 lg:hidden border-b border-border/20">
            <span className="font-semibold text-base text-foreground">Menu</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileMenu}
              className="hover:bg-primary/10 transition-colors duration-150 touch-feedback"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation - optimized for performance */}
          <nav className="flex-1 space-y-1 p-4 pt-4 lg:pt-4 overflow-y-auto">
            {navigationItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-150 touch-feedback",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "p-2 rounded-lg transition-colors duration-150",
                      isActive 
                        ? `bg-primary text-primary-foreground` 
                        : "bg-muted/80 group-hover:bg-accent"
                    )}>
                      <item.icon className={cn(
                        "h-4 w-4 transition-transform duration-150",
                        isActive && "animate-spin-once"
                      )} />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border/40 p-4">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="p-1 rounded bg-gradient-to-br from-primary/20 to-primary/10">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <span>Desenvolvido por IA</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] lg:ml-0 pb-24 lg:pb-0">
          <div className={cn(
            "lg:container lg:mx-auto lg:px-4 lg:py-6",
            mounted && "animate-fade-in"
          )}>
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default DashboardLayout;
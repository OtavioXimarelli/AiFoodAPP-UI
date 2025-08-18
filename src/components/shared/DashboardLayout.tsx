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

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
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
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        mounted && "animate-slide-in-top"
      )}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left side - Menu button and Logo */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="lg:hidden hover:bg-primary/10 transition-colors duration-200" 
                onClick={() => setOpen(!open)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Alternar menu</span>
              </Button>
              
              <Link
                to="/dashboard"
                className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary transition-all duration-300"
              >
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <ChefHat className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="hidden sm:block">AI Food App</span>
              </Link>
            </div>
            
            {/* Right side - User info and logout */}
            <div className="flex items-center gap-2 sm:gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
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
                className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
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
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64",
          open ? "translate-x-0" : "-translate-x-full",
          mounted && "animate-slide-in-left"
        )}>
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-4 lg:hidden border-b border-border/40">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
              onClick={closeMobileMenu}
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden sm:block">AI Food App</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileMenu}
              className="hover:bg-primary/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4 pt-6 lg:pt-4">
            {navigationItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-accent/50",
                    isActive 
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {({ isActive }) => (
                  <>
                    <div className={cn(
                      "p-2 rounded-lg transition-all duration-200",
                      isActive 
                        ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                        : "bg-muted group-hover:bg-accent"
                    )}>
                      <item.icon className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
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
        <main className="flex-1 min-h-[calc(100vh-4rem)] lg:ml-0">
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
import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Home, Package, ChefHat, TrendingUp, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

  const baseNavItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Início",
      end: true
    },
    {
      to: "/dashboard/food",
      icon: Package,
      label: "Despensa"
    },
    {
      to: "/dashboard/recipes", 
      icon: ChefHat,
      label: "Receitas"
    },
    {
      to: "/dashboard/insights",
      icon: TrendingUp,
      label: "Insights"
    }
  ];

  // Add admin-only items
  const navItems = isAdmin 
    ? [
        ...baseNavItems,
        {
          to: "/dashboard/saved",
          icon: Save,
          label: "Salvos"
        }
      ]
    : baseNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 lg:hidden shadow-2xl">
      <div className={cn(
        "h-16",
        isAdmin ? "grid grid-cols-5" : "grid grid-cols-4"
      )}>
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all duration-200 relative group touch-feedback",
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full animate-slide-in-top" />
                )}
                
                {/* Icon with glow effect */}
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200 group-hover:scale-110",
                  isActive 
                    ? "bg-primary/10 shadow-lg shadow-primary/20" 
                    : "group-hover:bg-muted/50"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive 
                      ? "text-primary drop-shadow-sm" 
                      : "text-muted-foreground group-hover:text-foreground"
                  )} />
                </div>
                
                {/* Label */}
                <span className={cn(
                  "transition-colors duration-200 leading-none",
                  isActive 
                    ? "text-primary font-semibold" 
                    : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {item.label}
                </span>
                
                {/* Ripple effect on active */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/5 rounded-xl animate-pulse" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      {/* Bottom safe area for mobile devices */}
      <div className="h-safe-area-inset-bottom bg-background/95" />
    </nav>
  );
};

export default BottomNavigation;
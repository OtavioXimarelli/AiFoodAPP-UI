import { NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Home, Package, ChefHat, TrendingUp, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo, useCallback } from "react";
import { ClickSpark } from "@/components/ui/click-spark";

const BottomNavigation = memo(() => {
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
    <nav className="fixed bottom-4 left-4 right-4 z-50 lg:hidden pointer-events-auto">
      <div className="w-full rounded-[18px] border border-white/10 bg-background/80 backdrop-blur-xl px-3 py-2 shadow-2xl">
        <div className={cn(
          "h-14 rounded-md",
          isAdmin ? "grid grid-cols-5" : "grid grid-cols-4"
        )}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-150 relative h-full",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-primary rounded-b-full" />
                  )}

                  <div className={cn("p-1.5 rounded-lg transition-all duration-150", isActive ? "bg-primary/10" : "") }>
                    <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  </div>

                  <span className={cn("text-[11px] leading-none", isActive ? "text-primary font-medium" : "text-muted-foreground")}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      {/* Bottom safe area for mobile devices */}
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;
import { NavLink } from "react-router-dom";
import { Home, Package, ChefHat, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const navItems = [
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-orange" 
                    : "bg-muted"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium truncate">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
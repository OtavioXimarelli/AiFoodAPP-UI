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
    <nav className="fixed bottom-4 left-4 right-4 z-50 safe-area-inset-bottom">
      <div className="bg-card/90 backdrop-blur-xl border border-border/30 rounded-2xl shadow-2xl max-w-sm mx-auto">
        <div className="flex items-center justify-around py-3 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-300 min-w-0 flex-1",
                  isActive 
                    ? "text-primary transform scale-105" 
                    : "text-muted-foreground hover:text-foreground hover:scale-105"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "p-2.5 rounded-xl transition-all duration-300 shadow-sm",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "bg-muted/50 hover:bg-muted"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "text-xs font-medium truncate transition-all duration-200",
                    isActive ? "text-primary" : ""
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
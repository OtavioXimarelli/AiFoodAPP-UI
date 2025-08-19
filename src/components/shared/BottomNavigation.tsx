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
    <nav className="fixed bottom-4 left-4 right-4 z-50 safe-area-bottom animate-slide-in-bottom">
      <div className="bg-card/95 backdrop-blur-xl border border-border/20 rounded-2xl shadow-2xl max-w-sm mx-auto hover:shadow-3xl transition-all duration-300">
        <div className="flex items-center justify-around py-3 px-2">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-300 min-w-0 flex-1 touch-feedback active:scale-95",
                  isActive 
                    ? "text-primary transform scale-105" 
                    : "text-muted-foreground hover:text-foreground hover:scale-102"
                )
              }
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {({ isActive }) => (
                <>
                  <div className={cn(
                    "p-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" 
                      : "bg-muted/50 hover:bg-muted hover:scale-105"
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive ? "animate-spin-once" : ""
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-medium truncate transition-all duration-200",
                    isActive ? "text-primary font-semibold" : ""
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
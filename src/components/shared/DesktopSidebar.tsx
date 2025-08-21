import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home, 
  Package, 
  ChefHat, 
  TrendingUp,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

const DesktopSidebar = () => {
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
          label: "Dados Salvos"
        }
      ]
    : baseNavItems;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-full w-64 flex-col border-r border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 dark:bg-background/90 dark:border-border/40">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary transition-all duration-300"
        >
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>AI Food App</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent/80 hover:text-accent-foreground group touch-feedback",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
                        : "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={cn(
                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          AI Food App v1.0
        </p>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
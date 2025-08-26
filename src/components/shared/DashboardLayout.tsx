import { ReactNode, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { 
  LogOut, 
  User, 
  ChefHat,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import BottomNavigation from "./BottomNavigation";
import DesktopSidebar from "./DesktopSidebar";
import { ThemeToggle } from "./ThemeToggle";
import AppStatusDialog from "./AppStatusDialog";
import Header from "@/components/Header";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const [showAppStatus, setShowAppStatus] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 dark:to-secondary/10">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Mobile Header */}
      <div className={mounted ? "animate-slide-in-top lg:hidden" : "lg:hidden"}>
        <Header
          variant="mobile"
          containerClassName={cn(
          "sticky top-0 z-50 w-full mx-auto max-w-none",
          "border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
          "dark:bg-background/90 dark:border-border/40",
          "light:bg-white/90 light:border-border/20"
        )}
        />
      </div>

      {/* Desktop Header */}
      <div className={mounted ? "animate-slide-in-top hidden lg:block" : "hidden lg:block"}>
        <Header
          variant="desktop"
          containerClassName={cn(
          "fixed top-0 right-0 z-30 w-[calc(100%-16rem)]",
          "border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
          "dark:bg-background/90 dark:border-border/40"
        )}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen pb-28 lg:pb-6 lg:pl-64 lg:pt-20 scrollbar-default">
        <div className={cn(
          "container mx-auto px-4 py-6 lg:px-6",
          mounted && "animate-fade-in"
        )}>
          <div className="mx-auto w-full">
            <div className="w-full rounded-[28px] border border-border/20 bg-background/95 shadow-xl p-4 md:p-6 lg:p-8">
              {children ?? <Outlet />}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      {/* App Status Dialog */}
      <AppStatusDialog 
        open={showAppStatus}
        onOpenChange={setShowAppStatus}
        userName={user?.name}
      />
    </div>
  );
};

export default DashboardLayout;
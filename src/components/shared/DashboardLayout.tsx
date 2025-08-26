import { ReactNode, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import NavigationDock from "./NavigationDock";
import AppStatusDialog from "./AppStatusDialog";
import Header from "@/components/Header";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const [showAppStatus, setShowAppStatus] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
    // First-day login modal: show once per day when user logs in
    const lastShown = localStorage.getItem('app_status_last_shown');
    const today = new Date();
    const todayKey = today.toISOString().slice(0,10); // YYYY-MM-DD
    if (isAuthenticated && lastShown !== todayKey) {
      setShowAppStatus(true);
      localStorage.setItem('app_status_last_shown', todayKey);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 dark:to-secondary/10">
  <Header onInfoClick={() => setShowAppStatus(true)} />
      {/* Main content - Full screen without sidebars */}
      <main className="flex-1 min-h-screen pt-20">
        <div className={cn(
          "container mx-auto px-4 py-6 lg:px-6",
          mounted && "animate-fade-in"
        )}>
          <div className="mx-auto w-full">
            <div className="w-full rounded-[28px] border border-border/20 bg-background/95 shadow-xl p-4 md:p-6 lg:p-8 mb-24">
              {children ?? <Outlet />}
            </div>
          </div>
        </div>
      </main>

  {/* Navigation Dock - centered via component */}
  <NavigationDock />

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
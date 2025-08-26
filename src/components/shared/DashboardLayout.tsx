import { ReactNode, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import NavigationDock from "./NavigationDock";
import AppStatusDialog from "./AppStatusDialog";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const [showAppStatus, setShowAppStatus] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 dark:to-secondary/10">
      {/* Main content - Full screen without sidebars */}
      <main className="flex-1 min-h-screen">
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

      {/* Navigation Dock - Replaces all navigation */}
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
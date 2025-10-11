import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Home, Package, ChefHat, TrendingUp, Save, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppStatusDialog from './AppStatusDialog';
import { ClickSpark } from '@/components/ui/click-spark';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const DesktopSidebar = () => {
  const { user } = useAuth();
  const [showAppStatus, setShowAppStatus] = useState(false);
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'admin';

  const baseNavItems = [
    {
      to: '/dashboard',
      icon: Home,
      label: 'Início',
      end: true,
    },
    {
      to: '/dashboard/food',
      icon: Package,
      label: 'Despensa',
    },
    {
      to: '/dashboard/recipes',
      icon: ChefHat,
      label: 'Receitas',
    },
    {
      to: '/dashboard/insights',
      icon: TrendingUp,
      label: 'Insights',
    },
  ];

  // Add admin-only items
  const navItems = isAdmin
    ? [
        ...baseNavItems,
        {
          to: '/dashboard/saved',
          icon: Save,
          label: 'Dados Salvos',
        },
      ]
    : baseNavItems;

  return (
    <motion.aside
      initial={{ x: -64, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="hidden lg:flex fixed left-0 top-0 z-40 h-full w-64 flex-col border-r border-border/50 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 dark:bg-background/90 dark:border-border/40 shadow-card"
    >
      {/* Logo */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="p-6 border-b border-border/50"
      >
        <ClickSpark count={8} color="hsl(var(--primary))">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary transition-all duration-300"
            >
              <motion.div
                className="p-2 rounded-lg bg-gradient-primary shadow-glow hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <span>AI Food App</span>
            </Link>
          </motion.div>
        </ClickSpark>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-2"
        >
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.to}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                <ClickSpark count={6} color="hsl(var(--primary))">
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gradient-warm hover:text-foreground group touch-feedback relative overflow-hidden',
                        isActive
                          ? 'bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-xl'
                          : 'text-muted-foreground hover:text-foreground hover:shadow-soft'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-3 w-full">
                        <Icon
                          className={cn(
                            'h-5 w-5 transition-all duration-200',
                            isActive
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                        />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute inset-0 bg-gradient-primary rounded-lg -z-10"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </div>
                    )}
                  </NavLink>
                </ClickSpark>
              </motion.li>
            );
          })}
        </motion.ul>
      </nav>

      {/* Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="p-4 border-t border-border/50 bg-gradient-card space-y-3"
      >
        {/* App Status Button */}
        <ClickSpark count={4} color="hsl(var(--primary))">
          <motion.button
            onClick={() => setShowAppStatus(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/90 transition-all duration-200 border border-primary/20 hover:border-primary/30"
          >
            <Info className="h-4 w-4" />
            <span>Status do App</span>
          </motion.button>
        </ClickSpark>

        <motion.p
          className="text-xs text-muted-foreground text-center font-medium"
          whileHover={{ scale: 1.05, color: 'hsl(var(--foreground))' }}
          transition={{ duration: 0.2 }}
        >
          AI Food App v1.0
        </motion.p>
      </motion.div>

      {/* App Status Dialog */}
      <AppStatusDialog open={showAppStatus} onOpenChange={setShowAppStatus} userName={user?.name} />
    </motion.aside>
  );
};

export default DesktopSidebar;

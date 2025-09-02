import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ChefHat, 
  TrendingUp, 
  BookOpen
} from 'lucide-react';
import { Dock } from '@/components/ui/dock';
import { useAuth } from '@/hooks/useAuth';
import { DEV_CONFIG } from '@/config/dev';

const NavigationDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Define base path based on development mode
  const basePath = DEV_CONFIG.ENABLE_DEV_ACCESS ? '/dev-dashboard' : '/dashboard';

  const mainNavigationItems = [
    {
      id: 'home',
      icon: <Home className="w-5 h-5" />,
      label: 'Início',
      href: basePath,
      active: location.pathname === basePath
    },
    {
      id: 'inventory',
      icon: <Package className="w-5 h-5" />,
      label: 'Despensa',
      href: `${basePath}/inventory`,
      active: location.pathname === `${basePath}/inventory`
    },
    {
      id: 'recipes',
      icon: <ChefHat className="w-5 h-5" />,
      label: 'Receitas',
      href: `${basePath}/recipes`,
      active: location.pathname === `${basePath}/recipes`
    },
    {
      id: 'insights',
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Insights',
      href: `${basePath}/nutrition`,
      active: location.pathname === `${basePath}/nutrition`
    },
    {
      id: 'saved',
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Salvos',
      href: `${basePath}/saved`,
      active: location.pathname === `${basePath}/saved`
    }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  // Add navigation handlers to items
  const navigationItems = mainNavigationItems.map(item => ({
    ...item,
    onClick: () => handleNavigation(item.href)
  }));

  return (
    <>
      {/* Main Navigation Dock */}
      <Dock
        items={navigationItems}
        position="bottom"
  className=""
  centerIndex={2}
      />
    </>
  );
};

export default NavigationDock;
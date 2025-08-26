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

const NavigationDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const mainNavigationItems = [
    {
      id: 'home',
      icon: <Home className="w-5 h-5" />,
      label: 'Início',
      href: '/dashboard',
      active: location.pathname === '/dashboard'
    },
    {
      id: 'inventory',
      icon: <Package className="w-5 h-5" />,
      label: 'Despensa',
      href: '/dashboard/food',
      active: location.pathname === '/dashboard/food'
    },
    {
      id: 'recipes',
      icon: <ChefHat className="w-5 h-5" />,
      label: 'Receitas',
      href: '/dashboard/recipes',
      active: location.pathname === '/dashboard/recipes'
    },
    {
      id: 'insights',
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Insights',
      href: '/dashboard/insights',
      active: location.pathname === '/dashboard/insights'
    },
    {
      id: 'saved',
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Salvos',
      href: '/dashboard/saved',
      active: location.pathname === '/dashboard/saved'
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
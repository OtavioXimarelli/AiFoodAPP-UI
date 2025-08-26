import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ChefHat, 
  TrendingUp, 
  BookOpen,
  User,
  LogOut,
  Settings
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
      href: '/dashboard/food-inventory',
      active: location.pathname === '/dashboard/food-inventory'
    },
    {
      id: 'recipes',
      icon: <ChefHat className="w-5 h-5" />,
      label: 'Receitas',
      href: '/dashboard/recipe-generator',
      active: location.pathname === '/dashboard/recipe-generator'
    },
    {
      id: 'insights',
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Insights',
      href: '/dashboard/nutrition-insights',
      active: location.pathname === '/dashboard/nutrition-insights'
    },
    {
      id: 'saved',
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Salvos',
      href: '/dashboard/saved-recipes',
      active: location.pathname === '/dashboard/saved-recipes'
    }
  ];

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
        className="mb-6"
      />

      {/* User Actions Dock */}
      <Dock
        items={[
          {
            id: 'profile',
            icon: <User className="w-5 h-5" />,
            label: user?.name || 'Perfil',
            onClick: () => navigate('/dashboard/profile')
          },
          {
            id: 'settings',
            icon: <Settings className="w-5 h-5" />,
            label: 'Configurações',
            onClick: () => navigate('/dashboard/settings')
          },
          {
            id: 'logout',
            icon: <LogOut className="w-5 h-5" />,
            label: 'Sair',
            onClick: handleLogout
          }
        ]}
        position="bottom"
        className="mb-20"
      />
    </>
  );
};

export default NavigationDock;
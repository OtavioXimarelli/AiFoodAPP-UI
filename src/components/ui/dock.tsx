import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  badge?: number;
}

interface DockProps {
  items: DockItem[];
  position?: 'bottom' | 'top' | 'left' | 'right';
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Dock = ({ 
  items, 
  position = 'bottom', 
  className,
  orientation = position === 'left' || position === 'right' ? 'vertical' : 'horizontal'
}: DockProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const positionClasses = {
    bottom: 'fixed bottom-6 left-1/2 transform -translate-x-1/2',
    top: 'fixed top-6 left-1/2 transform -translate-x-1/2',
    left: 'fixed left-6 top-1/2 transform -translate-y-1/2',
    right: 'fixed right-6 top-1/2 transform -translate-y-1/2'
  };

  const orientationClasses = {
    horizontal: 'flex-row space-x-2',
    vertical: 'flex-col space-y-2'
  };

  return (
    <motion.div
      className={cn(
        'z-50 flex items-center justify-center',
        'bg-background/80 backdrop-blur-xl border border-border/30',
        'rounded-2xl p-3 shadow-2xl',
        'dark:bg-background/90 dark:border-border/40',
        positionClasses[position],
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
    >
      <div className={cn('flex items-center', orientationClasses[orientation])}>
        {items.map((item, index) => (
          <DockItem
            key={item.id}
            item={item}
            index={index}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            orientation={orientation}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface DockItemProps {
  item: DockItem;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  orientation: 'horizontal' | 'vertical';
}

const DockItem = ({ 
  item, 
  index, 
  hoveredIndex, 
  setHoveredIndex, 
  orientation 
}: DockItemProps) => {
  const isHovered = hoveredIndex === index;
  const isAdjacent = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;

  const getScale = () => {
    if (isHovered) return 1.4;
    if (isAdjacent) return 1.2;
    return 1;
  };

  const content = (
    <motion.div
      className={cn(
        'relative flex items-center justify-center',
        'w-12 h-12 rounded-xl cursor-pointer',
        'bg-background/60 hover:bg-accent/80 border border-border/20',
        'transition-colors duration-200',
        item.active && 'bg-primary text-primary-foreground border-primary/30'
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ scale: getScale() }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={item.onClick}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {item.icon}
      </div>

      {/* Badge */}
      {item.badge && item.badge > 0 && (
        <motion.div
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          {item.badge > 99 ? '99+' : item.badge}
        </motion.div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={cn(
              'absolute bg-background/95 backdrop-blur-sm border border-border/30',
              'px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap shadow-lg',
              orientation === 'horizontal' 
                ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
                : 'left-full ml-2 top-1/2 transform -translate-y-1/2'
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (item.href) {
    return (
      <a href={item.href} className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default Dock;
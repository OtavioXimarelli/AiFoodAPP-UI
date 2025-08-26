import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  /** Index of the item that should align to the screen center (optional) */
  centerIndex?: number;
}

export const Dock = ({ 
  items, 
  position = 'bottom', 
  className,
  orientation = position === 'left' || position === 'right' ? 'vertical' : 'horizontal',
  centerIndex
}: DockProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [offsetX, setOffsetX] = useState(0);

  // When centerIndex is provided, measure and translate container so the target item aligns with the viewport center
  useLayoutEffect(() => {
    if (centerIndex == null) {
      setOffsetX(0);
      return;
    }
    const container = containerRef.current;
    const target = itemRefs.current[centerIndex];
    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const viewportCenterX = window.innerWidth / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    // Current container transform already centers the container, so adjust by delta between targetCenter and viewport center
    const delta = viewportCenterX - targetCenterX;
    setOffsetX(delta);
  }, [centerIndex, items.length]);

  const positionClasses = {
  // Use safe-area on mobile to avoid home indicator overlap
  bottom: 'fixed left-1/2 transform -translate-x-1/2 bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)]',
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
      role="navigation"
      aria-label="Barra de navegação"
      className={cn(
    'z-50 flex items-center justify-center pointer-events-auto',
    // Non-glass solid surface
    'bg-card border border-border',
    'rounded-2xl p-2 sm:p-3 shadow-2xl',
        positionClasses[position],
        className
      )}
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, x: offsetX }}
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
            setRef={(el) => (itemRefs.current[index] = el)}
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
  setRef?: (el: HTMLDivElement | null) => void;
}

const DockItem = ({ 
  item, 
  index, 
  hoveredIndex, 
  setHoveredIndex, 
  orientation,
  setRef
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
  'w-12 h-12 sm:w-12 sm:h-12 rounded-xl cursor-pointer',
  // Non-glass item backgrounds
  'bg-muted hover:bg-accent border border-border/50',
        'transition-colors duration-200',
  item.active && 'bg-primary text-primary-foreground border-primary'
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ scale: getScale() }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={item.onClick}
      aria-label={item.label}
      ref={setRef}
    >
      <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
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

  // Prefer SPA onClick navigation when provided
  if (item.onClick) return content;

  if (item.href) {
    return (
      <a href={item.href} className="block" aria-label={item.label}>
        {content}
      </a>
    );
  }

  return content;
};

export default Dock;
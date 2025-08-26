import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import './click-spark.css';

interface SparkProps {
  id: string;
  x: number;
  y: number;
  angle: number;
  scale: number;
}

interface ClickSparkProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  count?: number;
  disabled?: boolean;
}

const generateSparks = (count: number, x: number, y: number): SparkProps[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `spark-${Date.now()}-${i}`,
    x,
    y,
    angle: (360 / count) * i + Math.random() * 30 - 15,
    scale: 0.5 + Math.random() * 0.5,
  }));
};

export const ClickSpark: React.FC<ClickSparkProps> = ({
  children,
  className,
  color = 'hsl(var(--primary))',
  count = 6,
  disabled = false,
}) => {
  const [sparks, setSparks] = useState<SparkProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const createSparks = useCallback((event: React.MouseEvent) => {
    if (disabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newSparks = generateSparks(count, x, y);
    setSparks(prev => [...prev, ...newSparks]);

    // Clean up sparks after animation
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => !newSparks.includes(spark)));
    }, 1200);
  }, [count, disabled]);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden cursor-pointer', className)}
      onClick={createSparks}
    >
      {children}
      
      <AnimatePresence>
        {sparks.map((spark) => {
          const distance = 20 + Math.random() * 20;
          const radian = (spark.angle * Math.PI) / 180;
          const deltaX = Math.cos(radian) * distance;
          const deltaY = Math.sin(radian) * distance;

          return (
            <motion.div
              key={spark.id}
              className="click-spark"
              style={{
                left: spark.x - 2,
                top: spark.y - 2,
              }}
              initial={{
                scale: 0,
                opacity: 1,
                x: 0,
                y: 0,
              }}
              animate={{
                scale: [0, spark.scale, 0],
                opacity: [0, 1, 0],
                x: deltaX,
                y: deltaY,
              }}
              exit={{
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              <div className="click-spark-dot" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
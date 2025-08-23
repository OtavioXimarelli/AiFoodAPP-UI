import React, { useEffect, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import './custom-scrollbar.css';

interface CustomScrollbarProps {
  children: React.ReactNode;
  className?: string;
  autoHide?: boolean;
  autoHideTimeout?: number;
  autoHideDuration?: number;
  thumbMinSize?: number;
  universal?: boolean;
  style?: React.CSSProperties;
  height?: string | number;
  width?: string | number;
  maxHeight?: string | number;
  variant?: 'default' | 'thin' | 'thick' | 'minimal';
  onScroll?: (event: React.UIEvent<any, UIEvent>) => void;
  onScrollFrame?: (values: any) => void;
  onScrollStart?: () => void;
  onScrollStop?: () => void;
  onUpdate?: (values: any) => void;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  className,
  autoHide = true,
  autoHideTimeout = 1000,
  autoHideDuration = 200,
  thumbMinSize = 30,
  universal = true,
  style,
  height,
  width,
  maxHeight,
  variant = 'default',
  onScroll,
  onScrollFrame,
  onScrollStart,
  onScrollStop,
  onUpdate,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Apply theme-specific CSS custom properties based on current theme
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      
      // Apply theme class for CSS custom properties
      container.classList.remove('light', 'dark');
      if (theme === 'dark') {
        container.classList.add('dark');
      } else if (theme === 'light') {
        container.classList.add('light');
      }
      // For 'system' theme, let CSS media queries handle it
    }
  }, [theme]);

  // Custom thumb component
  const renderThumb = (props: any) => {
    return (
      <div
        {...props}
        className="scrollbar-thumb"
      />
    );
  };

  // Custom track components
  const renderTrackVertical = (props: any) => {
    return (
      <div
        {...props}
        className="scrollbar-track-vertical"
      />
    );
  };

  const renderTrackHorizontal = (props: any) => {
    return (
      <div
        {...props}
        className="scrollbar-track-horizontal"
      />
    );
  };

  // Custom view component
  const renderView = (props: any) => {
    return (
      <div
        {...props}
        className="scrollbar-view"
      />
    );
  };

  const containerStyle = {
    ...style,
    height,
    width,
    maxHeight,
  };

  return (
    <div 
      ref={containerRef}
      className={cn('custom-scrollbar-container', `scrollbar-${variant}`, className)}
    >
      <Scrollbars
        style={containerStyle}
        autoHide={autoHide}
        autoHideTimeout={autoHideTimeout}
        autoHideDuration={autoHideDuration}
        thumbMinSize={thumbMinSize}
        universal={universal}
        renderThumbVertical={renderThumb}
        renderThumbHorizontal={renderThumb}
        renderTrackVertical={renderTrackVertical}
        renderTrackHorizontal={renderTrackHorizontal}
        renderView={renderView}
        onScroll={onScroll}
        onScrollFrame={onScrollFrame}
        onScrollStart={onScrollStart}
        onScrollStop={onScrollStop}
        onUpdate={onUpdate}
      >
        {children}
      </Scrollbars>
    </div>
  );
};

export default CustomScrollbar;

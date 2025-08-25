import React, { useState, useRef, useCallback, memo } from 'react';
import { useIntersectionObserver } from '@/hooks/useScrollAnimation';
import { LoadingAnimation, SkeletonPulse } from './animated';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
  placeholder?: 'blur' | 'skeleton' | 'none';
  blurDataURL?: string;
  priority?: boolean;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  className = '',
  fallback = '/placeholder-image.jpg',
  placeholder = 'skeleton',
  blurDataURL,
  priority = false,
  quality = 75,
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  const { ref: intersectionRef, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
    enabled: !priority, // Don't use intersection observer for priority images
  });

  // Combine refs
  const setRefs = useCallback((node: HTMLImageElement | null) => {
    if (imgRef.current !== node) {
      (imgRef as any).current = node;
    }
    intersectionRef(node);
  }, [intersectionRef]);

  // Load image when it comes into view or if it's priority
  React.useEffect(() => {
    if (priority || hasIntersected) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setImageState('loaded');
        onLoad?.();
      };
      
      img.onerror = () => {
        setImageSrc(fallback);
        setImageState('error');
        onError?.();
      };

      // Add quality parameter if it's a dynamic image
      const optimizedSrc = src.includes('?') 
        ? `${src}&q=${quality}` 
        : `${src}?q=${quality}`;
        
      img.src = optimizedSrc;
    }
  }, [src, fallback, quality, priority, hasIntersected, onLoad, onError]);

  // Render placeholder while loading
  if (!priority && !hasIntersected) {
    return (
      <div 
        ref={setRefs}
        className={`${className} bg-muted`}
        style={{ width, height }}
      >
        {placeholder === 'skeleton' && (
          <SkeletonPulse className="w-full h-full" />
        )}
        {placeholder === 'blur' && blurDataURL && (
          <img
            src={blurDataURL}
            alt=""
            className="w-full h-full object-cover filter blur-sm"
          />
        )}
      </div>
    );
  }

  if (imageState === 'loading') {
    return (
      <div 
        className={`${className} bg-muted flex items-center justify-center`}
        style={{ width, height }}
      >
        {placeholder === 'skeleton' ? (
          <SkeletonPulse className="w-full h-full" />
        ) : placeholder === 'blur' && blurDataURL ? (
          <img
            src={blurDataURL}
            alt=""
            className="w-full h-full object-cover filter blur-sm"
          />
        ) : (
          <LoadingAnimation size="sm" />
        )}
      </div>
    );
  }

  return (
    <img
      ref={setRefs}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`${className} transition-opacity duration-300 ${
        imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
      }`}
      loading={loading}
      decoding="async"
      {...props}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Image gallery component with optimized loading
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
    blurDataURL?: string;
  }>;
  className?: string;
  itemClassName?: string;
  columns?: number;
  gap?: number;
  priority?: number; // Number of images to load with priority
}

export const ImageGallery = memo<ImageGalleryProps>(({
  images,
  className = '',
  itemClassName = '',
  columns = 3,
  gap = 8,
  priority = 3
}) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
  };

  return (
    <div className={className} style={gridStyle}>
      {images.map((image, index) => (
        <OptimizedImage
          key={index}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          blurDataURL={image.blurDataURL}
          className={itemClassName}
          priority={index < priority}
          placeholder="blur"
        />
      ))}
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery';

// Progressive image component for hero sections
interface ProgressiveImageProps extends OptimizedImageProps {
  sizes?: string;
  srcSet?: string;
}

export const ProgressiveImage = memo<ProgressiveImageProps>(({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    props.onLoad?.();
  }, [props]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Low quality placeholder */}
      {!isLoaded && props.blurDataURL && (
        <img
          src={props.blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
        />
      )}
      
      {/* High quality image */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        loading={props.priority ? 'eager' : 'lazy'}
        decoding="async"
        {...props}
      />
    </div>
  );
});

ProgressiveImage.displayName = 'ProgressiveImage';

// Avatar component with optimized loading
interface OptimizedAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const OptimizedAvatar = memo<OptimizedAvatarProps>(({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const handleError = useCallback(() => {
    setImageError(true);
  }, []);

  if (!src || imageError) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-muted rounded-full flex items-center justify-center`}>
        <span className="text-muted-foreground font-medium">
          {fallback || alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} ${className} rounded-full object-cover`}
      onError={handleError}
      priority={false}
      placeholder="skeleton"
    />
  );
});

OptimizedAvatar.displayName = 'OptimizedAvatar';
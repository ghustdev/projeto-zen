import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function Image({ 
  src, 
  alt, 
  fallback = '/placeholder.svg', 
  className, 
  onError,
  ...props 
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    try {
      if (!hasError && imgSrc !== fallback) {
        setHasError(true);
        setImgSrc(fallback);
      }
      onError?.(event);
    } catch (error) {
      console.error('Erro no componente Image:', error);
    }
  }, [hasError, imgSrc, fallback, onError]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={cn(className)}
      onError={handleError}
      loading="lazy"
    />
  );
}

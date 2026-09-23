import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Clean ProductImage component that handles:
 * 1. Missing or empty imageUrl -> Clean SVG placeholder with subtle styling
 * 2. Network errors or 404s -> Gracefully switches to placeholder without showing broken image icon
 * 3. Lazy loading and smooth object-cover presentation
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no source provided or previous error, show clean placeholder
  if (!src || src.trim() === '' || hasError) {
    return (
      <div className={containerClassName}>
        <div className="flex flex-col items-center justify-center p-2 text-slate-300">
          <Package className="w-1/2 h-1/2 max-w-8 max-h-8 min-w-4 min-h-4 text-slate-300 stroke-[1.5]" />
          <span className="text-[9px] font-semibold text-slate-400 mt-1 line-clamp-1 text-center select-none">
            {alt || 'Sin foto'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
          <Package className="w-5 h-5 text-slate-300 stroke-[1.5]" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
};

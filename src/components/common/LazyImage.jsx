import { useState, useEffect } from 'react';
import useLazyLoad from '../../hooks/useLazyLoad';

/**
 * LazyImage component for optimized image loading
 * 
 * @param {Object} props
 * @param {string} props.src - The source URL of the image
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - CSS classes for the image
 * @param {string} props.placeholderSrc - Placeholder image to show while loading
 * @param {Object} props.style - Additional inline styles
 * @returns {JSX.Element}
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  style = {},
  ...props
}) => {
  const { imageSrc, isLoaded, imgRef } = useLazyLoad(src, placeholderSrc);
  const [isError, setIsError] = useState(false);

  // Handle image load errors
  useEffect(() => {
    const handleError = () => {
      setIsError(true);
      console.error(`Failed to load image: ${src}`);
    };

    const img = imgRef.current;
    if (img) {
      img.addEventListener('error', handleError);
      return () => {
        img.removeEventListener('error', handleError);
      };
    }
  }, [imgRef, src]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder or blurred version while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={isError ? placeholderSrc : imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
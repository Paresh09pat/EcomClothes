import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for lazy loading images
 * @param {string} src - The source URL of the image
 * @param {string} placeholder - The placeholder image URL to show while loading
 * @returns {Object} - The current source URL and loading state
 */
const useLazyLoad = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Create an observer instance
    const observer = new IntersectionObserver(
      (entries) => {
        // If the image is intersecting with the viewport
        if (entries[0].isIntersecting) {
          // Start loading the image
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
            // Disconnect the observer once the image is loaded
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            // Keep the placeholder if loading fails
            setIsLoaded(false);
            if (imgRef.current) {
              observer.unobserve(imgRef.current);
            }
          };
        }
      },
      {
        rootMargin: '100px', // Start loading when image is 100px from viewport
        threshold: 0.1, // Trigger when at least 10% of the image is visible
      }
    );

    // Start observing the image element
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    // Clean up the observer when component unmounts
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, placeholder]);

  return { imageSrc, isLoaded, imgRef };
};

export default useLazyLoad;
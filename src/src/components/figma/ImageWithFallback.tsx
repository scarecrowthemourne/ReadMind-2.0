import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export function ImageWithFallback({ src, alt, fallback, ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error && fallback) {
    return <img src={fallback} alt={alt} {...props} />;
  }

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-muted text-muted-foreground"
        style={{ width: props.width, height: props.height }}
      >
        {alt}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={() => setError(true)}
      {...props} 
    />
  );
}

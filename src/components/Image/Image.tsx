import { useState, type PropsWithChildren } from 'react';

type ImageProps = PropsWithChildren<{
  src: string;
  alt?: string;
  className?: string;
}>;

export default function Image(props: ImageProps) {
  const { children, src, alt, className } = props;

  const [imageError, setImageError] = useState(false);

  function onError() {
    setImageError(true);
  }

  if (imageError) return children;

  return <img src={src} alt={alt} className={className} onError={onError} />;
}

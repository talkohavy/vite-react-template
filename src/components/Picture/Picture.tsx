import { useState, type PropsWithChildren } from 'react';
import { SIZES } from './logic/constants';

type PictureProps = PropsWithChildren<{
  srcSet: Array<string>;
  alt: string;
  className?: string;
  imgClassName?: string;
}>;

/**
 * @description
 * Inside a <picture> element you can have:
 *
 * - Multiple <source> elements (optional)
 * - One <img> element (REQUIRED, acts as fallback)
 *
 * How it works:
 *
 * 1. The browser goes through the <source> elements from top to bottom.
 * 2. It picks the first source that matches the current conditions (like media queries).
 * 3. The <img> tag will be used when none of the <source> conditions match.
 * 4. The <img> tag will be used when browser doesn't support <picture>.
 * 5. The <img> tag will be used when javascript is disabled.
 *
 * Best Practices:
 *
 * - A common pattern is to use the highest quality image as both the first item
 *   in your `srcSet` array, and the src attribute of the <img> tag. This ensures
 *   consistent fallback behavior and optimal image loading for different screen sizes.
 * - The src prop in the <img> tag should be the highest quality version.
 * - The src prop in the <img> tag should be your default/fallback image.
 *
 */
export default function Picture(props: PictureProps) {
  const { children, alt, srcSet, className, imgClassName } = props;

  const [imageError, setImageError] = useState(false);

  function onError() {
    setImageError(true);
  }

  if (imageError) return children;

  return (
    <picture className={className}>
      {srcSet.map((src, index) => (
        <source key={index} srcSet={src} media={SIZES[index]} />
      ))}

      <img loading='lazy' src={SIZES.at(0)} alt={alt} onError={onError} className={imgClassName} />
    </picture>
  );
}

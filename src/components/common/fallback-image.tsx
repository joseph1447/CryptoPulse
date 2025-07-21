
"use client";

import { useState, useEffect } from 'react';
import Image, { type ImageProps } from 'next/image';

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
}

const FallbackImage = (props: FallbackImageProps) => {
  const { src, fallbackSrc = `https://placehold.co/${props.width}x${props.height}.png`, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default FallbackImage;

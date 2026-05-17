import type { SyntheticEvent } from "react";
//import styles from "./Image.module.css";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallback?: string;
  width: number;
  height: number;
};

const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.dataset.loaded = "true";
};

export const Image = ({
  src,
  width,
  height,
  fallback = "/mushrooms.svg",
  sizes,
  className,
  fetchPriority, // ← React 19 camelCase
  ...props
}: ImageProps) => {

  // fallback
  if (!src) {
    src = fallback;
  }

  // split URL
  const [base, query] = src.split("?");
  const params = new URLSearchParams(query);

  // original width
  const originalWidth = Number(params.get("w")) || width;

  // srcset 1x, 2x, 3x
  const srcSet = [1, 2, 3]
    .map((scale) => {
      const p = new URLSearchParams(query);
      const w = originalWidth * scale;
      p.set("w", String(w));
      p.set("h", String(Math.round((w / width) * height)));
      return `${base}?${p.toString()} ${w}w`;
    })
    .join(", ");

  // fallback on error
  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = "true";
    img.src = fallback;
  };

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes ?? `${width}px`}
      width={width}
      height={height}
      loading={props.loading ?? "lazy"}
      decoding={props.decoding ?? "async"}
      onError={handleError}
      onLoad={handleLoad}
      className={` ${className ?? ""}`}
      {...props} // ← až nakonec, ale fetchPriority už jsme přepsali výše
    />
  );
};

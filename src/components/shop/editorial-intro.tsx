import type { ReactNode } from "react";

import Image from "next/image";

interface EditorialIntroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image: string;
  alt: string;
  /** CSS object-position for the editorial crop. Defaults to center. */
  objectPosition?: string;
  priority?: boolean;
  sizes?: string;
}

// The intro is a full-bleed band (100vw + gutters); the image column is
// roughly 58% of it, i.e. about 64vw on desktop.
const DEFAULT_SIZES = "(min-width: 48rem) 64vw, 100vw";

/**
 * Shared editorial intro used at the top of /shop and the collection
 * pages. One visual system -- asymmetric text/image split on desktop,
 * image-led stack on mobile -- so the four pages read as one brand
 * while each collection brings its own imagery and copy.
 */
export function EditorialIntro({
  eyebrow,
  title,
  description,
  image,
  alt,
  objectPosition = "center",
  priority = false,
  sizes = DEFAULT_SIZES,
}: EditorialIntroProps) {
  return (
    <header className="editorial-intro">
      <div className="editorial-intro__copy">
        <p className="editorial-intro__eyebrow">{eyebrow}</p>
        <h1 className="editorial-intro__title">{title}</h1>
        <p className="editorial-intro__description">{description}</p>
      </div>
      <div className="editorial-intro__image">
        <Image
          alt={alt}
          className="editorial-intro__image-img"
          fill
          priority={priority}
          sizes={sizes}
          src={image}
          style={{ objectPosition }}
        />
      </div>
    </header>
  );
}

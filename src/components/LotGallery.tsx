"use client";

import Image from "next/image";
import { useState } from "react";

export function LotGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <Image
          src={images[active]}
          alt={`${title}, image ${active + 1} of ${images.length}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden border transition-opacity ${
                index === active ? "border-accent opacity-100" : "border-line opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image src={image} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

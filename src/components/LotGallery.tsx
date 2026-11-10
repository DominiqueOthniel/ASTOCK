"use client";

import Image from "next/image";
import { useState } from "react";

export function LotGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
  ];

  return (
    <div className="min-w-0 max-w-full">
      <div className="lot-media relative aspect-[4/3] w-full sm:aspect-[16/10]">
        <Image
          src={list[active]}
          alt={`${title} liquidation lot photo ${active + 1} of ${list.length}`}
          fill
          className="lot-media-img"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority={active === 0}
          fetchPriority={active === 0 ? "high" : "auto"}
        />
      </div>
      {list.length > 1 ? (
        <div className="scroll-x mt-3 flex max-w-full gap-2 pb-1">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`lot-media relative h-16 w-[4.5rem] shrink-0 border transition-opacity sm:h-[4.5rem] sm:w-24 ${
                index === active ? "border-accent opacity-100" : "border-line opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show image ${index + 1} of ${title}`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                className="lot-media-img !p-0.5"
                sizes="96px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

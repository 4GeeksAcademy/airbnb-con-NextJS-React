"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { PropertyPhoto } from "@/components/PropertyPhoto";

export function ImageGallery({ images, title, propertyId }: { images: string[]; title: string; propertyId: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [propertyId]);

  if (images.length === 0) {
    return <PropertyPhoto className="aspect-square w-full rounded-b-3xl md:rounded-2xl" imageKey="default" title={title} />;
  }

  return (
    <div className="relative">
      <PropertyPhoto className="aspect-square w-full rounded-b-3xl md:aspect-[16/9] md:rounded-2xl" imageKey={images[activeIndex]} title={`${title}, imagen ${activeIndex + 1} de ${images.length}`} />
      <span aria-live="polite" className="absolute bottom-4 right-4 rounded-full bg-[rgb(34_34_34/72%)] px-3 py-1.5 text-sm font-medium text-white">
        {activeIndex + 1} / {images.length}
      </span>
      <button aria-label="Imagen anterior" className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm" disabled={activeIndex === 0} onClick={() => setActiveIndex((index) => Math.max(0, index - 1))} type="button">
        <Icon name="chevron-left" />
      </button>
      <button aria-label="Imagen siguiente" className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow-sm" disabled={activeIndex === images.length - 1} onClick={() => setActiveIndex((index) => Math.min(images.length - 1, index + 1))} type="button">
        <Icon name="chevron-right" />
      </button>
    </div>
  );
}
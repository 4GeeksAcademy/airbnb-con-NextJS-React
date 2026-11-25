export function PropertyPhoto({ imageKey, title, className = "" }: { imageKey: string; title: string; className?: string }) {
  const scene = imageKey.split("-")[0];
  return (
    <div
      aria-label={`${title}, imagen ilustrativa`}
      className={`photo-art ${className}`}
      data-scene={scene}
      role="img"
    >
      <span className="photo-caption">Imagen ilustrativa</span>
    </div>
  );
}
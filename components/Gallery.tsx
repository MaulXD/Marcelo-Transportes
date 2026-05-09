import Image from "next/image";

const PHOTOS = [
  "/galeria/foto1.jpg",
  "/galeria/foto2.jpg",
  "/galeria/foto3.jpg",
  "/galeria/foto4.jpg",
  "/galeria/foto5.jpg",
];

export function Gallery() {
  const loop = [...PHOTOS, ...PHOTOS];

  return (
    <section
      id="galeria"
      className="scroll-mt-24 w-full overflow-hidden py-12 sm:py-16"
      aria-labelledby="galeria-heading"
    >
      <h2 id="galeria-heading" className="sr-only">
        Galeria
      </h2>

      <div className="relative w-full overflow-hidden">
        <div className="flex w-max animate-scroll-marquee gap-4 motion-reduce:animate-none">
          {loop.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-square w-64 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-lg md:w-80"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 768px) 320px, 256px"
                className="object-cover transition-transform duration-500 hover:scale-105"
                draggable={false}
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

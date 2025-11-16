export function injectPreloadLink(
  href: string,
  opts: { as?: string; imageSrcSet?: string; imageSizes?: string } = {}
) {
  try {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = opts.as || "image";
    link.href = href;
    if (opts.imageSrcSet) link.setAttribute("imagesrcset", opts.imageSrcSet);
    if (opts.imageSizes) link.setAttribute("imagesizes", opts.imageSizes);
    document.head.appendChild(link);
  } catch {}
}

export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    } catch {
      resolve(false);
    }
  });
}

export async function preloadAndSwap(
  setSrc: (s: string) => void,
  webpSrc: string,
  fallbackSrc: string
) {
  injectPreloadLink(webpSrc, { as: "image" });
  const ok = await preloadImage(webpSrc);
  if (ok) setSrc(webpSrc);
  else setSrc(fallbackSrc);
}


export function getImageUrl(src: string, type: "banner" | "card" | "avatar") {
  const transforms = {
    banner: "w-1400,f-webp,q-100",
    card: "w-400,h-300,f-webp,q-100",
    avatar: "w-100,h-100,f-webp,q-100",
  };

  try {
    if (!src.toLowerCase().includes("urbanease")) {
      return src;
    }
    const path = new URL(src).pathname;
    return `${path}?tr=${transforms[type]}`;
  } catch {
    return src;
  }
}

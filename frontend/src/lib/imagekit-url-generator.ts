const IMAGEKIT_URL = process.env.IMAGEKIT_BASE_URL;

export function getImageUrl(src: string, type: "banner" | "card" | "avatar") {
  const path = new URL(src).pathname;

  const transforms = {
    banner: "w-1400,f-webp,q-70",
    card: "w-400,h-300,f-webp,q-70",
    avatar: "w-100,h-100,f-webp,q-70",
  };

  return `${IMAGEKIT_URL}${path}?tr=${transforms[type]}`;
}

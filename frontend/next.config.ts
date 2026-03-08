import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "urbanease.fly.storage.tigris.dev",
      },
      {
        protocol: "https",
        hostname: "urbanease.t3.storage.dev",
      },
    ],
  },
};

export default nextConfig;

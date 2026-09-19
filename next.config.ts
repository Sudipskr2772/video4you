import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.eporner.com" },
      { protocol: "https", hostname: "eporner.com" },
    ],
    // Thumbs are tiny; keep quality reasonable for speed
    qualities: [50, 75],
  },
};

export default nextConfig;

// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /** Remote images (Cloudinary) */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dxr6eovhv/**",
      },
    ],
  },

  /** Optional experimental settings */
  experimental: {
    // App Router no longer needs `appDir`
    serverActions: {},          // ← enable Server Actions with defaults
    // If you’re NOT using Server Actions, you can remove `experimental` entirely.
  },

  /** Tree‑shake lucide‑react */
  transpilePackages: ["lucide-react"],
};

export default nextConfig;

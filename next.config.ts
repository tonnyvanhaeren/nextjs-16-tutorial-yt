import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        hostname: "robust-canary-13.convex.cloud",
        protocol: "https",
        port: "",
      }
    ],
  },
};

export default nextConfig;

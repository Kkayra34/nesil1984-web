import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Admin'de çoklu ürün fotoğrafı yüklenir (her biri en fazla 8 MB, varsayılan sınır 1 MB).
  experimental: { serverActions: { bodySizeLimit: "30mb" } },
  // Ürün fotoğrafları Cloudinary'den gelir.
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

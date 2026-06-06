import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Esto le dice a Vercel que no detenga el despliegue por errores de ESLint
    ignoreDuringBuilds: true,
  },
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },
};

export default nextConfig;
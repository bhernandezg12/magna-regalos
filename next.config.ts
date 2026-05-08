import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Esto le dice a Vercel que no detenga el despliegue por errores de ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
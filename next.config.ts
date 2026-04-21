import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*', // 프론트에서 /api/v1/... 으로 보내면
        destination: `${process.env.INTERNAL_API_URL || 'http://localhost:8080'}/api/v1/:path*`, // 백엔드로 전달
      },
    ];
  },
  reactCompiler: true,
};
export default nextConfig;
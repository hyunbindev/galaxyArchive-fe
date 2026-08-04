import type { NextConfig } from "next";

const imageBaseUrl = new URL(
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:9000"
);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.INTERNAL_API_URL || "http://localhost:8080"}/api/v1/:path*`,
      },
      {
        source: "/oauth2/:path*",
        destination: `${process.env.INTERNAL_API_URL || "http://localhost:8080"}/oauth2/:path*`,
      },
      {
        source: "/login/oauth2/:path*",
        destination: `${process.env.INTERNAL_API_URL || "http://localhost:8080"}/login/oauth2/:path*`,
      },
    ];
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: imageBaseUrl.protocol.replace(":", "") as "http" | "https",
        hostname: imageBaseUrl.hostname,
        port: imageBaseUrl.port,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "10073",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lumina.briandizon.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/cms-assets/:path*",
        destination: "https://lumina.briandizon.com/:path*",
      },
    ];
  },
};

export default nextConfig;

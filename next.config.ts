import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
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
};

export default nextConfig;

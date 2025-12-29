import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/verify-email.html',
        destination: '/verify-email',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

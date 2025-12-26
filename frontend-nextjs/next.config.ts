import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

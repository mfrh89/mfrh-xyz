import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const serverUrl = process.env.SERVER_URL || 'http://localhost:3000'

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    return [
      {
        // Allow Payload admin to embed frontend pages in live preview iframe
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: `SAMEORIGIN`,
          },
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${serverUrl}`,
          },
        ],
      },
    ]
  },
};

export default withPayload(nextConfig);

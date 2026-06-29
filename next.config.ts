import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "order2party.pt",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

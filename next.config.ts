import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/factory-demo/*": ["./vendor/factory-demo/**/*"],
  },
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/crm/easyorder/**", search: "?v=2026" },
    ],
  },
};

export default nextConfig;

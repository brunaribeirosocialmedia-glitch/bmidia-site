import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/bmidia-site" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/bmidia-site" : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

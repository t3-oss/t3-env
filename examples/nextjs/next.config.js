// import "./app/env.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    taint: true,
  },
};

export default nextConfig;

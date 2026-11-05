/** @type {import('next').NextConfig} */
const distDir = process.env.NEXT_DIST_DIR || ".next";

const nextConfig = {
  reactStrictMode: true,
  distDir,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

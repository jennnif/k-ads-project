/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { staleTimes: { static: 0, dynamic: 0 } },
};

export default nextConfig;

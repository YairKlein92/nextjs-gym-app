/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {}, // Remove 'appDir' from here
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

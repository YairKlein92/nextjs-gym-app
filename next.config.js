/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {}, // Remove 'appDir' from here
  compiler: {
    removeConsole: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: [],
  experimental: { proxyClientMaxBodySize: '6mb' },
};
export default config;

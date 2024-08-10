/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.aave.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "icons.llamao.fi",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

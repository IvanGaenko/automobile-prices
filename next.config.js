/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/cars",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

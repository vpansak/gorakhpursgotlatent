/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/tickets',
        destination: '/book-ticket',
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/malik',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/malik/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

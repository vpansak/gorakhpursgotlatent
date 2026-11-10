/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs', '@resvg/resvg-js'],
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
        source: '/malik',
        has: [{ type: 'host', value: 'admin\\.gkpgotlatent\\.in' }],
        destination: '/',
        permanent: false,
      },
      {
        source: '/tickets',
        destination: '/book-ticket',
        permanent: false,
      },
      {
        source: '/admin',
        destination: 'https://admin.gkpgotlatent.in',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: 'https://admin.gkpgotlatent.in/malik/:path*',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: 'admin\\.gkpgotlatent\\.in' }],
          destination: '/malik',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

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
        destination: 'https://in.bookmyshow.com/events/gorakhpur-got-latent/ET00518139?utm_source=ig&utm_medium=social&utm_content=link_in_bio',
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

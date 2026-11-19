import { withWorkflow } from 'workflow/next';
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {'/api/malik/documents/*':['./private-assets/**/*'],'/documents/*':['./private-assets/**/*']},
  async headers(){return [{source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'X-Frame-Options',value:'SAMEORIGIN'}]}];},
  serverExternalPackages: ['bcryptjs', '@resvg/resvg-js'],
  images: {
    dangerouslyAllowLocalIP:false,
    dangerouslyAllowSVG:false,
    maximumRedirects:3,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {source: "/performers",destination: "/apply/performer",permanent: false},
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

export default withWorkflow(nextConfig);

/** @type {import('next').NextConfig} */
const nextConfig = {  
  images:{
    domains: [
      'i.ibb.co',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'demo-three-tan-51.vercel.app',
      'demoapi.bizup.in',
      'localhost'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
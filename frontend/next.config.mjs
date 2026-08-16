/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API and uploads to Express backend
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
  // Allow images from backend based on ENV
  images: {
    remotePatterns: (() => {
      const backendUrlStr = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000';
      try {
        const url = new URL(backendUrlStr);
        return [{
          protocol: url.protocol.replace(':', ''),
          hostname: url.hostname,
          port: url.port || '',
        }];
      } catch (e) {
        return [{ protocol: 'http', hostname: 'localhost', port: '5000' }];
      }
    })(),
  },
};

export default nextConfig;

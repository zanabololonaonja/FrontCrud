// frontend/next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/api/:path*', // Proxy to Backend
        },
      ];
    },
  };

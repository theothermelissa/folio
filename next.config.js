/** @type {import('next').NextConfig} */
const { NEXT_PUBLIC_BASE_URL_PATH, NEXT_PUBLIC_BASE_PROTOCOL, SUPERTOKENS_URI } = process.env

const nextConfig = {
    reactStrictMode: true,
    // async rewrites() {
    //     return [
    //       {
    //         source: '/api/:path*',
    //         destination: `${NEXT_PUBLIC_BASE_PROTOCOL}${NEXT_PUBLIC_BASE_URL_PATH}:path*`
    //       }
    //     ]
    //   },
    async headers() {
        return [
          {
            // matching all API routes
            // source: "/api/:path*",
            source: "/api",
            headers: [
              { key: "Access-Control-Allow-Credentials", value: "true" },
              { key: "Access-Control-Allow-Origin", value: `.${NEXT_PUBLIC_BASE_URL_PATH}` },
              { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
              { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
          }
        ]
      }
    
};

module.exports = nextConfig;

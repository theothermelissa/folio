/** @type {import('next').NextConfig} */
const { withSuperjson } = require('next-superjson')

const { NEXT_PUBLIC_BASE_PROTOCOL, NEXT_PUBLIC_BASE_URL_PATH } = process.env

const nextConfig = {
  reactStrictMode: true,
  async headers() {
      return [
        {
          source: "/api",
          headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            // { key: "Access-Control-Allow-Origin", value: `${NEXT_PUBLIC_BASE_URL_PATH}` },
            { key: "Access-Control-Allow-Origin", value: `*` },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          ]
        }
      ]
    },
    // {
    //   "rewrites": [
    //     {
    //       "source": "/:path*",
    //       "has": [
    //         {
    //           "type": "host",
    //           "value": "app.acme.com"
    //         }
    //       ],
    //       "destination": "/app/:path*"
    //     }
    //   ]
    // },
    async redirects() {
      return [
        {
          source: `/admin`,
          has: [{
            type: "host",
            value: `:subdomain.${NEXT_PUBLIC_BASE_URL_PATH}`,
          }],
          destination: `${NEXT_PUBLIC_BASE_PROTOCOL}${NEXT_PUBLIC_BASE_URL_PATH}/admin`,
          permanent: true,
        },
      ]
    },
};

module.exports = withSuperjson()(nextConfig)

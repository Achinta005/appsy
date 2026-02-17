/** @type {import('next').NextConfig} */
module.exports = {
   skipTrailingSlashRedirect: true,
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "achintahazra.shop",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "portfolio-frontend-dtcj.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "portfolio-backend-3gcq.onrender.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.microlink.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/**",
      },
    ],
  },
};
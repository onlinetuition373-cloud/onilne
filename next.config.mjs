/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Required for next/image to load remote photos. Add your own image host here later.
    remotePatterns: [
      { protocol: "https", hostname: "img.magnific.com" },
      { protocol: "https", hostname: "img.freepik.com" },
    ],
  },
};

export default nextConfig;

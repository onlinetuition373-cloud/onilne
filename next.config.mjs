/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Required for next/image to load remote photos. Add your own image host here later.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

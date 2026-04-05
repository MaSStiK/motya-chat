/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tv.hedgehog-rp.ru",
                pathname: "/thumbnails/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            }
        ]
    }
};

export default nextConfig;

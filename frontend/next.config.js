/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BACKEND_BASE_URL: process.env.BACKEND_BASE_URL || "http://localhost:8000",
        PUSHER_APP_KEY: process.env.PUSHER_APP_KEY || "PUSHER_APP_KEY",
        PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER || "PUSHER_APP_CLUSTER",
    }
};

module.exports = nextConfig;

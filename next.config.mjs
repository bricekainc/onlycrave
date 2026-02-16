/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This keeps your existing setting to ignore type errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Necessary for handling payment redirects and images
  images: {
    domains: ['www.coinpayments.net', 'onlycrave.vercel.app'],
  },
  // This ensures your Vercel variables are accessible to the app
  env: {
    PAYHERO_API_USERNAME: process.env.PAYHERO_API_USERNAME,
    PAYHERO_API_PASSWORD: process.env.PAYHERO_API_PASSWORD,
    PAYHERO_CHANNEL_ID: process.env.PAYHERO_CHANNEL_ID,
    COINPAYMENTS_MERCHANT_ID: process.env.COINPAYMENTS_MERCHANT_ID,
    WEBAPP_URL: process.env.WEBAPP_URL,
  }
};

export default nextConfig;

import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';

// This is the main wrapper for your entire website
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* This renders the specific page you are visiting */}
      <Component {...pageProps} />
      
      {/* This tracks your visitors for the Vercel Dashboard */}
      <Analytics />
    </>
  );
}

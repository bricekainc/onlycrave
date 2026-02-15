import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css'; // This line connects Tailwind!

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

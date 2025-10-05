import type { AppProps } from 'next/app';
import '../styles/tailwind.css';
import '../styles/globals.css';
import { AuthProvider } from '../lib/auth-context';
import { Analytics } from '@vercel/analytics/next';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Analytics />
    </AuthProvider>
  );
}

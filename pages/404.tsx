import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  const [mounted, setMounted] = useState(false);
  const [isFansnub, setIsFansnub] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    
    // 1. Check for Fansnub domain
    if (host.includes('your.onlycrave.com')) {
      setIsFansnub(true);
    }

    // 2. Sync theme from OnlyCrave's localStorage
    const savedTheme = localStorage.getItem('crave-theme');
    if (savedTheme === 'light') {
      setResolvedTheme('light');
    } else if (savedTheme === 'dark') {
      setResolvedTheme('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(systemDark ? 'dark' : 'light');
    }
  }, []);

  const theme = {
    bg: isFansnub ? '#050505' : (resolvedTheme === 'dark' ? '#0a0a0c' : '#ffffff'),
    text: isFansnub ? '#ffffff' : (resolvedTheme === 'dark' ? '#ffffff' : '#1a1a1b'),
    primary: '#e33cc7',
    secondary: '#2ddfff',
    blue: '#0102FD',
    card: isFansnub ? '#111111' : (resolvedTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
    border: isFansnub ? '#333' : (resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
  };

  if (!mounted) return null;

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      color: theme.text, 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: "'Inter', sans-serif",
      textAlign: 'center',
      padding: '20px'
    }}>
      <Head>
        <title>404 - Page Not Found | {isFansnub ? 'Fansnub Mirror' : 'OnlyCrave'}</title>
      </Head>

      <div style={{ maxWidth: '500px', width: '100%' }}>
        {/* --- ICON --- */}
        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>
          {isFansnub ? '📡' : '🔍'}
        </div>

        {/* --- ERROR CODE --- */}
        <h1 style={{ 
          fontSize: '6rem', 
          fontWeight: 900, 
          margin: 0, 
          lineHeight: 1,
          background: `linear-gradient(135deg, ${theme.blue} 0%, ${theme.primary} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>

        {/* --- DYNAMIC TEXT --- */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '10px' }}>
          {isFansnub ? 'CONNECTION LOST' : 'PAGE NOT FOUND'}
        </h2>

        <p style={{ opacity: 0.6, lineHeight: 1.6, margin: '20px 0 40px' }}>
          {isFansnub 
            ? "The profile or page you are looking for has been moved to our new infrastructure. Please return to the main migration gateway."
            : "The page you're looking for doesn't exist or has been moved to a new URL. Check the spelling or return to the directory."}
        </p>

        {/* --- ACTION BUTTON --- */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ 
            background: isFansnub ? theme.blue : `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
            color: '#fff',
            padding: '18px 30px',
            borderRadius: '15px',
            fontWeight: 900,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: `0 10px 30px ${isFansnub ? theme.blue + '44' : theme.primary + '44'}`,
            display: 'inline-block',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isFansnub ? 'GO TO MIGRATION GATEWAY' : 'BACK TO DIRECTORY'}
          </div>
        </Link>

        {/* --- SUBTLE WARNING FOR FANSNUB --- */}
        {isFansnub && (
          <div style={{ marginTop: '40px', padding: '15px', background: 'rgba(255, 62, 128, 0.1)', border: '1px solid #ff3e80', borderRadius: '12px', fontSize: '0.8rem', color: '#ff3e80', fontWeight: 700 }}>
            NOTICE: your.onlycrave.com is now OnlyCrave.com. All links are being redirected.
          </div>
        )}
      </div>

      {/* --- FOOTER LOGO --- */}
      <div style={{ position: 'absolute', bottom: '40px', opacity: 0.2, fontWeight: 900, letterSpacing: '5px', fontSize: '0.7rem' }}>
        {isFansnub ? 'FANSNUB LEGACY' : 'ONLYCRAVE GLOBAL'}
      </div>
    </div>
  );
}

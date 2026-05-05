import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  // Realistic futuristic theme colors
  const theme = {
    bg: resolvedTheme === 'dark' ? '#050507' : '#f8f9fa',
    text: resolvedTheme === 'dark' ? '#ffffff' : '#1a1a1b',
    primary: '#e33cc7', // Pink-Neon
    secondary: '#2ddfff', // Cyan-Neon
    accent: '#0102FD', // Deep Blue
    card: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    border: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('crave-theme');
    if (savedTheme === 'light') {
      setResolvedTheme('light');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(systemDark ? 'dark' : 'light');
    }
  }, []);

  // Live Search Logic - Redirects to OnlyCrave search with the query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://onlycrave.com/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ 
      backgroundColor: theme.bg, 
      color: theme.text, 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: "'Inter', system-ui, sans-serif",
      textAlign: 'center',
      padding: '20px',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      <Head>
        <title>404 | Lost in the Multiverse</title>
      </Head>

      {/* Futuristic Background Elements */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${theme.primary}22 0%, transparent 70%)`,
        top: '10%',
        left: '10%',
        zIndex: 0,
        filter: 'blur(40px)'
      }} />

      <div style={{ maxWidth: '600px', width: '100%', zIndex: 1 }}>
        {/* --- GLITCH 404 --- */}
        <h1 style={{ 
          fontSize: 'clamp(5rem, 15vw, 8rem)', 
          fontWeight: 900, 
          margin: 0, 
          letterSpacing: '-5px',
          background: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.primary} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 15px ${theme.primary}44)`
        }}>
          404
        </h1>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 300, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '30px', opacity: 0.8 }}>
          Dimension Not Found
        </h2>

        {/* --- LIVE SEARCH BOX --- */}
        <div style={{ marginBottom: '40px' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
            <input 
              type="text"
              placeholder="Search Feed or Creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 25px',
                borderRadius: '100px',
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.card,
                color: theme.text,
                fontSize: '1rem',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = theme.secondary}
              onBlur={(e) => e.target.style.borderColor = theme.border}
            />
            <button type="submit" style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}>
              🔍
            </button>
          </form>
          <p style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.5 }}>
            Searching live across <b>Feed</b> and <b>Creators</b>
          </p>
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
              color: '#fff',
              padding: '12px 25px',
              borderRadius: '50px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: `0 5px 20px ${theme.primary}33`
            }}>
              GO HOME
            </div>
          </Link>

          <a href="https://onlycrave.com" style={{ textDecoration: 'none' }}>
            <div style={{ 
              border: `1px solid ${theme.secondary}`,
              color: theme.secondary,
              padding: '12px 25px',
              borderRadius: '50px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              backgroundColor: 'transparent'
            }}>
              VISIT ONLYCRAVE
            </div>
          </a>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div style={{ 
        marginTop: '60px', 
        opacity: 0.4, 
        fontSize: '0.7rem', 
        fontWeight: 700, 
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        Network Status: <span style={{ color: '#00ff88' }}>Online</span> | ONLYCRAVE GLOBAL
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

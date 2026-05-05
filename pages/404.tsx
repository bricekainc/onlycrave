import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Styling Constants
  const colors = {
    bg: '#050505',
    card: '#111111',
    text: '#ffffff',
    primary: '#e33cc7', // Pink
    secondary: '#2ddfff', // Cyan
    border: 'rgba(255,255,255,0.1)'
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulating the Live Feed Search
  // In a real app, you'd fetch the RSS/JSON from the URLs provided.
  // Here we filter the concept of those feeds.
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      // This is where we simulate finding content from your feeds
      // In production, this would be an API call to your backend/proxy
      setTimeout(() => {
        setResults([
          { title: "Trending Content", link: "https://onlycrave.com/rss/", type: "Feed" },
          { title: "Top Creators", link: "https://onlycrave.com/rss/creators/feed/", type: "Creator" },
        ]);
        setIsSearching(false);
      }, 500);
    } else {
      setResults([]);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{ 
      backgroundColor: colors.bg, 
      color: colors.text, 
      minHeight: '100vh', 
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px'
    }}>
      <Head>
        <title>Lost? Let's find something better | OnlyCrave</title>
      </Head>

      {/* --- BACKGROUND GLOW --- */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: `radial-gradient(circle, ${colors.primary}11 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ maxWidth: '700px', width: '100%', zIndex: 1, textAlign: 'center' }}>
        
        {/* --- HEADER --- */}
        <div style={{ marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '120px', 
            fontWeight: 900, 
            margin: 0, 
            background: `linear-gradient(to bottom, #fff 30%, ${colors.primary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-5px'
          }}>
            404
          </h1>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginTop: '-20px' }}>
            We couldn't find that page.
          </h2>
          <p style={{ opacity: 0.6, fontSize: '16px' }}>
            But we can help you find what you're looking for right now.
          </p>
        </div>

        {/* --- LIVE SEARCH ENGINE --- */}
        <div style={{ marginBottom: '30px', position: 'relative' }}>
          <input 
            type="text"
            placeholder="Type to search creators or feeds..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '20px 30px',
              borderRadius: '20px',
              border: `2px solid ${searchQuery ? colors.secondary : colors.border}`,
              backgroundColor: colors.card,
              color: '#fff',
              fontSize: '18px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: searchQuery ? `0 0 30px ${colors.secondary}22` : 'none'
            }}
          />
          
          {/* --- SEARCH RESULTS DROPDOWN --- */}
          {searchQuery.length > 0 && (
            <div style={{
              marginTop: '10px',
              backgroundColor: colors.card,
              borderRadius: '15px',
              border: `1px solid ${colors.border}`,
              textAlign: 'left',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              {results.length > 0 ? (
                results.map((item, i) => (
                  <a key={i} href={item.link} style={{ 
                    display: 'block', 
                    padding: '15px 25px', 
                    textDecoration: 'none',
                    borderBottom: i !== results.length - 1 ? `1px solid ${colors.border}` : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ color: colors.secondary, fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>{item.type}</div>
                    <div style={{ color: '#fff', fontSize: '16px' }}>{item.title} containing "{searchQuery}"</div>
                  </a>
                ))
              ) : (
                <div style={{ padding: '20px', opacity: 0.5 }}>
                  {isSearching ? 'Searching our feeds...' : 'Keep typing to see results...'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- QUICK ACTIONS --- */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '60px' }}>
          <Link href="/" style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{ 
              padding: '15px', 
              borderRadius: '12px', 
              backgroundColor: '#fff', 
              color: '#000', 
              fontWeight: 700 
            }}>
              Go Home
            </div>
          </Link>
          <a href="https://onlycrave.com" style={{ textDecoration: 'none', flex: 1 }}>
            <div style={{ 
              padding: '15px', 
              borderRadius: '12px', 
              border: `1px solid ${colors.border}`, 
              color: '#fff', 
              fontWeight: 700,
              backgroundColor: 'rgba(255,255,255,0.05)'
            }}>
              Visit OnlyCrave
            </div>
          </a>
        </div>

        {/* --- FOOTER --- */}
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '30px' }}>
          <p style={{ fontSize: '12px', opacity: 0.4, letterSpacing: '2px' }}>
            ONLYCRAVE DIRECTORY SERVICES
          </p>
        </div>

      </div>

      <style jsx global>{`
        body { background: #050505; margin: 0; }
        input::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allContent, setAllContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    bg: '#050505',
    card: '#111111',
    text: '#ffffff',
    primary: '#e33cc7',
    secondary: '#2ddfff',
    border: 'rgba(255,255,255,0.1)'
  };

  // 1. Fetch and Parse Feeds on load
  useEffect(() => {
    setMounted(true);
    const feeds = [
      { url: 'https://onlycrave.com/feed/', type: 'Post' },
      { url: 'https://onlycrave.com/creators/feed/', type: 'Creator' }
    ];

    const loadFeeds = async () => {
      try {
        const results = await Promise.all(feeds.map(async (f) => {
          // Using a public proxy to bypass CORS restrictions
          const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(f.url)}`);
          const data = await res.json();
          const parser = new DOMParser();
          const xml = parser.parseFromString(data.contents, "text/xml");
          const items = Array.from(xml.querySelectorAll("item"));
          
          return items.map(item => ({
            title: item.querySelector("title")?.textContent || "Untitled",
            link: item.querySelector("link")?.textContent || "#",
            type: f.type,
            // Clean up description if needed
            desc: item.querySelector("description")?.textContent?.replace(/<[^>]*>/g, '').substring(0, 60) + '...'
          }));
        }));
        
        setAllContent(results.flat());
      } catch (err) {
        console.error("Feed load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadFeeds();
  }, []);

  // 2. Filter content as the user types
  const filteredResults = useMemo(() => {
    if (!searchQuery) return [];
    return allContent.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Limit to top 5 results for beauty
  }, [searchQuery, allContent]);

  if (!mounted) return null;

  return (
    <div style={{ 
      backgroundColor: colors.bg, color: colors.text, minHeight: '100vh', 
      fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '40px 20px'
    }}>
      <Head><title>Page Not Found | OnlyCrave Discovery</title></Head>

      <div style={{ maxWidth: '650px', width: '100%', zIndex: 1, textAlign: 'center' }}>
        
        <h1 style={{ 
          fontSize: '120px', fontWeight: 900, margin: '20px 0', 
          background: `linear-gradient(to bottom, #fff, ${colors.primary})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>404</h1>
        
        <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Oops! That page wandered off.</h2>
        <p style={{ opacity: 0.6, marginBottom: '40px' }}>Search below to find creators or trending posts instantly.</p>

        {/* --- LIVE SEARCH --- */}
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <input 
            type="text"
            placeholder={loading ? "Waking up the search engine..." : "Search for a creator or topic..."}
            disabled={loading}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '18px 25px', borderRadius: '15px',
              border: `1px solid ${searchQuery ? colors.secondary : colors.border}`,
              backgroundColor: colors.card, color: '#fff', fontSize: '16px', outline: 'none'
            }}
          />

          {searchQuery && (
            <div style={{
              position: 'absolute', top: '70px', left: 0, right: 0,
              backgroundColor: colors.card, borderRadius: '15px',
              border: `1px solid ${colors.border}`, textAlign: 'left',
              overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', zIndex: 10
            }}>
              {filteredResults.length > 0 ? (
                filteredResults.map((item, i) => (
                  <a key={i} href={item.link} style={{ 
                    display: 'block', padding: '15px 20px', textDecoration: 'none',
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    <span style={{ color: colors.secondary, fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>{item.type}</span>
                    <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{item.title}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>{item.desc}</div>
                  </a>
                ))
              ) : (
                <div style={{ padding: '20px', color: '#666' }}>No matches found. Try another name!</div>
              )}
            </div>
          )}
        </div>

        {/* --- ACTIONS --- */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link href="/" style={{ flex: 1, textDecoration: 'none' }}>
            <div style={{ padding: '15px', borderRadius: '12px', background: '#fff', color: '#000', fontWeight: 700 }}>Go Home</div>
          </Link>
          <a href="https://onlycrave.com" style={{ flex: 1, textDecoration: 'none' }}>
            <div style={{ padding: '15px', borderRadius: '12px', border: `1px solid ${colors.border}`, color: '#fff' }}>OnlyCrave Web</div>
          </a>
        </div>

      </div>

      <style jsx global>{`
        body { background: #050505; margin: 0; }
        input:focus { box-shadow: 0 0 20px ${colors.secondary}33; }
      `}</style>
    </div>
  );
}

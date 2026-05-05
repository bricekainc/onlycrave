import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allContent, setAllContent] = useState<any[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const colors = {
    bg: '#050505',
    card: '#111111',
    text: '#ffffff',
    primary: '#e33cc7',
    secondary: '#2ddfff',
    border: 'rgba(255,255,255,0.1)'
  };

  useEffect(() => {
    setMounted(true);
    
    // The feeds we want to "Live Search"
    const feeds = [
      { url: 'https://onlycrave.com/feed/', type: 'Post' },
      { url: 'https://onlycrave.com/creators/feed/', type: 'Creator' }
    ];

    const fetchFeeds = async () => {
      try {
        const results = await Promise.all(feeds.map(async (feedInfo) => {
          // We use a proxy (allorigins) to get around browser security blocks
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feedInfo.url)}`);
          const data = await response.json();
          
          // Convert the raw text into searchable items
          const parser = new DOMParser();
          const xml = parser.parseFromString(data.contents, "text/xml");
          const items = Array.from(xml.querySelectorAll("item"));
          
          return items.map(item => ({
            title: item.querySelector("title")?.textContent || "Untitled",
            link: item.querySelector("link")?.textContent || "#",
            type: feedInfo.type,
            // Removes messy HTML tags from descriptions
            desc: item.querySelector("description")?.textContent?.replace(/<[^>]*>/g, '').substring(0, 80) + '...'
          }));
        }));
        
        setAllContent(results.flat());
        setStatus('ready');
      } catch (err) {
        console.error("Search engine failed to sync:", err);
        setStatus('error');
      }
    };

    fetchFeeds();
  }, []);

  // Filtering logic: Finds matches as you type
  const filteredResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];
    return allContent.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.type.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [searchQuery, allContent]);

  if (!mounted) return null;

  return (
    <div style={{ 
      backgroundColor: colors.bg, color: colors.text, minHeight: '100vh', 
      fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '60px 20px', position: 'relative', overflowX: 'hidden'
    }}>
      <Head>
        <title>Something went wrong | OnlyCrave</title>
      </Head>

      {/* Decorative Neon Blur */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px',
        background: `radial-gradient(circle, ${colors.primary}22 0%, transparent 70%)`,
        filter: 'blur(60px)', zIndex: 0
      }} />

      <div style={{ maxWidth: '600px', width: '100%', zIndex: 1, textAlign: 'center' }}>
        
        {/* --- HEADER --- */}
        <h1 style={{ 
          fontSize: '140px', fontWeight: 900, margin: 0, lineHeight: 1,
          background: `linear-gradient(to bottom, #fff, ${colors.primary})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '-8px'
        }}>404</h1>
        
        <h2 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Lost in space?
        </h2>
        <p style={{ opacity: 0.5, marginBottom: '40px', fontSize: '16px' }}>
          We couldn't find that page, but our live feed is still active.
        </p>

        {/* --- SEARCH BOX --- */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', backgroundColor: colors.card,
            borderRadius: '20px', border: `1px solid ${searchQuery ? colors.secondary : colors.border}`,
            padding: '5px 20px', transition: 'all 0.3s ease',
            boxShadow: searchQuery ? `0 0 25px ${colors.secondary}15` : 'none'
          }}>
            <span style={{ fontSize: '20px', marginRight: '15px', opacity: 0.5 }}>🔍</span>
            <input 
              type="text"
              placeholder={status === 'loading' ? "Syncing live feeds..." : "Search creators or topics..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '15px 0', background: 'transparent',
                border: 'none', color: '#fff', fontSize: '16px', outline: 'none'
              }}
            />
            {status === 'loading' && (
               <div className="spinner" style={{ width: '15px', height: '15px', border: '2px solid #333', borderTopColor: colors.secondary, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            )}
          </div>

          {/* --- RESULTS DROPDOWN --- */}
          {searchQuery && (
            <div style={{
              position: 'absolute', top: '75px', left: 0, right: 0,
              backgroundColor: colors.card, borderRadius: '20px',
              border: `1px solid ${colors.border}`, textAlign: 'left',
              overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', zIndex: 10,
              backdropFilter: 'blur(10px)'
            }}>
              {filteredResults.length > 0 ? (
                filteredResults.map((item, i) => (
                  <a key={i} href={item.link} style={{ 
                    display: 'block', padding: '18px 25px', textDecoration: 'none',
                    borderBottom: i !== filteredResults.length - 1 ? `1px solid ${colors.border}` : 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{item.title}</div>
                      <span style={{ fontSize: '10px', color: colors.secondary, fontWeight: 800, border: `1px solid ${colors.secondary}44`, padding: '2px 8px', borderRadius: '4px' }}>
                        {item.type}
                      </span>
                    </div>
                    <div style={{ color: '#777', fontSize: '12px', marginTop: '4px' }}>{item.desc}</div>
                  </a>
                ))
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', opacity: 0.5 }}>
                  No results for "{searchQuery}". Try searching "Crave" or "New".
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- BUTTONS --- */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
          <Link href="/" style={{ flex: 1, textDecoration: 'none' }}>
            <div style={{ 
              padding: '16px', borderRadius: '15px', background: '#fff', 
              color: '#000', fontWeight: 800, fontSize: '14px', transition: 'transform 0.2s' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Back to Home
            </div>
          </Link>
          <a href="https://onlycrave.com" style={{ flex: 1, textDecoration: 'none' }}>
            <div style={{ 
              padding: '16px', borderRadius: '15px', border: `1px solid ${colors.border}`, 
              color: '#fff', fontWeight: 800, fontSize: '14px', backgroundColor: 'rgba(255,255,255,0.03)' 
            }}>
              Visit OnlyCrave
            </div>
          </a>
        </div>

        {/* --- FOOTER STATUS --- */}
        <div style={{ marginTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: 0.3 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00ff88' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '2px' }}>SYSTEMS OPERATIONAL</span>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        body { background-color: #050505; margin: 0; }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}

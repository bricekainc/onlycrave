import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Parser from 'rss-parser';

export async function getStaticProps() {
  const parser = new Parser();
  let creators: any[] = [];

  // List of all Google Alert Feeds provided
  const googleFeeds = [
    'https://www.google.com/alerts/feeds/01441943357185983502/10271601532123878621',
    'https://www.google.com/alerts/feeds/01441943357185983502/9761647876109762227',
    'https://www.google.com/alerts/feeds/01441943357185983502/13120870724569043521',
    'https://www.google.com/alerts/feeds/01441943357185983502/15721545087151547856',
    'https://www.google.com/alerts/feeds/01441943357185983502/4153531990675198701',
    'https://www.google.com/alerts/feeds/01441943357185983502/14140302812017746122',
    'https://www.google.com/alerts/feeds/01441943357185983502/7146660539207966665',
    'https://www.google.com/alerts/feeds/01441943357185983502/12893446076237304652',
    'https://www.google.com/alerts/feeds/01441943357185983502/6907578491817998773',
    'https://www.google.com/alerts/feeds/01441943357185983502/7654207322957982057'
  ];

  // 1. Fetch all Google Alerts in Parallel
  const googleResults = await Promise.allSettled(
    googleFeeds.map(url => parser.parseURL(url))
  );

  googleResults.forEach(result => {
    if (result.status === 'fulfilled') {
      const items = result.value.items.map(item => {
        const cleanName = (item.title || 'Verified Creator').replace(/<\/?[^>]+(>|$)/g, "");
        return {
          name: cleanName,
          // Generate SEO-friendly slug
          slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          username: 'Verified Network',
          avatar: 'https://raw.githubusercontent.com/bricekainc/onlycrave/main/lib/favicon.ico',
          isFallback: true
        };
      });
      creators = [...creators, ...items];
    }
  });

  // 2. Attempt to fetch internal site data
  try {
    const res = await fetch('https://onlycrave.com/rss/creators/feed');
    if (res.ok) {
      const internalData = await res.json();
      const formattedInternal = internalData.map((c: any) => ({
        name: c.name,
        slug: c.username.toLowerCase(),
        username: c.username,
        avatar: c.avatar || 'https://raw.githubusercontent.com/bricekainc/onlycrave/main/lib/favicon.ico',
        isFallback: false
      }));
      creators = [...creators, ...formattedInternal];
    }
  } catch (e) {
    console.error("Internal Feed Failed");
  }

  // Remove duplicates based on slug
  const uniqueCreators = Array.from(new Map(creators.map(item => [item.slug, item])).values());

  return {
    props: { creators: uniqueCreators },
    revalidate: 60
  };
}

export default function CreatorsPage({ creators }: { creators: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const router = useRouter();

  const loadingMessages = ["Syncing Network...", "Bypassing Cloudflare...", "Finalizing Data..."];

  const filtered = creators.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isProcessing) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <div className="loader"></div>
        <p style={{ marginTop: '20px', letterSpacing: '2px' }}>{loadingMessages[loadingStep]}</p>
        <style jsx>{`.loader { width: 50px; height: 50px; border: 2px solid #333; border-top-color: #2ddfff; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <Head>
        <title>OnlyCrave Creator Directory | 2026 Network</title>
        <meta name="description" content="Official directory of verified OnlyCrave creators." />
      </Head>
      
      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1.5px' }}>Verified Creators</h1>
          <div style={{ maxWidth: '500px', margin: '20px auto' }}>
            <input 
              type="text" 
              placeholder="Search by name or keyword..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '15px 25px', borderRadius: '50px', background: '#111', border: '1px solid #222', color: '#fff', outline: 'none' }}
            />
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filtered.map((creator, i) => (
            <Link 
              key={i} 
              href={`/creators/${creator.slug}`} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ 
                background: '#0a0a0a', 
                border: '1px solid #1a1a1a', 
                padding: '20px', 
                borderRadius: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2ddfff';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1a1a1a';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <img src={creator.avatar} alt="" style={{ width: '55px', height: '55px', borderRadius: '14px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px' }}>{creator.name}</div>
                  <div style={{ color: '#2ddfff', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                    VIEW PROFILE
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#444' }}>
            No creators found matching "{searchTerm}"
          </div>
        )}
      </main>
    </div>
  );
}

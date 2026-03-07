import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { getCreators } from '../lib/getCreators';
import Parser from 'rss-parser';

export async function getStaticProps() {
  const parser = new Parser();
  let creators = [];
  
  try {
    // 1. Attempt Primary Feed
    const primaryData = await getCreators();
    if (primaryData && primaryData.length > 0) {
      creators = primaryData;
    }
  } catch (e) {
    console.error("Primary Feed Failed, falling back to Google Alerts");
  }

  // 2. Fetch Google Alerts Feed as Fallback or Supplement
  try {
    const googleFeed = await parser.parseURL('https://www.google.com/alerts/feeds/01441943357185983502/10271601532123878621');
    const fallbackItems = googleFeed.items.map(item => ({
      name: item.title,
      username: 'Verified',
      avatar: 'https://cdn-icons-png.flaticon.com/512/9148/9148935.png', // Default Icon
      isFallback: true,
      link: 'https://onlycrave.com/creators/' // Forced destination
    }));

    // Combine or use as total fallback
    creators = creators.length > 0 ? [...creators, ...fallbackItems] : fallbackItems;
  } catch (e) {
    console.error("Google Feed Failed");
  }

  return { 
    props: { creators }, 
    revalidate: 300 
  };
}

export default function AlternativesSearchPage({ creators }: { creators: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [creatorSearch, setCreatorSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const router = useRouter();

  const loadingMessages = [
    "Scanning creator databases...",
    "Bypassing secure protocols...",
    "Syncing with OnlyCrave Network...",
    "Comparing payouts & privacy...",
    "Generating 2026 intelligence report..."
  ];

  const triggerSearch = (targetSlug: string) => {
    setIsProcessing(true);
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      router.push(`/alternatives/${targetSlug.toLowerCase().replace(/\s+/g, '-')}`);
    }, 4500);
  };

  const filteredCreators = creators.filter(c => 
    c.name?.toLowerCase().includes(creatorSearch.toLowerCase()) ||
    c.username?.toLowerCase().includes(creatorSearch.toLowerCase())
  );

  if (isProcessing) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050505', color: '#fff' }}>
        <div className="loader"></div>
        <h2 style={{ marginTop: '2rem', fontWeight: '200', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem', color: '#2ddfff' }}>
          {loadingMessages[loadingStep]}
        </h2>
        <style jsx>{`
          .loader { width: 100px; height: 1px; background: rgba(255,255,255,0.1); position: relative; overflow: hidden; }
          .loader:after { content: ""; position: absolute; left: -100%; width: 100%; height: 100%; background: #2ddfff; animation: slide 1.2s infinite; }
          @keyframes slide { 100% { left: 100%; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Head>
        <title>Compare OnlyCrave with Any Platform | 2026 Market Analysis</title>
      </Head>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* --- COMPARISON HERO --- */}
        <section style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-2px' }}>
            OnlyCrave <span style={{ color: '#333' }}>vs</span> The World
          </h1>
          <p style={{ color: '#666', marginBottom: '40px' }}>Find the highest-paying platform for your content.</p>
          
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Enter platform (e.g. Fansly, Patreon)..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '20px 30px', borderRadius: '15px', background: '#111', border: '1px solid #222', color: '#fff', outline: 'none' }}
            />
            <button 
              onClick={() => triggerSearch(searchTerm)}
              style={{ position: 'absolute', right: '8px', top: '8px', padding: '12px 24px', borderRadius: '10px', border: 'none', background: '#2ddfff', color: '#000', fontWeight: 800, cursor: 'pointer' }}
            >
              ANALYZE
            </button>
          </div>
        </section>

        {/* --- CREATOR SEARCH ENGINE --- */}
        <section style={{ margin: '60px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #111', paddingBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Verified Network Feed</h2>
            <input 
              type="text" 
              placeholder="Search creators..." 
              onChange={(e) => setCreatorSearch(e.target.value)}
              style={{ background: '#111', border: '1px solid #222', padding: '10px 20px', borderRadius: '100px', color: '#fff', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredCreators.map((creator, i) => (
              <a 
                key={i} 
                href={creator.isFallback ? 'https://onlycrave.com/creators/' : `/${creator.username}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', transition: '0.3s' }} className="card">
                  <img src={creator.avatar} alt="" style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{creator.name}</div>
                    <div style={{ color: creator.isFallback ? '#ff3e80' : '#2ddfff', fontSize: '0.8rem' }}>
                      {creator.isFallback ? 'NETWORK SYNCED' : `@${creator.username}`}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* --- SEO ARTICLE --- */}
        <article style={{ marginTop: '80px', borderTop: '1px solid #111', paddingTop: '60px', color: '#888', lineHeight: 1.8 }}>
          <h2 style={{ color: '#fff', marginBottom: '20px' }}>The 2026 Shift to OnlyCrave</h2>
          <p>
            In the current landscape, creator independence is paramount. Our analysis shows that moving to OnlyCrave reduces overhead costs by an average of 15% compared to legacy giants. Whether you are coming from <strong>OnlyFans</strong> or <strong>Fansly</strong>, the infrastructure provided here ensures faster settlements via M-Pesa and Crypto, bypassing traditional banking delays.
          </p>
        </article>

      </main>

      <style jsx>{`
        .card:hover { border-color: #2ddfff; transform: translateY(-3px); background: #111; }
      `}</style>
    </div>
  );
}

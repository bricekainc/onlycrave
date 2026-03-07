import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Parser from 'rss-parser';

export async function getStaticProps() {
  const parser = new Parser();
  let creators = [];
  
  // 1. Fetch Google Alerts Feed (The primary fallback/source you requested)
  try {
    const googleFeed = await parser.parseURL('https://www.google.com/alerts/feeds/01441943357185983502/10271601532123878621');
    const googleItems = googleFeed.items.map(item => ({
      name: item.title.replace(/<\/?[^>]+(>|$)/g, ""), // Clean HTML tags from Google titles
      username: 'Verified Network',
      avatar: 'https://raw.githubusercontent.com/bricekainc/onlycrave/main/lib/favicon.ico', 
      isFallback: true,
      link: 'https://onlycrave.com/creators/' // Forced link as requested
    }));
    creators = [...googleItems];
  } catch (e) {
    console.error("Google Feed Failed");
  }

  // 2. Attempt to fetch local site data if available (Optional backup)
  try {
    const res = await fetch('https://onlycrave.com/rss/creators/feed');
    if (res.ok) {
      const internalData = await res.json(); // Assuming JSON, adjust if it's XML
      const formattedInternal = internalData.map((c: any) => ({
        ...c,
        isFallback: false,
        link: `https://onlycrave.com/${c.username}`
      }));
      creators = [...creators, ...formattedInternal];
    }
  } catch (e) {
    // Silently fail if primary site is down or blocking
  }

  return { 
    props: { creators }, 
    revalidate: 60 // Refresh every minute
  };
}

export default function CreatorsPage({ creators }: { creators: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const router = useRouter();

  const loadingMessages = ["Syncing Network...", "Bypassing Cloudflare...", "Finalizing Data..."];

  const triggerSearch = (slug: string) => {
    setIsProcessing(true);
    const interval = setInterval(() => setLoadingStep(s => (s < 2 ? s + 1 : s)), 1000);
    setTimeout(() => {
      clearInterval(interval);
      router.push(`/alternatives/${slug.toLowerCase().replace(/\s+/g, '-')}`);
    }, 3000);
  };

  const filtered = creators.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
      <Head><title>OnlyCrave Creator Directory | 2026</title></Head>
      
      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Verified Creators</h1>
          <div style={{ maxWidth: '500px', margin: '20px auto' }}>
            <input 
              type="text" 
              placeholder="Search the 2026 network..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '15px 25px', borderRadius: '50px', background: '#111', border: '1px solid #222', color: '#fff', outline: 'none' }}
            />
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filtered.map((creator, i) => (
            <a key={i} href={/creators/${creator.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px', transition: '0.2s' }}>
                <img src={creator.avatar} alt="" style={{ width: '55px', height: '55px', borderRadius: '15px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>{creator.name}</div>
                  <div style={{ color: '#2ddfff', fontSize: '0.8rem', fontWeight: 'bold' }}>{creator.username.toUpperCase()}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}

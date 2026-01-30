import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getCreators } from '../lib/fetchCreators';

export async function getServerSideProps() {
  const creators = await getCreators();
  return { props: { creators } };
}

export default function Home({ creators }: { creators: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [birthDate, setBirthDate] = useState('');
  const [ageError, setAgeError] = useState('');

  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
  }, []);

  const filteredCreators = creators.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (creator: any) => {
    setSelectedCreator(creator);
    setShowAgeGate(true);
  };

  const verifyAge = () => {
    if (!birthDate) return setAgeError("Please enter your birth date.");
    const birth = new Date(birthDate);
    const age = new Date().getFullYear() - birth.getFullYear();
    if (age >= 18) {
      window.open(selectedCreator.link, '_blank');
      setShowAgeGate(false);
    } else {
      setAgeError("Warning: Access denied. You must be 18+.");
    }
  };

  const theme = {
    bg: isDarkMode ? '#0a0a0c' : '#ffffff',
    card: isDarkMode ? '#16161a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#1a1a1b',
    primary: '#e33cc7', // OnlyCrave Pink
    secondary: '#2ddfff', // OnlyCrave Cyan
    accent: '#0102FD', // Your favorite Blue
    border: isDarkMode ? '#222' : '#eaeaea',
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', transition: '0.3s', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>OnlyCrave Search | Discover & Verify Elite Creators</title>
        <meta name="description" content="The official OnlyCrave directory. Discover and search over 500+ verified creators. Join the world's most authentic creator-fan connection platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* SEO Structured Data for AI */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": creators.slice(0, 10).map((c, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": c.name,
              "url": `https://onlycrave.com/${c.username}`
            }))
          })}
        </script>
      </Head>

      {/* --- FLOATING ACTIONS --- */}
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 999 }}>
        <a href="https://onlycrave.com/register" style={{ padding: '12px 24px', backgroundColor: theme.primary, color: '#fff', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 15px rgba(227,60,199,0.4)' }}>Sign Up</a>
        <a href="https://onlycrave.com/login" style={{ padding: '12px 24px', backgroundColor: theme.secondary, color: '#000', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 15px rgba(45,223,255,0.4)' }}>Login</a>
      </div>

      <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999, backgroundColor: theme.card, border: `1px solid ${theme.border}`, borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', fontSize: '20px' }}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* --- HERO SECTION --- */}
      <header style={{ padding: '80px 20px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: '900', margin: 0 }}>
          <span style={{ color: theme.primary }}>Only</span><span style={{ color: theme.secondary }}>Crave</span>
        </h1>
        <p style={{ maxWidth: '600px', margin: '20px auto', opacity: 0.8, fontSize: '1.1rem', lineHeight: '1.6' }}>
          Welcome to the elite directory of <strong>OnlyCrave Creators</strong>. We bridge the gap between world-class influencers and their most dedicated supporters. Secure, verified, and authentic.
        </p>

        {/* --- RESPONSIVE SEARCH --- */}
        <div style={{ width: '90%', maxWidth: '600px', margin: '40px auto 0' }}>
          <input 
            type="text" 
            placeholder="Search 500+ creators..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '20px 30px', borderRadius: '50px', border: `2px solid ${theme.primary}`, backgroundColor: theme.card, color: theme.text, fontSize: '1.1rem', outline: 'none', boxShadow: `0 0 20px ${theme.primary}22` }}
          />
          <p style={{ marginTop: '15px', opacity: 0.5, fontSize: '0.9rem' }}>Found {filteredCreators.length} verified creators</p>
        </div>
      </header>

      {/* --- GRID --- */}
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredCreators.map((c) => (
            <div key={c.username} style={{ backgroundColor: theme.card, borderRadius: '24px', padding: '24px', border: `1px solid ${theme.border}`, textAlign: 'center', transition: 'transform 0.2s' }}>
              <img src={c.avatar} alt={c.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${theme.secondary}`, marginBottom: '15px' }} />
              <h3 style={{ margin: '0 0 5px 0' }}>{c.name}</h3>
              <p style={{ color: theme.primary, fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '15px' }}>@{c.username}</p>
              <button onClick={() => window.location.href = `/${c.username}`} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: theme.accent, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>View & Subscribe</button>
            </div>
          ))}
        </div>

        {/* --- FAQ SECTION (SEO GOLD) --- */}
        <section style={{ marginTop: '100px', padding: '40px', backgroundColor: theme.card, borderRadius: '30px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <details style={{ padding: '15px', borderBottom: `1px solid ${theme.border}` }}>
              <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>What is OnlyCrave?</summary>
              <p style={{ marginTop: '10px', opacity: 0.7 }}>OnlyCrave is a premium subscription platform allowing creators to share exclusive content with their fans in a secure environment.</p>
            </details>
            <details style={{ padding: '15px', borderBottom: `1px solid ${theme.border}` }}>
              <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>How do I become a verified creator?</summary>
              <p style={{ marginTop: '10px', opacity: 0.7 }}>Visit the registration page and upload your ID for our safety team to review. Verification usually takes 24-48 hours.</p>
            </details>
          </div>
        </section>
      </main>

      {/* AGE GATE REMAINS SAME AS PREVIOUS CODE */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '30px', maxWidth: '400px', textAlign: 'center', border: `2px solid ${theme.primary}` }}>
            <h2>Confirm Your Age</h2>
            <p>You are about to view 18+ content. Please confirm you are an adult.</p>
            <input type="date" onChange={(e) => setBirthDate(e.target.value)} style={{ width: '100%', padding: '15px', margin: '20px 0', borderRadius: '10px' }} />
            {ageError && <p style={{ color: 'red' }}>{ageError}</p>}
            <button onClick={verifyAge} style={{ background: theme.primary, color: '#fff', padding: '15px 30px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Enter OnlyCrave</button>
          </div>
        </div>
      )}
    </div>
  );
}

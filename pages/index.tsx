import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getCreators } from '../lib/getCreators';

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

  // 1. Theme Logic (System preference + Toggle)
  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(initialColorValue);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // 2. Search Logic
  const filteredCreators = creators.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Age Verification Logic
  const handleViewProfile = (creator: any) => {
    setSelectedCreator(creator);
    setShowAgeGate(true);
  };

  const verifyAge = () => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age >= 18) {
      window.open(selectedCreator.link, '_blank');
      setShowAgeGate(false);
    } else {
      setAgeError("Access Denied: You must be 18 or older to view this content.");
    }
  };

  // 4. Styles (Dynamic based on theme)
  const theme = {
    bg: isDarkMode ? '#0f172a' : '#f8fafc',
    card: isDarkMode ? '#1e293b' : '#ffffff',
    text: isDarkMode ? '#f1f5f9' : '#0f172a',
    accent: '#e11d48', // OnlyCrave-inspired Crimson/Pink
    border: isDarkMode ? '#334155' : '#e2e8f0',
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', transition: 'all 0.3s ease' }}>
      <Head>
        <title>OnlyCrave Creators Directory | Discover Elite Verified Content</title>
        <meta name="description" content="Official OnlyCrave Creators Directory. Browse verified creators, search by username, and explore exclusive profiles in our SEO-optimized hub." />
        <meta name="keywords" content="OnlyCrave, Creators, Directory, Verified, Search, Adult Content, Elite Creators" />
        <link href="https://onlycrave.com/public/img/favicon-1768524718.png" rel="icon">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* --- FLOATING THEME TOGGLE --- */}
      <button 
        onClick={toggleTheme}
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100, backgroundColor: theme.accent, color: '#fff', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* --- HEADER & LOGO --- */}
      <header style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0' }}>
          <span style={{ color: theme.accent }}>Only</span>Crave
        </h1>
        <p style={{ opacity: 0.7 }}>Creators Directory</p>

        {/* --- SEARCH ENGINE --- */}
        <div style={{ marginTop: '30px', maxWidth: '600px', margin: '30px auto 0' }}>
          <input 
            type="text" 
            placeholder="Search creators by name or @username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '15px 25px', borderRadius: '30px', border: `1px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, fontSize: '1rem', outline: 'none' }}
          />
        </div>
      </header>

      {/* --- MAIN GRID --- */}
      <main style={{ padding: '0 20px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {filteredCreators.map((c) => (
            <div key={c.username} style={{ backgroundColor: theme.card, borderRadius: '20px', padding: '24px', border: `1px solid ${theme.border}`, textAlign: 'center', transition: 'transform 0.2s', cursor: 'default' }}>
              <img src={c.avatar} alt={c.name} style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${theme.accent}`, marginBottom: '16px' }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem' }}>{c.name}</h3>
              <p style={{ fontSize: '0.85rem', color: isDarkMode ? '#94a3b8' : '#64748b', height: '50px', overflow: 'hidden', marginBottom: '20px' }}>{c.description}</p>
              <button 
                onClick={() => handleViewProfile(c)}
                style={{ backgroundColor: theme.accent, color: '#fff', padding: '12px 24px', borderRadius: '12px', border: 'none', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* --- AGE VERIFICATION MODAL --- */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', border: `1px solid ${theme.accent}` }}>
            <h2 style={{ color: theme.accent, marginBottom: '10px' }}>18+ Safety Check</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>You are about to visit an adult content website. Please verify your age to continue.</p>
            
            <input 
              type="date" 
              onChange={(e) => setBirthDate(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}`, marginBottom: '15px', backgroundColor: theme.bg, color: theme.text }}
            />
            
            {ageError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '15px' }}>{ageError}</p>}
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowAgeGate(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#64748b', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={verifyAge} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: theme.accent, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Verify & Enter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

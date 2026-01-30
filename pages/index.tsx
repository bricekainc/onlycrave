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

  // 1. Theme Logic (Respect System Preference)
  useEffect(() => {
    const root = window.document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // 2. Search Logic
  const filteredCreators = creators.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Age Verification
  const handleViewProfile = (creator: any) => {
    setSelectedCreator(creator);
    setShowAgeGate(true);
  };

  const verifyAge = () => {
    if (!birthDate) return setAgeError("Please enter your birth date.");
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    if (age >= 18) {
      window.open(selectedCreator.link, '_blank');
      setShowAgeGate(false);
    } else {
      setAgeError("Warning: This site contains 18+ content. You must be of legal age to enter.");
    }
  };

  // 4. OnlyCrave Brand Colors
  const theme = {
    bg: isDarkMode ? '#0a0a0c' : '#ffffff',
    card: isDarkMode ? '#16161a' : '#f4f4f9',
    text: isDarkMode ? '#ffffff' : '#0a0a0c',
    primary: '#e33cc7', // OnlyCrave Pink
    secondary: '#2ddfff', // OnlyCrave Cyan
    border: isDarkMode ? '#222' : '#ddd',
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', transition: '0.3s', fontFamily: 'Inter, sans-serif' }}>
      <Head>
        <title>OnlyCrave Creators Directory | Discover Elite Models</title>
        <meta name="description" content="Discover and search verified creators on the official OnlyCrave Creators Directory. Your gateway to exclusive 18+ content profiles." />
        <meta name="keywords" content="OnlyCrave, creator directory, search creators, 18+ content, verified models" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* --- FLOATING THEME TOGGLE --- */}
      <button 
        onClick={toggleTheme}
        style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 100, backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '50%', width: '56px', height: '56px', cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', fontSize: '20px' }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* --- HEADER --- */}
      <header style={{ padding: '60px 20px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px' }}>
          <span style={{ color: theme.primary }}>Only</span><span style={{ color: theme.secondary }}>Crave</span>
        </h1>
        <p style={{ opacity: 0.6, fontSize: '1.1rem', marginTop: '5px' }}>Creators Directory</p>

        {/* --- SEARCH BAR --- */}
        <div style={{ marginTop: '40px', maxWidth: '500px', margin: '40px auto 0' }}>
          <input 
            type="text" 
            placeholder="Search by name or @username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '18px 30px', borderRadius: '40px', border: `2px solid ${theme.border}`, backgroundColor: theme.card, color: theme.text, fontSize: '1rem', outline: 'none', transition: '0.2s' }}
          />
        </div>
      </header>

      {/* --- CREATOR GRID --- */}
      <main style={{ padding: '0 20px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
          {filteredCreators.map((c) => (
            <div key={c.username} style={{ backgroundColor: theme.card, borderRadius: '25px', padding: '30px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
              <img src={c.avatar} alt={c.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${theme.primary}`, marginBottom: '20px' }} />
              <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{c.name}</h2>
              <p style={{ fontSize: '0.9rem', color: isDarkMode ? '#aaa' : '#666', marginBottom: '25px', height: '40px', overflow: 'hidden' }}>{c.description.substring(0, 80)}...</p>
              <button 
                onClick={() => handleViewProfile(c)}
                style={{ background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`, color: '#fff', border: 'none', padding: '14px', borderRadius: '15px', width: '100%', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* --- SAFETY CHECK MODAL --- */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '30px', maxWidth: '420px', width: '100%', textAlign: 'center', border: `2px solid ${theme.primary}` }}>
            <h2 style={{ color: theme.primary, marginBottom: '15px' }}>Age Verification</h2>
            <p style={{ fontSize: '0.95rem', marginBottom: '25px', lineHeight: '1.5' }}>
              This is a <strong>18+ adult content website</strong>. Please enter your birth date to confirm you are of legal age to view this profile.
            </p>
            
            <input 
              type="date" 
              onChange={(e) => setBirthDate(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '12px', border: `1px solid ${theme.border}`, marginBottom: '20px', backgroundColor: theme.bg, color: theme.text }}
            />
            
            {ageError && <p style={{ color: '#ff4d4d', fontSize: '0.85rem', marginBottom: '20px' }}>{ageError}</p>}
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setShowAgeGate(false)} style={{ flex: 1, padding: '15px', borderRadius: '12px', border: 'none', backgroundColor: '#444', color: '#fff', cursor: 'pointer' }}>Exit</button>
              <button onClick={verifyAge} style={{ flex: 2, padding: '15px', borderRadius: '12px', border: 'none', background: theme.primary, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Enter Site</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

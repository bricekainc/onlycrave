import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCreators } from '../lib/fetchCreators';

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const creators = await getCreators();
  const creator = creators.find((c: any) => c.username.toLowerCase() === username.toLowerCase());

  if (!creator) return { notFound: true };

  return { props: { creator } };
}

export default function CreatorProfile({ creator }: { creator: any }) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [ageError, setAgeError] = useState('');

  // 1. Theme Sync with Home Page
  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
  }, []);

  const theme = {
    bg: isDarkMode ? '#0a0a0c' : '#ffffff',
    card: isDarkMode ? '#16161a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#1a1a1b',
    primary: '#e33cc7', // OnlyCrave Pink
    secondary: '#2ddfff', // OnlyCrave Cyan
    blue: '#0102FD',
    border: isDarkMode ? '#222' : '#eaeaea',
  };

  // 2. SEO Content Generation
  const faqText = `How to subscribe to ${creator.name}: Log in to OnlyCrave and use PayPal, Card, or M-Pesa. You can also deposit to your wallet via Coinbase, CoinPayments, or Bank Transfer.`;
  const fullMetaDescription = `${creator.description.substring(0, 150)}... ${faqText}`;

  // 3. Age Verification Logic
  const verifyAndRedirect = () => {
    if (!birthDate) return setAgeError("Please enter your birth date.");
    const birth = new Date(birthDate);
    const age = new Date().getFullYear() - birth.getFullYear();
    if (age >= 18) {
      window.location.href = creator.link;
    } else {
      setAgeError("Access Denied: You must be 18 or older.");
    }
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: 'Inter, sans-serif', transition: '0.3s' }}>
      <Head>
        <title>{creator.name} (@{creator.username}) | Verified OnlyCrave Creator</title>
        <meta name="description" content={fullMetaDescription} />
        <meta name="keywords" content={`${creator.name}, ${creator.username}, OnlyCrave, subscribe, verified creator, adult content, Mpesa payments OnlyCrave`} />
        
        {/* Open Graph for Social Media */}
        <meta property="og:title" content={`${creator.name} on OnlyCrave`} />
        <meta property="og:description" content={creator.description.substring(0, 160)} />
        <meta property="og:image" content={creator.avatar} />
        <meta name="google-site-verification" content="wsBEVCOeRh045P5uzn7Gk0kEjgf7eqshyP3XuDIKGn4" />
      </Head>

      <main style={{ maxWidth: '750px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Back Button */}
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', fontWeight: 'bold', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          ← Back to Directory
        </button>

        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={creator.avatar} alt={creator.name} style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', border: `5px solid ${theme.primary}`, boxShadow: `0 10px 30px ${theme.primary}33` }} />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: theme.secondary, color: '#000', borderRadius: '50%', padding: '5px', fontSize: '12px' }}>✓</div>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginTop: '20px', marginBottom: '5px' }}>{creator.name}</h1>
          <p style={{ color: theme.primary, fontSize: '1.2rem', fontWeight: 'bold' }}>@{creator.username}</p>
        </div>

        {/* Bio Card */}
        <div style={{ backgroundColor: theme.card, padding: '35px', borderRadius: '30px', border: `1px solid ${theme.border}`, marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: theme.secondary }}>About</h2>
          <p style={{ lineHeight: '1.8', opacity: 0.9, fontSize: '1.05rem' }}>{creator.description}</p>
        </div>

        {/* Beautiful FAQ & Payment Card */}
        <div style={{ backgroundColor: theme.card, padding: '35px', borderRadius: '30px', border: `2px solid ${theme.blue}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px 20px', background: theme.blue, color: '#fff', fontSize: '0.8rem', fontWeight: 'bold', borderBottomLeftRadius: '20px' }}>OFFICIAL PAYMENT GUIDE</div>
          
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>How to Subscribe</h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ color: theme.primary, fontWeight: 'bold' }}>01</div>
              <p><strong>Direct Checkout:</strong> Log in and click "Subscribe" to pay instantly via <strong>PayPal, Credit Card, or M-Pesa</strong>.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ color: theme.primary, fontWeight: 'bold' }}>02</div>
              <p><strong>Wallet Method:</strong> Deposit funds to your <a href="https://onlycrave.com/my/wallet" style={{ color: theme.secondary }}>OnlyCrave Wallet</a> using <strong>CoinPayments, Coinbase, Atlos, or Bank Transfer</strong>.</p>
            </div>
          </div>

          <button 
            onClick={() => setShowAgeGate(true)}
            style={{ width: '100%', padding: '20px', marginTop: '30px', borderRadius: '20px', border: 'none', background: `linear-gradient(90deg, ${theme.blue}, ${theme.primary})`, color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
          >
            Subscribe to {creator.name}
          </button>
        </div>

        {/* Secondary FAQ for SEO */}
        <section style={{ marginTop: '50px', opacity: 0.8 }}>
          <details style={{ padding: '15px 0', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            <summary style={{ fontWeight: 'bold' }}>Can I pay for {creator.name} with M-Pesa?</summary>
            <p style={{ paddingTop: '10px' }}>Yes! OnlyCrave supports direct M-Pesa payments. Simply ensure you are logged in and select the M-Pesa option at checkout.</p>
          </details>
        </section>
      </main>

      {/* --- AGE VERIFICATION MODAL --- */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '35px', maxWidth: '420px', width: '100%', textAlign: 'center', border: `2px solid ${theme.primary}` }}>
            <h2 style={{ color: theme.primary, marginBottom: '15px' }}>18+ Safety Check</h2>
            <p style={{ marginBottom: '25px', opacity: 0.8 }}>Please verify your age to view {creator.name}'s exclusive content.</p>
            
            <input 
              type="date" 
              onChange={(e) => setBirthDate(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '15px', border: `1px solid ${theme.border}`, marginBottom: '20px', backgroundColor: theme.bg, color: theme.text }}
            />
            
            {ageError && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '20px' }}>{ageError}</p>}
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setShowAgeGate(false)} style={{ flex: 1, padding: '15px', borderRadius: '15px', border: 'none', backgroundColor: '#444', color: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={verifyAndRedirect} style={{ flex: 2, padding: '15px', borderRadius: '15px', border: 'none', background: theme.primary, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Confirm & Enter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

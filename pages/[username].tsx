import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCreators } from '../lib/getCreators';

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const creators = await getCreators();
  const creator = creators.find((c: any) => c.username.toLowerCase() === username.toLowerCase());

  if (!creator) return { notFound: true };

  return { props: { creator } };
}

export default function CreatorProfile({ creator }: { creator: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isFansnub, setIsFansnub] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [showAgeGate, setShowAgeGate] = useState(false);

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    if (host.includes('fansnub.com')) {
      setIsFansnub(true);
    }

    // Detect theme from localStorage (synced with index.tsx)
    const savedTheme = localStorage.getItem('crave-theme');
    if (savedTheme === 'light') {
      setResolvedTheme('light');
    } else if (savedTheme === 'dark') {
      setResolvedTheme('dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(systemDark ? 'dark' : 'light');
    }
  }, []);

  const theme = {
    bg: isFansnub ? '#050505' : (resolvedTheme === 'dark' ? '#0a0a0c' : '#ffffff'),
    card: isFansnub ? '#111111' : (resolvedTheme === 'dark' ? '#16161a' : '#f8f9fa'),
    text: isFansnub ? '#ffffff' : (resolvedTheme === 'dark' ? '#ffffff' : '#1a1a1b'),
    primary: '#e33cc7', 
    secondary: '#2ddfff', 
    blue: '#0102FD',
    border: isFansnub ? '#333' : (resolvedTheme === 'dark' ? '#222' : '#eaeaea'),
    muted: isFansnub ? '#666' : (resolvedTheme === 'dark' ? '#888' : '#666'),
  };

  const handleAgeVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      window.location.href = creator.link;
    } else {
      window.location.href = "https://onlycrave.com";
    }
  };

  if (!mounted) return <div style={{ background: '#0a0a0c', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: '0.3s' }}>
      <Head>
        <title>{creator.name} (@{creator.username}) | {isFansnub ? 'Fansnub Archive' : 'OnlyCrave Profile'}</title>
        <meta name="description" content={`Access ${creator.name}'s exclusive content. Fansnub has merged with OnlyCrave.`} />
        <meta property="og:image" content={creator.avatar} />
      </Head>

      {/* --- FANSNUB DOMAIN WARNING --- */}
      {isFansnub && (
        <div style={{ background: theme.blue, color: '#fff', padding: '15px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 800, borderBottom: `4px solid ${theme.primary}` }}>
          ⚠️ SECURITY NOTICE: Fansnub.com has moved to OnlyCrave. All subscriptions for {creator.name} are active.
        </div>
      )}

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Navigation */}
        <nav style={{ marginBottom: '40px' }}>
          <button 
            onClick={() => router.push('/')} 
            style={{ background: 'none', border: 'none', color: theme.secondary, cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontSize: '0.8rem' }}
          >
            ← BACK TO {isFansnub ? 'FANSNUB' : 'DIRECTORY'}
          </button>
        </nav>

        {/* Profile Header */}
        <header style={{ textAlign: 'center', marginBottom: '60px', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={creator.avatar} 
              alt={creator.name} 
              style={{ 
                width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', 
                border: `4px solid ${isFansnub ? theme.blue : theme.primary}`,
                filter: isFansnub ? 'grayscale(0.5) blur(2px)' : 'none', // Preview feel for Fansnub
                boxShadow: `0 20px 40px ${isFansnub ? '#000' : theme.primary + '33'}`
              }} 
            />
            {isFansnub && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, textShadow: '0 2px 10px #000', fontSize: '0.7rem' }}>
                MOVED TO ONLYCRAVE
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: theme.secondary, color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: `3px solid ${theme.bg}` }}>✓</div>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '950', marginTop: '25px', marginBottom: '5px', letterSpacing: '-1px' }}>{creator.name}</h1>
          <p style={{ color: theme.primary, fontSize: '1.2rem', fontWeight: '700' }}>@{creator.username}</p>
        </header>

        {/* Bio Section */}
        <section style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}`, marginBottom: '30px', filter: isFansnub ? 'blur(4px)' : 'none' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '12px', color: theme.secondary, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>Profile Bio</h2>
          <p style={{ lineHeight: '1.8', opacity: 0.8 }}>{creator.description}</p>
        </section>

        {/* CTA CARD */}
        <section style={{ 
          backgroundColor: isFansnub ? '#000' : theme.card, 
          padding: '40px', 
          borderRadius: '30px', 
          border: `2px solid ${isFansnub ? theme.primary : theme.blue}`, 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: isFansnub ? `0 0 40px ${theme.primary}22` : 'none'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 20px', background: isFansnub ? theme.primary : theme.blue, color: '#fff', fontSize: '0.7rem', fontWeight: 900, borderBottomLeftRadius: '20px' }}>
            {isFansnub ? 'MIGRATED PROFILE' : 'ENCRYPTED CONNECTION'}
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '20px' }}>
            {isFansnub ? 'Access fansnub contents here' : `Join ${creator.name}'s Inner Circle`}
          </h2>
          
          <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
             <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', background: theme.primary, borderRadius: '50%' }} />
                <p style={{ margin: 0, fontSize: '0.95rem' }}>Direct support via <strong>M-Pesa, PayPal, & Crypto</strong></p>
             </div>
             <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', background: theme.secondary, borderRadius: '50%' }} />
                <p style={{ margin: 0, fontSize: '0.95rem' }}>Immediate access to high-res media library</p>
             </div>
          </div>

          <button 
            onClick={() => setShowAgeGate(true)}
            style={{ 
              width: '100%', padding: '24px', borderRadius: '20px', border: 'none', 
              background: `linear-gradient(135deg, ${theme.blue} 0%, ${theme.primary} 100%)`, 
              color: '#fff', fontWeight: '900', fontSize: '1.3rem', cursor: 'pointer', 
              transition: 'transform 0.2s', boxShadow: '0 15px 30px rgba(1, 2, 253, 0.3)' 
            }}
          >
            {isFansnub ? 'PROCEED TO ONLYCRAVE' : 'UNLOCK FULL ACCESS'}
          </button>
        </section>

        {/* FAQ Section */}
        {!isFansnub && (
          <section style={{ marginTop: '60px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '30px', textAlign: 'center' }}>Member Support</h3>
            {[
              { q: `Is this the official OnlyCrave page for ${creator.name}?`, a: `Confirmed. This is the verified index for ${creator.name}. All payments are handled via OnlyCrave's secure 256-bit gateway.` },
              { q: "Can I pay using M-Pesa?", a: "Yes. Choose M-Pesa at the secure checkout. You will receive an instant push notification on your registered mobile number." }
            ].map((item, idx) => (
              <details key={idx} style={{ padding: '20px 0', borderBottom: `1px solid ${theme.border}` }}>
                <summary style={{ fontWeight: '800', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>
                  {item.q} <span style={{ color: theme.primary }}>+</span>
                </summary>
                <p style={{ paddingTop: '15px', color: theme.muted, fontSize: '0.9rem' }}>{item.a}</p>
              </details>
            ))}
          </section>
        )}
      </main>

      {/* --- AGE VERIFICATION MODAL --- */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '32px', maxWidth: '450px', width: '100%', textAlign: 'center', border: `2px solid ${theme.primary}` }}>
            <h2 style={{ color: theme.primary, fontSize: '2rem', fontWeight: 900 }}>AGE GATE</h2>
            <p style={{ margin: '20px 0 40px', opacity: 0.8 }}>Verify you are 18+ to access {creator.name}'s private vault.</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => handleAgeVerify(false)} style={{ flex: 1, padding: '20px', borderRadius: '15px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.text, fontWeight: '700' }}>EXIT</button>
              <button onClick={() => handleAgeVerify(true)} style={{ flex: 1, padding: '20px', borderRadius: '15px', background: theme.primary, border: 'none', color: '#fff', fontWeight: '900' }}>I AM 18+</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.4, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>
        ONLYCRAVE DIRECTORY // {isFansnub ? 'FANSNUB MIRROR' : 'VERIFIED ECOSYSTEM'} // {new Date().getFullYear()}
      </footer>
    </div>
  );
}

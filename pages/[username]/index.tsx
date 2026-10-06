import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCreators } from '../../lib/getCreators';

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const cleanUsername = username.toLowerCase();

  let creators = [];
  try {
    creators = await getCreators();
  } catch (err) {
    console.error("Error fetching creators list:", err);
  }

  // 1. Try to find the creator from your data source
  let creator = creators.find((c: any) => c.username?.toLowerCase() === cleanUsername);

  // 2. Fallback safety net for profiles like njokimurira in case the data source list isn't synced
  if (!creator && cleanUsername === 'njokimurira') {
    creator = {
      username: 'njokimurira',
      name: 'Njoki Murira',
      avatar: 'https://onlycrave.com/uploads/avatar-placeholder.jpg', 
      description: 'TikToker & Content Creator. Connect with fans and explore exclusive updates.'
    };
  }

  if (!creator) return { notFound: true };

  return { props: { creator } };
}

export default function CreatorProfile({ creator }: { creator: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [targetAction, setTargetAction] = useState<'subscribe' | 'tip'>('subscribe');

  useEffect(() => {
    setMounted(true);
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
    bg: resolvedTheme === 'dark' ? '#0a0a0c' : '#ffffff',
    card: resolvedTheme === 'dark' ? '#16161a' : '#f8f9fa',
    text: resolvedTheme === 'dark' ? '#ffffff' : '#1a1a1b',
    primary: '#e33cc7', 
    secondary: '#2ddfff', 
    blue: '#0102FD',
    border: resolvedTheme === 'dark' ? '#222' : '#eaeaea',
    muted: resolvedTheme === 'dark' ? '#888' : '#666',
  };

  const handleActionClick = (action: 'subscribe' | 'tip') => {
    setTargetAction(action);
    setShowAgeGate(true);
  };

  const handleAgeVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      if (targetAction === 'subscribe') {
        window.location.href = `https://onlycrave.com/${creator.username}`;
      } else {
        window.location.href = `https://your.onlycrave.com/${creator.username}/tip`;
      }
    } else {
      window.location.href = "https://onlycrave.com";
    }
  };

  if (!mounted) return <div style={{ background: '#0a0a0c', minHeight: '100vh' }} />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": creator.name,
      "alternateName": creator.username,
      "image": creator.avatar,
      "description": creator.description,
      "url": `https://onlycrave.com/${creator.username}`
    }
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: '0.3s' }}>
      <Head>
        <title>{creator.name} (@{creator.username}) - Official OnlyCrave Profile</title>
        <meta name="description" content={`Explore ${creator.name}'s official OnlyCrave profile. Subscribe or send a tip securely.`} />
        <meta property="og:title" content={`${creator.name} (@{creator.username}) | OnlyCrave`} />
        <meta property="og:image" content={creator.avatar} />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Navigation */}
        <nav style={{ marginBottom: '40px' }}>
          <button 
            onClick={() => router.push('/')} 
            style={{ background: 'none', border: 'none', color: theme.secondary, cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontSize: '0.8rem' }}
          >
            ← BACK TO ONLYCRAVE DIRECTORY
          </button>
        </nav>

        {/* Profile Header */}
        <header style={{ textAlign: 'center', marginBottom: '50px', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={creator.avatar} 
              alt={`${creator.name} profile avatar`}
              style={{ 
                width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover', 
                border: `4px solid ${theme.primary}`,
                boxShadow: `0 20px 40px ${theme.primary + '33'}`
              }} 
            />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: theme.secondary, color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: `3px solid ${theme.bg}` }}>✓</div>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '950', marginTop: '25px', marginBottom: '5px', letterSpacing: '-1px' }}>{creator.name}</h1>
          <p style={{ color: theme.primary, fontSize: '1.2rem', fontWeight: '700' }}>@{creator.username}</p>
        </header>

        {/* Bio Section */}
        <section style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}`, marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '12px', color: theme.secondary, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900 }}>About {creator.name}</h2>
          <p style={{ lineHeight: '1.8', opacity: 0.8, fontSize: '1.05rem' }}>{creator.description}</p>
        </section>

        {/* CTA CARD WITH BOTH BUTTONS */}
        <section style={{ 
          backgroundColor: theme.card, 
          padding: '40px', 
          borderRadius: '30px', 
          border: `2px solid ${theme.blue}`, 
          position: 'relative', 
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 20px', background: theme.blue, color: '#fff', fontSize: '0.7rem', fontWeight: 900, borderBottomLeftRadius: '20px' }}>
            SECURE ENCRYPTED HUB
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '25px' }}>
            Connect with {creator.name}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button 
              onClick={() => handleActionClick('subscribe')}
              style={{ 
                width: '100%', padding: '22px', borderRadius: '18px', border: 'none', 
                background: `linear-gradient(135deg, ${theme.blue} 0%, ${theme.primary} 100%)`, 
                color: '#fff', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', 
                boxShadow: '0 10px 25px rgba(1, 2, 253, 0.3)', transition: 'transform 0.2s' 
              }}
            >
              SUBSCRIBE
            </button>

            <button 
              onClick={() => handleActionClick('tip')}
              style={{ 
                width: '100%', padding: '22px', borderRadius: '18px', border: `2px solid ${theme.secondary}`, 
                background: 'transparent', 
                color: theme.text, fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}
            >
              TIP
            </button>
          </div>
        </section>
      </main>

      {/* --- AGE VERIFICATION MODAL --- */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '32px', maxWidth: '450px', width: '100%', textAlign: 'center', border: `2px solid ${theme.primary}` }}>
            <h2 style={{ color: theme.primary, fontSize: '2rem', fontWeight: 900 }}>AGE VERIFICATION</h2>
            <p style={{ margin: '20px 0 40px', opacity: 0.8, lineHeight: '1.6' }}>Please confirm that you are at least 18 years of age to proceed.</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => handleAgeVerify(false)} style={{ flex: 1, padding: '20px', borderRadius: '15px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.text, fontWeight: '700', cursor: 'pointer' }}>EXIT</button>
              <button onClick={() => handleAgeVerify(true)} style={{ flex: 1, padding: '20px', borderRadius: '15px', background: theme.primary, border: 'none', color: '#fff', fontWeight: '900', cursor: 'pointer' }}>I AM 18+</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.4, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>
        ONLYCRAVE DIRECTORY // {new Date().getFullYear()}
      </footer>
    </div>
  );
}

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
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [showAgeGate, setShowAgeGate] = useState(false);

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

  const handleAgeVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      window.location.href = creator.link;
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
      "url": `https://onlycrave.com/@${creator.username}`
    }
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: '0.3s' }}>
      <Head>
        <title>{creator.name} (@{creator.username}) - Official OnlyCrave Profile & Exclusive Content</title>
        <meta name="description" content={`Explore ${creator.name}'s official OnlyCrave profile. Discover exclusive media, direct creator subscription updates, secure payments via M-Pesa and PayPal, and direct community access.`} />
        <meta name="keywords" content={`${creator.name}, ${creator.username}, OnlyCrave creator, exclusive content, verified creator profile, content subscription`} />
        <meta property="og:title" content={`${creator.name} (@{creator.username}) | OnlyCrave`} />
        <meta property="og:description" content={`Access ${creator.name}'s exclusive inner circle content securely through OnlyCrave.`} />
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
        <header style={{ textAlign: 'center', marginBottom: '60px', position: 'relative' }}>
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
          <p style={{ lineHeight: '1.8', opacity: '0.6', fontSize: '0.9rem', marginTop: '15px' }}>
            Welcome to the official verified digital hub for {creator.name}. Follow this profile to unlock premium interactive media updates, high-resolution photo galleries, private video archives, and direct fan-to-creator messaging options hosted safely within the OnlyCrave platform infrastructure.
          </p>
        </section>

        {/* CTA CARD */}
        <section style={{ 
          backgroundColor: theme.card, 
          padding: '40px', 
          borderRadius: '30px', 
          border: `2px solid ${theme.blue}`, 
          position: 'relative', 
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 20px', background: theme.blue, color: '#fff', fontSize: '0.7rem', fontWeight: 900, borderBottomLeftRadius: '20px' }}>
            ENCRYPTED CONNECTION
          </div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '20px' }}>
            Join {creator.name}'s Inner Circle
          </h2>
          
          <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
             <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', background: theme.primary, borderRadius: '50%' }} />
                <p style={{ margin: 0, fontSize: '0.95rem' }}>Direct support via <strong>M-Pesa, PayPal, & Secure Crypto</strong> options</p>
             </div>
             <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', background: theme.secondary, borderRadius: '50%' }} />
                <p style={{ margin: 0, fontSize: '0.95rem' }}>Immediate access to high-res media libraries and direct chat features</p>
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
            UNLOCK FULL ACCESS
          </button>
        </section>

        {/* Extended SEO Text Block for LLMs and Search Crawlers */}
        <section style={{ marginTop: '50px', padding: '30px', backgroundColor: theme.card, borderRadius: '24px', border: `1px solid ${theme.border}` }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '15px', color: theme.secondary }}>Creator Overview & Platform Guidelines</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: theme.muted }}>
            OnlyCrave serves as a premier ecosystem connecting independent creators like {creator.name} directly with their dedicated communities. Through transparent subscription management, robust privacy protocols, and multiple localized transaction rails, fans experience seamless content delivery. All memberships are managed securely to protect creator copyright and user data privacy standards.
          </p>
        </section>

        {/* FAQ Section */}
        <section style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '30px', textAlign: 'center' }}>Frequently Asked Questions</h3>
          {[
            { q: `Is this the official OnlyCrave page for ${creator.name}?`, a: `Confirmed. This is the verified index and entry point for ${creator.name}. All transactions and subscriptions are handled via OnlyCrave's secure 256-bit encrypted payment gateway.` },
            { q: "Can I pay using M-Pesa or alternative regional methods?", a: "Yes. Choose your preferred local payment gateway at checkout, including M-Pesa mobile money support for instant confirmation and seamless content authorization." },
            { q: "How do I access exclusive updates after subscribing?", a: "Once your subscription is successfully verified through OnlyCrave, you gain immediate permissions to view all locked media archives and direct updates posted by the creator." }
          ].map((item, idx) => (
            <details key={idx} style={{ padding: '20px 0', borderBottom: `1px solid ${theme.border}` }}>
              <summary style={{ fontWeight: '800', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.q} <span style={{ color: theme.primary, fontSize: '1.2rem' }}>+</span>
              </summary>
              <p style={{ paddingTop: '15px', color: theme.muted, fontSize: '0.9rem', lineHeight: '1.6' }}>{item.a}</p>
            </details>
          ))}
        </section>
      </main>

      {/* --- AGE VERIFICATION MODAL --- */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '32px', maxWidth: '450px', width: '100%', textAlign: 'center', border: `2px solid ${theme.primary}` }}>
            <h2 style={{ color: theme.primary, fontSize: '2rem', fontWeight: 900 }}>AGE VERIFICATION REQUIRED</h2>
            <p style={{ margin: '20px 0 40px', opacity: 0.8, lineHeight: '1.6' }}>Please confirm that you are at least 18 years of age (or the legal age of majority in your jurisdiction) to proceed to {creator.name}'s private media hub.</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => handleAgeVerify(false)} style={{ flex: 1, padding: '20px', borderRadius: '15px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.text, fontWeight: '700', cursor: 'pointer' }}>EXIT</button>
              <button onClick={() => handleAgeVerify(true)} style={{ flex: 1, padding: '20px', borderRadius: '15px', background: theme.primary, border: 'none', color: '#fff', fontWeight: '900', cursor: 'pointer' }}>I AM 18+</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '60px 20px', opacity: 0.4, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px' }}>
        ONLYCRAVE DIRECTORY // VERIFIED ECOSYSTEM // {new Date().getFullYear()}
      </footer>
    </div>
  );
}

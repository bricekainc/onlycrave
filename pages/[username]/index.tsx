import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const cleanUsername = username.toLowerCase();

  let creator: any = null;

  try {
    // Fetch the real-time RSS feed from onlycrave.com
    const res = await fetch('https://onlycrave.com/rss/creators/feed');
    const xmlText = await res.text();

    // Simple robust regex parsing to extract individual <item> blocks from the XML feed
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];

      // Extract Link to match username
      const linkMatch = itemContent.exec ? null : itemContent.match(/<link>(.*?)<\/link>/);
      const profileLink = linkMatch ? linkMatch[1].trim() : '';
      
      // Check if this item corresponds to the requested username
      if (profileLink.toLowerCase().endsWith(`/${cleanUsername}`)) {
        // Extract Title (Format: Name (@username) or similar)
        const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
        const rawTitle = titleMatch ? titleMatch[1] : cleanUsername;
        
        // Clean up title to get display name (remove handles if nested inside)
        const nameParts = rawTitle.split('(@');
        const name = nameParts[0].trim() || cleanUsername;

        // Extract Description
        const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemContent.match(/<description>([\s\S]*?)<\/description>/);
        let description = descMatch ? descMatch[1].trim() : `Explore ${name}'s official OnlyCrave profile.`;
        
        // Strip HTML tags from description text for clean rendering
        description = description.replace(/<[^>]*>?/gm, '').trim();

        // Extract Thumbnail / Avatar
        const thumbMatch = itemContent.match(/<media:thumbnail[^>]+url="(.*?)"/) || itemContent.match(/<media:content[^>]+url="(.*?)"/);
        const avatar = thumbMatch ? thumbMatch[1].trim() : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=16161a&color=e33cc7&size=200&bold=true`;

        creator = {
          username: cleanUsername,
          name,
          avatar,
          description
        };
        break;
      }
    }
  } catch (err) {
    console.error("Error fetching creator from RSS feed:", err);
  }

  // Fallback dynamic mirror if the creator wasn't found inside the live RSS feed items
  if (!creator) {
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
    creator = {
      username: cleanUsername,
      name: formattedName,
      avatar: `https://onlycrave.com/public/uploads/avatar/${cleanUsername}.jpg`,
      description: `Welcome to ${formattedName}'s official OnlyCrave profile. Discover exclusive media updates and direct community access.`
    };
  }

  return { props: { creator } };
}

export default function CreatorProfile({ creator }: { creator: any }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [targetAction, setTargetAction] = useState<'subscribe' | 'tip' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const executeRedirect = (action: 'subscribe' | 'tip') => {
    setIsLoading(true);
    setTimeout(() => {
      if (action === 'subscribe') {
        window.location.href = `https://onlycrave.com/${creator.username}`;
      } else {
        window.location.href = `https://your.onlycrave.com/${creator.username}/tip`;
      }
    }, 600);
  };

  const handleActionClick = (action: 'subscribe' | 'tip') => {
    setTargetAction(action);
    
    const verifiedTimestamp = localStorage.getItem('crave_age_verified');
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

    if (verifiedTimestamp && Date.now() - parseInt(verifiedTimestamp, 10) < thirtyDaysInMs) {
      executeRedirect(action);
    } else {
      setShowAgeGate(true);
    }
  };

  const handleAgeVerify = (isOfAge: boolean) => {
    if (isOfAge && targetAction) {
      localStorage.setItem('crave_age_verified', Date.now().toString());
      setShowAgeGate(false);
      executeRedirect(targetAction);
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
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: "'Inter', sans-serif", transition: '0.3s', overflowX: 'hidden' }}>
      <Head>
        <title>{creator.name} (@{creator.username}) - Official OnlyCrave Profile</title>
        <meta name="description" content={`Explore ${creator.name}'s official OnlyCrave profile. Subscribe or send a tip securely.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`${creator.name} (@{creator.username}) | OnlyCrave`} />
        <meta property="og:image" content={creator.avatar} />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <main style={{ maxWidth: '700px', margin: '0 auto', padding: 'clamp(20px, 5vw, 40px) clamp(15px, 4vw, 20px)' }}>
        {/* Navigation */}
        <nav style={{ marginBottom: 'clamp(25px, 5vw, 40px)' }}>
          <button 
            onClick={() => router.push('/')} 
            style={{ background: 'none', border: 'none', color: theme.secondary, cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontSize: '0.75rem' }}
          >
            ← BACK TO DIRECTORY
          </button>
        </nav>

        {/* Profile Header */}
        <header style={{ textAlign: 'center', marginBottom: 'clamp(30px, 6vw, 50px)', position: 'relative' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={creator.avatar} 
              alt={`${creator.name} profile avatar`}
              onError={(e: any) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=16161a&color=e33cc7&size=200&bold=true`;
              }}
              style={{ 
                width: 'clamp(120px, 25vw, 150px)', height: 'clamp(120px, 25vw, 150px)', borderRadius: '50%', objectFit: 'cover', 
                border: `3px solid ${theme.primary}`,
                boxShadow: `0 15px 30px ${theme.primary + '33'}`
              }} 
            />
            <div style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: theme.secondary, color: '#000', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', border: `2px solid ${theme.bg}` }}>✓</div>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: '900', marginTop: '20px', marginBottom: '4px', letterSpacing: '-0.5px' }}>{creator.name}</h1>
          <p style={{ color: theme.primary, fontSize: 'clamp(1rem, 3vw, 1.1rem)', fontWeight: '700' }}>@{creator.username}</p>
        </header>

        {/* Bio Section */}
        <section style={{ backgroundColor: theme.card, padding: 'clamp(20px, 4vw, 25px)', borderRadius: '20px', border: `1px solid ${theme.border}`, marginBottom: '24px' }}>
          <h2 style={{ fontSize: '0.85rem', marginBottom: '10px', color: theme.secondary, textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 900 }}>About {creator.name}</h2>
          <p style={{ lineHeight: '1.7', opacity: 0.8, fontSize: 'clamp(0.95rem, 2.5vw, 1rem)' }}>{creator.description}</p>
        </section>

        {/* CTA CARD WITH BOTH BUTTONS */}
        <section style={{ 
          backgroundColor: theme.card, 
          padding: 'clamp(25px, 5vw, 35px)', 
          borderRadius: '24px', 
          border: `2px solid ${theme.blue}`, 
          position: 'relative', 
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '6px 16px', background: theme.blue, color: '#fff', fontSize: '0.65rem', fontWeight: 900, borderBottomLeftRadius: '16px' }}>
            SECURE HUB
          </div>
          
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.6rem)', fontWeight: 900, marginBottom: '20px' }}>
            Connect with {creator.name}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Subscribe Button */}
            <button 
              onClick={() => handleActionClick('subscribe')}
              disabled={isLoading}
              style={{ 
                width: '100%', padding: '18px', borderRadius: '16px', border: 'none', 
                background: `linear-gradient(135deg, ${theme.blue} 0%, ${theme.primary} 100%)`, 
                color: '#fff', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', 
                boxShadow: '0 8px 20px rgba(1, 2, 253, 0.25)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}
            >
              {isLoading && targetAction === 'subscribe' ? (
                <span style={{ width: '20px', height: '20px', border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : 'SUBSCRIBE'}
            </button>

            {/* Tip Button */}
            <button 
              onClick={() => handleActionClick('tip')}
              disabled={isLoading}
              style={{ 
                width: '100%', padding: '18px', borderRadius: '16px', border: `2px solid ${theme.secondary}`, 
                background: 'transparent', 
                color: theme.text, fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', 
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}
            >
              {isLoading && targetAction === 'tip' ? (
                <span style={{ width: '20px', height: '20px', border: `3px solid ${theme.text}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : 'TIP'}
            </button>
          </div>
        </section>
      </main>

      {/* --- AGE VERIFICATION MODAL --- */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '15px' }}>
          <div style={{ backgroundColor: theme.card, padding: 'clamp(25px, 5vw, 35px)', borderRadius: '24px', maxWidth: '400px', width: '100%', textAlign: 'center', border: `2px solid ${theme.primary}` }}>
            <h2 style={{ color: theme.primary, fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 900 }}>AGE VERIFICATION</h2>
            <p style={{ margin: '15px 0 30px', opacity: 0.8, lineHeight: '1.6', fontSize: '0.95rem' }}>Please confirm that you are at least 18 years of age to proceed. This will be remembered for 30 days.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleAgeVerify(false)} style={{ flex: 1, padding: '16px', borderRadius: '14px', background: 'transparent', border: `1px solid ${theme.border}`, color: theme.text, fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>EXIT</button>
              <button onClick={() => handleAgeVerify(true)} style={{ flex: 1, padding: '16px', borderRadius: '14px', background: theme.primary, border: 'none', color: '#fff', fontWeight: '900', cursor: 'pointer', fontSize: '0.9rem' }}>I AM 18+</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.4, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1.5px' }}>
        ONLYCRAVE DIRECTORY // {new Date().getFullYear()}
      </footer>

      {/* Global CSS for Spinner Animation */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

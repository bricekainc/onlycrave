import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const cleanUsername = username.toLowerCase();
  const targetUrl = `https://onlycrave.com/${cleanUsername}`;

  // Default fallback metadata
  let creator = {
    username: cleanUsername,
    name: username.charAt(0).toUpperCase() + username.slice(1),
    avatar: `https://onlycrave.com/public/uploads/avatar/${cleanUsername}.jpg`,
    description: `Welcome to my private world ✨ Explore exclusive content and unreleased updates.`
  };

  try {
    // Fetch the target page to mirror its exact SEO tags and info
    const res = await fetch(targetUrl, { 
      headers: { 'User-Agent': 'Cloudflare-Worker-SEO-Bot' } 
    });
    const text = await res.text();
    
    // Extract Metadata using regex matching
    const tMatch = text.match(/<title>([^<]*)<\/title>/i);
    const dMatch = text.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const ogImageMatch = text.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
    const ogTitleMatch = text.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
    
    if (ogImageMatch && ogImageMatch[1]) {
      creator.avatar = ogImageMatch[1].trim();
    }

    if (dMatch && dMatch[1]) {
      creator.description = dMatch[1].trim();
    }

    if (ogTitleMatch && ogTitleMatch[1]) {
      const rawTitle = ogTitleMatch[1].trim();
      const nameParts = rawTitle.split('(@');
      creator.name = nameParts[0].trim() || creator.name;
    } else if (tMatch && tMatch[1]) {
      const rawTitle = tMatch[1].trim();
      const nameParts = rawTitle.split('(@');
      creator.name = nameParts[0].trim() || creator.name;
    }

  } catch (e) {
    console.log("Metadata mirror failed, using default fallback profile details");
  }

  return { props: { creator, targetUrl } };
}

export default function CreatorLinkBio({ creator, targetUrl }: { creator: any, targetUrl: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ background: '#09090b', minHeight: '100vh' }} />;

  const handleRedirect = (actionUrl: string, type: string) => {
    setActiveButton(type);
    setTimeout(() => {
      window.location.href = actionUrl;
    }, 400);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": creator.name,
      "alternateName": creator.username,
      "image": creator.avatar,
      "description": creator.description,
      "url": targetUrl
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#09090b', 
      color: '#ffffff', 
      minHeight: '100vh', 
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <Head>
        <title>{creator.name} (@{creator.username}) | Link in Bio</title>
        <meta name="description" content={creator.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`${creator.name} (@{creator.username})`} />
        <meta property="og:description" content={creator.description} />
        <meta property="og:image" content={creator.avatar} />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* Background Neon Glow Effects */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(227,60,199,0.2) 0%, rgba(10,10,12,0) 70%)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(45,223,255,0.15) 0%, rgba(10,10,12,0) 70%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Main Container */}
      <main style={{ maxWidth: '520px', width: '100%', margin: '0 auto', padding: '40px 20px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Profile Avatar with Glowing Border */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <div style={{ 
            position: 'absolute', inset: '-4px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #e33cc7, #2ddfff, #0102FD)', 
            filter: 'blur(8px)', opacity: 0.7 
          }} />
          <img 
            src={creator.avatar} 
            alt={creator.name}
            onError={(e: any) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=16161a&color=e33cc7&size=250&bold=true`;
            }}
            style={{ 
              position: 'relative',
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '3px solid #18181b'
            }} 
          />
          <div style={{ 
            position: 'absolute', bottom: '2px', right: '2px', 
            backgroundColor: '#2ddfff', color: '#000', borderRadius: '50%', 
            width: '28px', height: '28px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontWeight: '900', fontSize: '0.85rem', 
            border: '3px solid #09090b', zIndex: 3 
          }}>✓</div>
        </div>

        {/* Name & Handle */}
        <h1 style={{ fontSize: '1.6rem', fontWeight: '900', textAlign: 'center', marginBottom: '4px', letterSpacing: '-0.3px' }}>
          {creator.name}
        </h1>
        <p style={{ color: '#e33cc7', fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px' }}>
          @{creator.username}
        </p>

        {/* Bio Badge / Snippet */}
        <div style={{ 
          backgroundColor: 'rgba(24, 24, 27, 0.7)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          padding: '16px 20px', 
          borderRadius: '16px', 
          textAlign: 'center', 
          marginBottom: '32px', 
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.85, margin: 0, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {creator.description}
          </p>
        </div>

        {/* LINK-IN-BIO ACTION BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          
          {/* Primary Subscribe Button */}
          <button 
            onClick={() => handleRedirect(targetUrl, 'subscribe')}
            style={{ 
              width: '100%', padding: '18px 20px', borderRadius: '16px', border: 'none', 
              background: 'linear-gradient(135deg, #0102FD 0%, #e33cc7 100%)', 
              color: '#fff', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', 
              boxShadow: '0 10px 25px rgba(227, 60, 199, 0.35)', 
              transition: 'transform 0.15s ease, opacity 0.15s ease',
              transform: activeButton === 'subscribe' ? 'scale(0.97)' : 'scale(1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '24px'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              🔥 UNLOCK VIP FEED & POSTS
            </span>
            <span>→</span>
          </button>

          {/* Tip / Custom Request Button */}
          <button 
            onClick={() => handleRedirect(`https://your.onlycrave.com/${creator.username}/tip`, 'tip')}
            style={{ 
              width: '100%', padding: '18px 20px', borderRadius: '16px', 
              border: '2px solid rgba(45, 223, 255, 0.4)', 
              background: 'rgba(24, 24, 27, 0.6)', 
              backdropFilter: 'blur(10px)',
              color: '#fff', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', 
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              transform: activeButton === 'tip' ? 'scale(0.97)' : 'scale(1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '24px'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#2ddfff' }}>
              💋 SEND A TIP / CUSTOM REQUEST
            </span>
            <span style={{ color: '#2ddfff' }}>→</span>
          </button>

          {/* Direct Chat / DM Button */}
          <button 
            onClick={() => handleRedirect(targetUrl, 'chat')}
            style={{ 
              width: '100%', padding: '16px 20px', borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              background: 'rgba(24, 24, 27, 0.4)', 
              color: '#a1a1aa', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', 
              transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            💬 Chat with me directly in DMs
          </button>

        </div>

        {/* Trust & Security Footer Tag */}
        <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', opacity: 0.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
          <span>🔒 100% Secure & Encrypted Transactions</span>
        </div>
      </main>

      {/* Footer Branding */}
      <footer style={{ textAlign: 'center', padding: '20px', opacity: 0.3, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1.5px', zIndex: 2 }}>
        POWERED BY ONLYCRAVE // {new Date().getFullYear()}
      </footer>
    </div>
  );
}

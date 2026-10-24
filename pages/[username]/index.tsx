import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const cleanUsername = Array.isArray(username) ? username[0].toLowerCase() : username.toLowerCase();
  const targetUrl = `https://onlycrave.com/${cleanUsername}`;

  let creator = {
    username: cleanUsername,
    name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
    avatar: `https://onlycrave.com/public/img/home_index.svg`,
    description: `Welcome to my private world. Explore exclusive content and unreleased updates.`
  };

  try {
    const res = await fetch(targetUrl, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(10000)
    });
    
    if (res.ok) {
      const text = await res.text();
      
      const getMeta = (property: string) => {
        const regex = new RegExp(`<meta\\s+(?:property|name)=["']${property}["']\\s+content=["']([^"']*)["']`, "gi");
        const matches = [...text.matchAll(regex)];
        if (matches.length > 0) {
          for (const match of matches.reverse()) {
            if (match[1] && !match[1].includes("home_index.svg")) {
              return match[1].trim();
            }
          }
          return matches[0][1].trim();
        }
        return "";
      };

      const tMatch = text.match(/<title>([^<]*)<\/title>/i);
      const ogTitle = getMeta("og:title") || (tMatch ? tMatch[1] : "");
      const ogImage = getMeta("og:image") || getMeta("twitter:image");
      const ogDesc = getMeta("og:description") || getMeta("description");
      const siteName = getMeta("og:site_name");

      if (ogImage && !ogImage.includes("home_index.svg")) {
        creator.avatar = ogImage.startsWith('http') ? ogImage : `https://onlycrave.com${ogImage}`;
      } else {
        // Fallback pattern if specific upload avatar tag is nested differently
        const avatarMatch = text.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*uploads\/avatar[^"']*)["']/i);
        if (avatarMatch && avatarMatch[1]) {
          creator.avatar = avatarMatch[1].trim();
        }
      }

      if (ogDesc) {
        creator.description = ogDesc;
      }

      if (siteName) {
        creator.name = siteName.split('-')[0].trim();
      } else if (ogTitle) {
        const nameParts = ogTitle.split('(@');
        creator.name = nameParts[0].trim() || creator.name;
      }
    }
  } catch (e) {
    console.error("Metadata mirror failed, using fallback details");
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
    }, 300);
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
      backgroundColor: '#030305', 
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
        <title>{creator.name} (@{creator.username}) | Verified OnlyCrave Hub</title>
        <meta name="description" content={creator.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={`${creator.name} (@{creator.username}) | OnlyCrave`} />
        <meta property="og:description" content={creator.description} />
        <meta property="og:image" content={creator.avatar} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={creator.avatar} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* Futuristic Neon Mesh Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(227,60,199,0.18) 0%, rgba(1,2,253,0.1) 50%, transparent 70%)', filter: 'blur(60px)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '-10%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(45,223,255,0.15) 0%, transparent 70%)', filter: 'blur(70px)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Main Container */}
      <main style={{ maxWidth: '520px', width: '100%', margin: '0 auto', padding: '50px 20px', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Profile Avatar with Cyber Glowing Border */}
        <div style={{ position: 'relative', marginBottom: '22px' }}>
          <div style={{ 
            position: 'absolute', inset: '-6px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #e33cc7, #2ddfff, #0102FD)', 
            filter: 'blur(10px)', opacity: 0.8 
          }} />
          <img 
            src={creator.avatar} 
            alt={creator.name}
            onError={(e: any) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&background=16161a&color=e33cc7&size=250&bold=true`;
            }}
            style={{ 
              position: 'relative',
              width: '130px', 
              height: '130px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '3px solid #18181b'
            }} 
          />
          <div style={{ 
            position: 'absolute', bottom: '4px', right: '4px', 
            backgroundColor: '#2ddfff', color: '#000', borderRadius: '50%', 
            width: '30px', height: '30px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', fontWeight: '900', fontSize: '0.85rem', 
            border: '3px solid #030305', zIndex: 3 
          }}>✓</div>
        </div>

        {/* Name & Handle */}
        <h1 style={{ fontSize: '1.8rem', fontWeight: '950', textAlign: 'center', marginBottom: '4px', letterSpacing: '-0.5px' }}>
          {creator.name}
        </h1>
        <p style={{ color: '#e33cc7', fontSize: '0.95rem', fontWeight: '800', marginBottom: '20px', letterSpacing: '0.5px' }}>
          @{creator.username}
        </p>

        {/* Bio Badge / Snippet */}
        <div style={{ 
          backgroundColor: 'rgba(24, 24, 27, 0.75)', 
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          padding: '18px 22px', 
          borderRadius: '20px', 
          textAlign: 'center', 
          marginBottom: '35px', 
          width: '100%',
          boxShadow: '0 15px 35px rgba(0,0,0,0.4)'
        }}>
          <p style={{ fontSize: '0.92rem', lineHeight: '1.65', opacity: 0.9, margin: 0 }}>
            {creator.description}
          </p>
        </div>

        {/* LINK-IN-BIO ACTION BUTTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
          
          {/* Primary Subscribe Button */}
          <button 
            onClick={() => handleRedirect(targetUrl, 'subscribe')}
            style={{ 
              width: '100%', padding: '18px 22px', borderRadius: '18px', border: 'none', 
              background: 'linear-gradient(135deg, #0102FD 0%, #e33cc7 100%)', 
              color: '#fff', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', 
              boxShadow: '0 12px 30px rgba(227, 60, 199, 0.35)', 
              transition: 'transform 0.15s ease',
              transform: activeButton === 'subscribe' ? 'scale(0.97)' : 'scale(1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '24px',
              letterSpacing: '0.5px'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
              </svg>
              UNLOCK VIP FEED & POSTS
            </span>
            <span>→</span>
          </button>

          {/* Tip / Custom Request Button */}
          <button 
            onClick={() => handleRedirect(`https://your.onlycrave.com/${creator.username}/tip`, 'tip')}
            style={{ 
              width: '100%', padding: '18px 22px', borderRadius: '18px', 
              border: '2px solid rgba(45, 223, 255, 0.4)', 
              background: 'rgba(24, 24, 27, 0.65)', 
              backdropFilter: 'blur(15px)',
              color: '#fff', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', 
              transition: 'transform 0.15s ease',
              transform: activeButton === 'tip' ? 'scale(0.97)' : 'scale(1)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '24px',
              letterSpacing: '0.5px'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#2ddfff' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              SEND A TIP / CUSTOM REQUEST
            </span>
            <span style={{ color: '#2ddfff' }}>→</span>
          </button>

          {/* Direct Chat / DM Button */}
          <button 
            onClick={() => handleRedirect(targetUrl, 'chat')}
            style={{ 
              width: '100%', padding: '16px 22px', borderRadius: '18px', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              background: 'rgba(24, 24, 27, 0.4)', 
              color: '#a1a1aa', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', 
              transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Chat with me directly in DMs
          </button>

        </div>

        {/* Trust & Security Footer Tag */}
        <div style={{ marginTop: '45px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', opacity: 0.5, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>100% Secure & Encrypted Transactions</span>
        </div>
      </main>

      {/* Footer Branding */}
      <footer style={{ textAlign: 'center', padding: '25px', opacity: 0.35, fontSize: '0.65rem', fontWeight: 800, letterSpacing: '2px', zIndex: 2 }}>
        POWERED BY ONLYCRAVE SECURE // {new Date().getFullYear()}
      </footer>
    </div>
  );
}

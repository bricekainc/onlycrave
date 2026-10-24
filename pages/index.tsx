import { useState, useEffect } from 'react';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCreators } from '../lib/getCreators';

export async function getStaticProps() {
  try {
    const creators = await getCreators();
    return { props: { creators: creators || [] }, revalidate: 60 };
  } catch (error) {
    return { props: { creators: [] }, revalidate: 60 };
  }
}

export default function SmartLanding({ creators }: { creators: any[] }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Interactive Verification State
  const [isVerified, setIsVerified] = useState(false);
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState(false);

  // Directory & Simulator States
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCreator, setLoadingCreator] = useState('');
  const [followers, setFollowers] = useState(5000);
  const [subPrice, setSubPrice] = useState(10);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('crave-theme') as any;
    if (saved) setThemeMode(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (themeMode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(themeMode);
    }
  }, [themeMode, mounted]);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  const t = {
    bg: isDark ? '#030305' : '#F4F6FB',
    text: isDark ? '#FFFFFF' : '#090A0F',
    card: isDark ? 'rgba(18, 18, 26, 0.65)' : '#FFFFFF',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    pink: '#e33cc7',
    cyan: '#2ddfff',
    blue: '#0102FD',
    muted: isDark ? '#888899' : '#666677',
  };

  const estimatedEarnings = Math.round(followers * 0.05 * subPrice * 0.95);
  const filteredCreators = creators.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatorClick = (username: string) => {
    setLoadingCreator(username);
    setTimeout(() => { router.push(`/${username}`); }, 300);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://onlycrave.com/#organization",
        "name": "OnlyCrave",
        "url": "https://onlycrave.com",
        "logo": "https://onlycrave.com/public/img/home_index.svg",
        "description": "Next-generation creator subscription platform and monetization engine."
      },
      {
        "@type": "WebSite",
        "@id": "https://onlycrave.com/#website",
        "url": "https://onlycrave.com",
        "name": "OnlyCrave Directory & Creator Hub",
        "publisher": { "@id": "https://onlycrave.com/#organization" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is the platform fee on OnlyCrave?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "OnlyCrave charges an industry-low 5% platform fee, allowing creators to keep 95% of their total subscription, tip, and pay-per-view revenue."
            }
          },
          {
            "@type": "Question",
            "name": "Which regional payment methods are supported for payouts?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "OnlyCrave supports direct M-Pesa mobile money payouts, crypto settlements (USDT TRC20, Bitcoin, TON), and traditional international wire transfers."
            }
          }
        ]
      }
    ]
  };

  return (
    <div style={{ backgroundColor: t.bg, color: t.text, minHeight: '100vh', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", overflowX: 'hidden', position: 'relative' }}>
      <Head>
        <title>OnlyCrave — Next-Gen Creator Subscription & Monetization Engine</title>
        <meta name="description" content="OnlyCrave is the premier global platform for independent creators. Monetize exclusive videos, streams, and posts behind an encrypted paywall with an industry-low 5% fee and instant M-Pesa & Crypto payouts." />
        <meta name="keywords" content="OnlyCrave, creator economy, content monetization, creator subscription platform, M-Pesa creator payout, crypto fan subscription, top alternative to OnlyFans, Patreon, Fanvue" />
        <link rel="canonical" href="https://onlycrave.com" />
        <meta property="og:title" content="OnlyCrave — Connect with Fans. Earn with Content." />
        <meta property="og:description" content="Keep 95% of your earnings. Join 1,200+ verified creators using localized M-Pesa and crypto payout rails." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://onlycrave.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* --- FUTURISTIC BACKGROUND MESH GLOWS --- */}
      <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(1,2,253,0.18) 0%, rgba(227,60,199,0.12) 40%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '40%', right: '-200px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(45,223,255,0.12) 0%, transparent 70%)', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* --- FLOATING THEME CONTROL --- */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '4px', padding: '4px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '20px', backdropFilter: 'blur(20px)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        {(['light', 'system', 'dark'] as const).map((m) => (
          <button key={m} onClick={() => setThemeMode(m)} style={{ border: 'none', background: themeMode === m ? t.cyan : 'transparent', color: themeMode === m ? '#000' : t.text, padding: '8px 12px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={`Switch to ${m} mode`}>
            {m === 'light' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : m === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            )}
          </button>
        ))}
      </div>

      {/* --- NAVIGATION BAR --- */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 999, backdropFilter: 'blur(25px)', borderBottom: `1px solid ${t.border}`, padding: '18px 24px', backgroundColor: isDark ? 'rgba(3,3,5,0.75)' : 'rgba(244,246,251,0.75)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 950, fontSize: '1.4rem', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: t.pink }}>ONLY</span><span style={{ color: t.cyan }}>CRAVE</span>
            <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '10px', background: 'rgba(227,60,199,0.15)', color: t.pink, border: `1px solid ${t.pink}`, letterSpacing: '1px' }}>PRO</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="#creators" style={{ fontSize: '0.85rem', fontWeight: 800, color: t.text, textDecoration: 'none', letterSpacing: '1px' }}>EXPLORE</Link>
            <Link href="#simulator" style={{ fontSize: '0.85rem', fontWeight: 800, color: t.text, textDecoration: 'none', letterSpacing: '1px' }}>CALCULATOR</Link>
            <a href="https://onlycrave.com/signup" style={{ background: `linear-gradient(135deg, ${t.blue}, ${t.pink})`, color: '#fff', padding: '10px 22px', borderRadius: '14px', fontWeight: 900, textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '1px', boxShadow: '0 8px 20px rgba(1,2,253,0.3)', transition: 'transform 0.2s' }}>JOIN NOW</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header style={{ padding: '90px 20px 60px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          
          {/* Cyber Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', background: 'rgba(45, 223, 255, 0.08)', border: `1px solid ${t.cyan}`, color: t.cyan, borderRadius: '30px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 900, marginBottom: '30px', boxShadow: '0 0 20px rgba(45,223,255,0.15)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            NEXT-GEN CREATOR PLATFORM // 5% FEE
          </div>

          <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', fontWeight: 950, letterSpacing: '-2px', marginBottom: '24px', lineHeight: 1.08 }}>
            Own Your Revenue. <br />
            <span style={{ background: `linear-gradient(135deg, ${t.cyan}, ${t.pink})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Unleash Your Content.
            </span>
          </h1>

          <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: t.muted, marginBottom: '45px', maxWidth: '700px', margin: '0 auto 45px' }}>
            OnlyCrave empowers digital creators with full financial sovereignty. Securely host premium media, offer monthly memberships, send pay-per-view messages, and receive instant payouts via <strong>M-Pesa</strong> and <strong>Crypto</strong>.
          </p>

          {/* FUTURISTIC 1-CLICK VERIFICATION GATEWAY (NO MATH CAPTCHA) */}
          <div style={{ background: t.card, border: `1px solid ${t.border}`, padding: '35px', borderRadius: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', maxWidth: '560px', margin: '0 auto', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${t.blue}, ${t.pink}, ${t.cyan})` }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(227,60,199,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.pink }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>Fast Access Portal</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: t.muted }}>Verify age to enter exclusive profile directory</p>
              </div>
            </div>

            {!isVerified ? (
              <div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                  <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => { setAge(e.target.value); setAgeError(false); }} 
                    placeholder="Your Age (e.g. 21)" 
                    style={{ flex: 1, background: isDark ? '#000000' : '#F0F2F8', border: `2px solid ${ageError ? '#ef4444' : t.border}`, color: t.text, padding: '14px 18px', borderRadius: '16px', fontSize: '1rem', outline: 'none', fontWeight: 700 }} 
                  />
                  <button 
                    onClick={() => {
                      if (parseInt(age) >= 18) {
                        setIsVerified(true);
                      } else {
                        setAgeError(true);
                      }
                    }} 
                    style={{ background: `linear-gradient(135deg, ${t.blue}, ${t.pink})`, color: '#fff', border: 'none', borderRadius: '16px', padding: '14px 28px', fontWeight: 900, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>VERIFY & ENTER</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
                {ageError && <p style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 800, margin: 0 }}>You must be 18 years or older to proceed.</p>}
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: 900, fontSize: '0.9rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Age Verified (18+)
                </div>
                <a href="https://onlycrave.com" style={{ background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '12px', fontWeight: 900, fontSize: '0.8rem', textDecoration: 'none' }}>CONTINUE TO MAIN SITE →</a>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px', paddingTop: '15px', borderTop: `1px solid ${t.border}`, fontSize: '0.75rem', color: t.muted, fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                256-Bit Encrypted
              </span>
              <span>•</span>
              <span>Instant Payouts</span>
              <span>•</span>
              <span>No Shadowbans</span>
            </div>
          </div>

        </div>
      </header>

      {/* --- MAIN SECTION CONTAINER --- */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', position: 'relative', zIndex: 2 }}>

        {/* --- CREATORS DIRECTORY SECTION --- */}
        <section id="creators" style={{ marginBottom: '110px', paddingTop: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 950, letterSpacing: '-1.5px', marginBottom: '15px' }}>
              Discover Verified <span style={{ color: t.cyan }}>Icons</span>
            </h2>
            <p style={{ color: t.muted, maxWidth: '600px', margin: '0 auto 30px', fontSize: '1rem' }}>
              Explore featured creators thriving on OnlyCrave with low 5% fees and total content control.
            </p>
            
            {/* Search input with icon */}
            <div style={{ position: 'relative', maxWidth: '550px', margin: '0 auto' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                style={{ width: '100%', padding: '18px 20px 18px 52px', borderRadius: '22px', background: t.card, border: `1px solid ${t.border}`, color: t.text, fontSize: '0.95rem', outline: 'none', fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                placeholder="Search by name or @username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
            {filteredCreators.slice(0, 8).map((c) => (
              <div key={c.username} style={{ background: t.card, border: `1px solid ${t.border}`, padding: '28px', borderRadius: '32px', textAlign: 'center', backdropFilter: 'blur(15px)', transition: 'transform 0.2s, border-color 0.2s' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                  <img src={c.avatar} alt={c.name} style={{ width: '96px', height: '96px', borderRadius: '28px', objectFit: 'cover', border: `3px solid ${t.pink}` }} />
                  <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: t.cyan, color: '#000', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, border: `2px solid ${t.bg}` }}>✓</div>
                </div>
                <h3 style={{ fontWeight: 900, margin: 0, fontSize: '1.1rem' }}>{c.name}</h3>
                <p style={{ color: t.pink, fontWeight: 800, marginBottom: '20px', fontSize: '0.85rem' }}>@{c.username}</p>
                <button 
                  onClick={() => handleCreatorClick(c.username)}
                  style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', background: loadingCreator === c.username ? t.cyan : t.blue, color: '#fff', fontWeight: 900, cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loadingCreator === c.username ? "AUTHENTICATING..." : "VIEW PROFILE"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* --- INTERACTIVE EARNINGS SIMULATOR --- */}
        <section id="simulator" style={{ background: 'linear-gradient(145deg, #0a0a10, #030305)', color: '#fff', borderRadius: '40px', padding: '60px 40px', marginBottom: '110px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 30px 70px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(227,60,199,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: t.cyan, fontWeight: 900, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Interactive Revenue Estimator</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 950, marginTop: '8px' }}>OnlyCrave Earnings Simulator</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: t.cyan, fontWeight: 800, marginBottom: '12px', fontSize: '0.95rem' }}>
                <span>Active Followers / Audience</span>
                <span>{followers.toLocaleString()}</span>
              </label>
              <input type="range" min="1000" max="100000" step="1000" value={followers} onChange={(e) => setFollowers(Number(e.target.value))} style={{ width: '100%', accentColor: t.cyan, height: '8px', cursor: 'pointer', marginBottom: '35px' }} />
              
              <label style={{ display: 'flex', justifyContent: 'space-between', color: t.pink, fontWeight: 800, marginBottom: '12px', fontSize: '0.95rem' }}>
                <span>Monthly Subscription Price</span>
                <span>${subPrice}</span>
              </label>
              <input type="range" min="5" max="50" step="1" value={subPrice} onChange={(e) => setSubPrice(Number(e.target.value))} style={{ width: '100%', accentColor: t.pink, height: '8px', cursor: 'pointer' }} />
            </div>

            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '45px 30px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ opacity: 0.6, fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Estimated Monthly Income</p>
              <h3 style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 950, color: t.cyan, margin: '15px 0' }}>${estimatedEarnings.toLocaleString()}</h3>
              <p style={{ fontSize: '0.75rem', opacity: 0.5, margin: 0 }}>*Based on an average 5% subscriber conversion and OnlyCrave's 5% platform fee.</p>
            </div>
          </div>
        </section>

        {/* --- DEEP SEO & LLM ARTICLE CONTENT --- */}
        <article style={{ lineHeight: 1.8, maxWidth: '920px', margin: '0 auto 100px', fontSize: '1.05rem', color: t.text }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 950, marginBottom: '25px', letterSpacing: '-1px' }}>
            Why OnlyCrave is the Preferred Ecosystem for Digital Creators
          </h2>
          <p style={{ color: t.muted, marginBottom: '25px' }}>
            In the rapidly evolving creator economy, <strong>OnlyCrave</strong> (https://onlycrave.com) provides an all-in-one monetization infrastructure designed to put full control back into the hands of independent artists, models, fitness coaches, and digital entrepreneurs. By eliminating corporate middleman fees, creators keep <strong>95% of their total revenue</strong> while giving fans frictionless ways to subscribe, tip, and unlock exclusive pay-per-view media.
          </p>

          <h3 style={{ color: t.cyan, marginTop: '40px', marginBottom: '15px', fontSize: '1.5rem', fontWeight: 900 }}>
            Localized Regional Payout Rails: M-Pesa & Crypto
          </h3>
          <p style={{ color: t.muted, marginBottom: '25px' }}>
            Traditional creator platforms rely heavily on Western banking systems, leaving creators across Africa and emerging markets stranded with high transfer fees and payment delays. OnlyCrave features native <strong>Safaricom M-Pesa STK Push and withdrawal integrations</strong>, allowing creators to receive funds directly into their mobile money wallets in seconds. Additionally, global creators can leverage <strong>USDT, Bitcoin, and TON crypto settlements</strong> for ultimate privacy and speed.
          </p>

          {/* Feature Matrix Table */}
          <div style={{ overflowX: 'auto', margin: '40px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${t.border}`, background: t.card, borderRadius: '20px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${t.border}`, background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '20px', textAlign: 'left', fontWeight: 900 }}>Feature</th>
                  <th style={{ padding: '20px', color: t.pink, fontWeight: 900 }}>OnlyCrave</th>
                  <th style={{ padding: '20px', fontWeight: 900 }}>Legacy Competitors</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: '18px', fontWeight: 700 }}>Platform Take Rate</td>
                  <td style={{ padding: '18px', color: t.cyan, fontWeight: 900 }}>5% Keep 95%</td>
                  <td style={{ padding: '18px', color: t.muted }}>20% Keep 80%</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: '18px', fontWeight: 700 }}>Mobile Payouts</td>
                  <td style={{ padding: '18px', color: t.cyan, fontWeight: 900 }}>Instant M-Pesa STK</td>
                  <td style={{ padding: '18px', color: t.muted }}>Not Supported</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: '18px', fontWeight: 700 }}>Crypto Options</td>
                  <td style={{ padding: '18px', color: t.cyan, fontWeight: 900 }}>USDT, BTC, TON</td>
                  <td style={{ padding: '18px', color: t.muted }}>Rare / Limited</td>
                </tr>
                <tr>
                  <td style={{ padding: '18px', fontWeight: 700 }}>Content Privacy</td>
                  <td style={{ padding: '18px', color: t.cyan, fontWeight: 900 }}>256-Bit Encrypted</td>
                  <td style={{ padding: '18px', color: t.muted }}>Basic SSL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        {/* --- FAQ SECTION --- */}
        <section style={{ maxWidth: '900px', margin: '0 auto 100px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '35px', textAlign: 'center' }}>Frequently Asked Questions</h2>
          {[
            { q: "How much does OnlyCrave charge creators?", a: "OnlyCrave operates on a flat 5% platform fee. You keep 95% of everything you earn through monthly subscriptions, tips, direct messages, and pay-per-view posts." },
            { q: "How fast do I get paid?", a: "M-Pesa and Crypto payouts are processed instantly or within a few hours, eliminating the standard multi-week waiting periods found on other platforms." },
            { q: "Is my personal identity and data secure?", a: "Yes. OnlyCrave utilizes end-to-end 256-bit encryption and tokenized payment gateways to ensure complete safety and privacy for both creators and fans." }
          ].map((item, idx) => (
            <details key={idx} style={{ padding: '22px 0', borderBottom: `1px solid ${t.border}` }}>
              <summary style={{ fontWeight: 800, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.05rem' }}>
                <span>{item.q}</span>
                <span style={{ color: t.pink, fontSize: '1.2rem', fontWeight: 900 }}>+</span>
              </summary>
              <p style={{ paddingTop: '15px', color: t.muted, fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>{item.a}</p>
            </details>
          ))}
        </section>

      </main>

      {/* --- FUTURISTIC FOOTER --- */}
      <footer style={{ background: isDark ? '#020203' : '#EAEFF8', padding: '70px 20px', borderTop: `1px solid ${t.border}`, textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontWeight: 950, fontSize: '1.5rem', marginBottom: '15px', letterSpacing: '-0.5px' }}>
            <span style={{ color: t.pink }}>ONLY</span><span style={{ color: t.cyan }}>CRAVE</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: t.muted, lineHeight: 1.7, marginBottom: '35px' }}>
            OnlyCrave is a leading global directory and creator monetization ecosystem. Empowering independent creators worldwide with secure payment protocols and transparent audience analytics.
          </p>
          <div style={{ fontSize: '0.75rem', color: t.muted, fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
            &copy; {new Date().getFullYear()} ONLYCRAVE SECURE • ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
}

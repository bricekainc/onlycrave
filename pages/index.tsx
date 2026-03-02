import { useState, useEffect } from 'react';
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

export default function Home({ creators }: { creators: any[] }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isFansnub, setIsFansnub] = useState(false);
  
  // Gate States
  const [gateStage, setGateStage] = useState(1);
  const [mathChallenge, setMathChallenge] = useState({ q: '', a: 0, opts: [] as number[] });
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState(false);
  
  // OnlyCrave Theme States
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  const [loadingCreator, setLoadingCreator] = useState('');

  useEffect(() => {
    setMounted(true);
    // Domain Detection Logic
    const host = window.location.hostname;
    if (host.includes('fansnub.com')) {
      setIsFansnub(true);
      initMath();
    }
    
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

  const initMath = () => {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 5) + 1;
    const ans = n1 + n2;
    const choices = [ans, ans + 1, ans - 2].sort(() => Math.random() - 0.5);
    setMathChallenge({ q: `${n1} + ${n2}`, a: ans, opts: choices });
  };

  const handleMathClick = (val: number) => {
    if (val === mathChallenge.a) {
      setCaptchaSolved(true);
      setTimeout(() => setGateStage(2), 500);
    }
  };

  const finalVerify = () => {
    if (parseInt(age) >= 18) {
      window.location.href = "https://onlycrave.com" + router.asPath;
    } else {
      setAgeError(true);
    }
  };

  if (!mounted) return null;

  // --- RENDER CONDITION: FANSNUB GATE ---
  if (isFansnub) {
    return (
      <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <Head>
          <title>Fansnub Has Moved to OnlyCrave – Exclusive Creator Platform</title>
          <meta name="description" content="Fansnub (Fansnub.com) is now OnlyCrave.com — an exclusive content platform for creators. Low fees, fast payouts, and the content you crave!" />
          <meta name="robots" content="noindex, follow" />
        </Head>

        <div style={{ padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, #1a1a2e 0%, #050505 100%)' }}>
          <div style={{ maxWidth: '600px', width: '100%', zIndex: 2 }}>
            
            {gateStage === 1 && (
              <div id="stage-1" style={{ background: 'rgba(17, 17, 17, 0.8)', padding: '40px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '5px 15px', background: 'rgba(1, 2, 253, 0.2)', border: '1px solid #0102FD', color: '#7071ff', borderRadius: '20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
                  Secure Access Protocol
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '15px', background: 'linear-gradient(to right, #fff, #ff3e80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Fansnub is now OnlyCrave
                </h2>
                <p style={{ color: '#a0a0a0', marginBottom: '30px' }}>We've upgraded! All profiles and balances have been migrated to offer better tools and 5% fees.</p>
                
                <div style={{ background: '#000', padding: '25px', borderRadius: '20px', border: '1px solid rgba(1, 2, 253, 0.3)' }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '15px' }}>Security Check: {mathChallenge.q} = ?</span>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {mathChallenge.opts.map(opt => (
                      <button key={opt} onClick={() => handleMathClick(opt)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gateStage === 2 && (
              <div style={{ background: 'rgba(17, 17, 17, 0.9)', padding: '40px', borderRadius: '28px', border: '1px solid #ff3e80', textAlign: 'center' }}>
                <h2 style={{ color: '#ff3e80', marginBottom: '10px' }}>Adult Content (18+)</h2>
                <p style={{ color: '#ccc', marginBottom: '25px' }}>Please verify your age to access premium creator profiles.</p>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" style={{ background: '#000', border: '2px solid #ff3e80', color: '#fff', padding: '15px', borderRadius: '12px', width: '100px', fontSize: '1.5rem', textAlign: 'center', outline: 'none', marginBottom: '20px' }} />
                {ageError && <div style={{ color: '#ff4444', marginBottom: '15px', fontWeight: 'bold' }}>Access Denied: 18+ Only.</div>}
                <button onClick={finalVerify} style={{ width: '100%', padding: '18px', background: '#ff3e80', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 800, cursor: 'pointer' }}>ENTER ONLYCRAVE</button>
              </div>
            )}

            {/* SEO FOOTER FOR FANSNUB */}
            <footer style={{ marginTop: '50px', background: '#111', padding: '40px', borderRadius: '28px', border: '1px solid #222', textAlign: 'left' }}>
              <div style={{ color: '#888', fontSize: '14px', lineHeight: '1.7' }}>
                OnlyCrave is a leading global directory. We have migrated all Fansnub user profiles, active subscriptions, and wallet balances to our new, high-performance platform. 
                <br/><br/>
                <strong>Why did we migrate?</strong> Lower 5% platform fees and more reliable streaming. 
                <strong>Is my account safe?</strong> Yes. Your existing login credentials work perfectly on OnlyCrave.com.
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '15px', fontSize: '12px' }}>
                <Link href="/p/terms" style={{ color: '#7071ff' }}>Terms</Link>
                <Link href="/p/privacy" style={{ color: '#7071ff' }}>Privacy</Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER CONDITION: ONLYCRAVE MAIN ---
  const t = {
    bg: resolvedTheme === 'dark' ? '#050505' : '#f8f9fa',
    text: resolvedTheme === 'dark' ? '#ffffff' : '#0a0a0a',
    card: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    border: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    pink: '#e33cc7',
    cyan: '#2ddfff',
  };

  return (
    <div style={{ backgroundColor: t.bg, color: t.text, minHeight: '100vh', transition: '0.4s', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>OnlyCrave | Keep 95% of Your Revenue</title>
        <meta name="description" content="Fansnub has moved to OnlyCrave. Join the most profitable platform for creators." />
      </Head>

      {/* --- FLOATING THEME TOGGLE --- */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', background: t.card, padding: '5px', borderRadius: '15px', border: `1px solid ${t.border}`, backdropFilter: 'blur(10px)' }}>
        {['light', 'system', 'dark'].map(m => (
          <button key={m} onClick={() => setThemeMode(m as any)} style={{ border: 'none', background: themeMode === m ? t.cyan : 'transparent', color: themeMode === m ? '#000' : t.text, padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px' }}>
            {m === 'light' ? '☀️' : m === 'dark' ? '🌙' : '💻'}
          </button>
        ))}
      </div>

      <nav style={{ padding: '20px', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ fontWeight: 900, fontSize: '1.5rem' }}><span style={{ color: t.pink }}>ONLY</span><span style={{ color: t.cyan }}>CRAVE</span></div>
        <div style={{ display: 'flex', gap: '20px' }}>
           <Link href="/explore" style={{ color: t.text, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}>EXPLORE</Link>
           <a href="https://onlycrave.com/signup" style={{ background: t.pink, color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 900 }}>JOIN</a>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-3px' }}>MONETIZE <span style={{ color: t.cyan }}>EVERYTHING</span></h1>
          <p style={{ opacity: 0.6 }}>The Fansnub upgrade is here. 5% Fees. Instant Payouts.</p>
        </header>

        {/* --- CREATOR GRID --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {creators.slice(0, 4).map(c => (
            <div key={c.username} style={{ background: t.card, border: `1px solid ${t.border}`, padding: '30px', borderRadius: '30px', textAlign: 'center' }}>
              <img src={c.avatar} style={{ width: '80px', height: '80px', borderRadius: '20px', marginBottom: '15px' }} />
              <h4 style={{ margin: 0 }}>{c.name}</h4>
              <p style={{ color: t.pink, fontSize: '0.8rem', marginBottom: '20px' }}>@{c.username}</p>
              <button 
                onClick={() => {
                  setLoadingCreator(c.username);
                  setTimeout(() => router.push(`/${c.username}`), 5000);
                }}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: loadingCreator === c.username ? t.cyan : t.text, color: t.bg, fontWeight: 900, cursor: 'pointer' }}
              >
                {loadingCreator === c.username ? 'AUTHENTICATING...' : 'VIEW PROFILE'}
              </button>
            </div>
          ))}
        </div>
        
        {/* --- SEO SECTION --- */}
        <section style={{ marginTop: '100px', opacity: 0.7, lineHeight: 1.8 }}>
          <h2 style={{ color: t.pink }}>Fansnub Has Moved to OnlyCrave</h2>
          <p>Fansnub (Fansnub.com) is now OnlyCrave.com — an exclusive content platform for creators to share and monetize videos, images, and more. Low fees, fast payouts, and the content you crave! Onlycrave is an all-in-one creator subscription platform where independent creators monetize exclusive content with subscriptions, tips, and pay-per-view access.</p>
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '60px', borderTop: `1px solid ${t.border}`, fontSize: '0.7rem', opacity: 0.4 }}>
        &copy; 2026 ONLYCRAVE // SECURE MIGRATION COMPLETE
      </footer>
    </div>
  );
}

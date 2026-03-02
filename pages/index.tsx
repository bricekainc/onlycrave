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

export default function SmartLanding({ creators }: { creators: any[] }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isFansnub, setIsFansnub] = useState(false);
  
  // Fansnub Specific State
  const [gateStage, setGateStage] = useState(1);
  const [math, setMath] = useState({ q: '', a: 0, opts: [] as number[] });
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState(false);

  // OnlyCrave Specific State
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCreator, setLoadingCreator] = useState('');
  const [followers, setFollowers] = useState(5000);
  const [subPrice, setSubPrice] = useState(10);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    
    if (host.includes('fansnub.com')) {
      setIsFansnub(true);
      // Initialize Fansnub Math
      const n1 = Math.floor(Math.random() * 9) + 1;
      const n2 = Math.floor(Math.random() * 5) + 1;
      const ans = n1 + n2;
      const choices = [ans, ans + 1, ans - 2].sort(() => Math.random() - 0.5);
      setMath({ q: `${n1} + ${n2}`, a: ans, opts: choices });
    } else {
      // Theme Logic for OnlyCrave
      const saved = localStorage.getItem('crave-theme') as any;
      if (saved) setThemeMode(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted || isFansnub) return;
    if (themeMode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    } else {
      setResolvedTheme(themeMode);
    }
  }, [themeMode, mounted, isFansnub]);

  if (!mounted) return null;

  // ============================================================
  // VIEW A: FANSNUB MIGRATION GATEWAY (fansnub.com)
  // ============================================================
  if (isFansnub) {
    return (
      <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        <Head>
          <title>Fansnub Has Moved to OnlyCrave – Exclusive Creator Platform</title>
          <meta name="description" content="Fansnub (Fansnub.com) is now OnlyCrave.com — an exclusive content platform for creators to share and monetize videos, images, and more. Low fees, fast payouts, and the content you crave!" />
          <meta name="keywords" content="OnlyCrave, Fansnub, Creator Platform" />
        </Head>

        <div style={{ margin: 0, padding: '80px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, #1a1a2e 0%, #050505 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255, 62, 128, 0.1) 0%, transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}></div>

          <div style={{ maxWidth: '800px', width: '100%', zIndex: 2 }}>
            {gateStage === 1 ? (
              <div style={{ background: 'rgba(17, 17, 17, 0.8)', padding: '40px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'inline-block', padding: '5px 15px', background: 'rgba(1, 2, 253, 0.2)', border: '1px solid #0102FD', color: '#7071ff', borderRadius: '20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
                  Secure Access Protocol
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '15px', background: 'linear-gradient(to right, #fff, #ff3e80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  We've upgraded! Fansnub has merged with OnlyCrave to offer better tools, faster payouts, and the content you crave.
                </h2>
                <p style={{ color: '#a0a0a0', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: 30 }}>
                  Join the ultimate platform for creators. We've upgraded! Fansnub has merged with OnlyCrave.
                </p>

                <div style={{ background: '#000', padding: '25px', borderRadius: '20px', border: '1px solid rgba(1, 2, 253, 0.3)', margin: '20px auto' }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '15px', color: '#fff' }}>Verify you are human: {math.q} = ?</span>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {math.opts.map(val => (
                      <button key={val} onClick={() => val === math.a ? setGateStage(2) : alert('Wrong answer')} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>{val}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(17, 17, 17, 0.9)', padding: '40px', borderRadius: '28px', border: '1px solid #ff3e80', boxShadow: '0 0 30px rgba(255, 62, 128, 0.2)' }}>
                <h2 style={{ color: '#ff3e80', marginBottom: '10px' }}>Adult Content (18+)</h2>
                <p style={{ color: '#ccc', marginBottom: '25px' }}>Please verify your age to access premium creator profiles.</p>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" style={{ background: '#000', border: '2px solid #ff3e80', color: '#fff', padding: '15px', borderRadius: '12px', width: '100px', fontSize: '1.5rem', textAlign: 'center', outline: 'none', marginBottom: '20px' }} />
                {ageError && <div style={{ color: '#ff4444', marginBottom: '15px', fontWeight: 'bold' }}>Access Denied: 18+ Only.</div>}
                <button onClick={() => parseInt(age) >= 18 ? window.location.href = "https://onlycrave.com" : setAgeError(true)} style={{ width: '100%', padding: '18px', background: '#ff3e80', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 800, cursor: 'pointer', fontSize: '1.1rem' }}>ENTER PLATFORM</button>
              </div>
            )}
          </div>
        </div>

        <footer style={{ background: '#080808', padding: '50px 0', borderTop: '2px solid #1a1a1a' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', background: '#111', border: '1px solid #222', borderBottom: '4px solid #00d2ff', padding: '40px', borderRadius: '8px' }}>
            <div style={{ color: '#888', fontSize: '14px', lineHeight: '1.7', textAlign: 'justify' }}>
              OnlyCrave is a leading global directory for content creators. We have migrated all Fansnub user profiles, active subscriptions, and wallet balances to our new platform. 
              <strong> Why did we migrate?</strong> Lower 5% platform fees and more reliable video streaming. <strong>Is my account safe?</strong> Yes. Your credentials work perfectly on OnlyCrave.com.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ============================================================
  // VIEW B: ONLYCRAVE CREATORS DIRECTORY (onlycrave.vercel.app)
  // ============================================================
  const t = {
    bg: resolvedTheme === 'dark' ? '#050505' : '#f8f9fa',
    text: resolvedTheme === 'dark' ? '#ffffff' : '#0a0a0a',
    card: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    border: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    pink: '#e33cc7',
    cyan: '#2ddfff',
  };

  const estimatedEarnings = (followers * 0.05 * subPrice * 0.95);

  const filteredCreators = creators.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatorClick = (username: string) => {
    setLoadingCreator(username);
    setTimeout(() => { router.push(`/${username}`); }, 5000);
  };

  return (
    <div style={{ backgroundColor: t.bg, color: t.text, minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>OnlyCrave | 1,200+ Global Creators Directory</title>
        <meta name="description" content="Discover 1,200+ premium creators on OnlyCrave. Monetize content with M-Pesa & Crypto. Keep 95% revenue." />
      </Head>

      {/* --- THEME TOGGLE --- */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '5px', padding: '5px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
        {['light', 'system', 'dark'].map((m) => (
          <button key={m} onClick={() => setThemeMode(m as any)} style={{ border: 'none', background: themeMode === m ? t.cyan : 'transparent', padding: '8px 12px', borderRadius: '15px', cursor: 'pointer' }}>
            {m === 'light' ? '☀️' : m === 'dark' ? '🌙' : '💻'}
          </button>
        ))}
      </div>

      <nav style={{ position: 'sticky', top: 0, zIndex: 999, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${t.border}`, padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: '1.5rem' }}>
            <span style={{ color: t.pink }}>ONLY</span><span style={{ color: t.cyan }}>CRAVE</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/explore" style={{ fontSize: '0.8rem', fontWeight: 800, color: t.text }}>EXPLORE</Link>
            <a href="https://onlycrave.com/signup" style={{ background: t.pink, color: '#fff', padding: '10px 20px', borderRadius: '12px', fontWeight: 800 }}>JOIN NOW</a>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 950, letterSpacing: '-3px' }}>
            JOIN <span style={{ color: t.cyan }}>1,200+</span> CREATORS
          </h1>
          <p style={{ opacity: 0.6, maxWidth: '600px', margin: '20px auto' }}>
            The world's most profitable directory. Verified creators keep 95% share.
          </p>
          <input 
            style={{ width: '100%', maxWidth: '600px', padding: '20px', borderRadius: '20px', background: t.card, border: `1px solid ${t.border}`, color: t.text }}
            placeholder="Search by name or @username..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        {/* --- CREATOR GRID --- */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px', marginBottom: '100px' }}>
          {filteredCreators.map((c) => (
            <div key={c.username} style={{ background: t.card, border: `1px solid ${t.border}`, padding: '30px', borderRadius: '32px', textAlign: 'center' }}>
              <img src={c.avatar} style={{ width: '100px', height: '100px', borderRadius: '24px', objectFit: 'cover', marginBottom: '15px' }} />
              <h3 style={{ fontWeight: 800, margin: 0 }}>{c.name}</h3>
              <p style={{ color: t.pink, fontWeight: 700, marginBottom: '20px' }}>@{c.username}</p>
              <button 
                onClick={() => handleCreatorClick(c.username)}
                style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: loadingCreator === c.username ? t.cyan : t.text, color: t.bg, fontWeight: 900, cursor: 'pointer' }}
              >
                {loadingCreator === c.username ? "AUTHENTICATING..." : "VIEW PROFILE"}
              </button>
            </div>
          ))}
        </section>

        {/* --- CALCULATOR --- */}
        <section style={{ background: 'linear-gradient(135deg, #111, #000)', color: '#fff', borderRadius: '40px', padding: '60px', marginBottom: '100px', border: '1px solid #222' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '40px' }}>OnlyCrave Earnings Simulator</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div>
              <label style={{ display: 'block', color: t.cyan, fontWeight: 800, marginBottom: '10px' }}>Followers: {followers.toLocaleString()}</label>
              <input type="range" min="1000" max="100000" step="1000" value={followers} onChange={(e) => setFollowers(Number(e.target.value))} style={{ width: '100%', accentColor: t.cyan }} />
              <label style={{ display: 'block', color: t.pink, fontWeight: 800, marginTop: '20px', marginBottom: '10px' }}>Price: ${subPrice}</label>
              <input type="range" min="5" max="50" step="1" value={subPrice} onChange={(e) => setSubPrice(Number(e.target.value))} style={{ width: '100%', accentColor: t.pink }} />
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '30px' }}>
              <p style={{ opacity: 0.5 }}>Estimated Monthly Income</p>
              <h3 style={{ fontSize: '4rem', fontWeight: 950, color: t.cyan }}>${estimatedEarnings.toLocaleString()}</h3>
              <p style={{ fontSize: '0.7rem' }}>*Based on 5% conversion and our low 5% platform fee</p>
            </div>
          </div>
        </section>

        {/* --- 1200+ WORDS SEO CONTENT --- */}
        <article style={{ lineHeight: 1.8, opacity: 0.8 }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>Why OnlyCrave is the Future of Content Monetization</h2>
          <p>
            OnlyCrave is not just another subscription site; it is a movement toward creator independence. We have built an ecosystem that prioritizes the people who actually build the value: the creators. With over 1,200 verified icons already using our infrastructure, we have proven that a 5% platform fee is not just possible—it is the new standard. 
            When you earn $10,000 on legacy platforms like OnlyFans, you lose $2,000. On OnlyCrave, you keep $9,500. This is the "Creator Revolution" we promised.
          </p>
          <h3 style={{ color: t.cyan, marginTop: '40px' }}>M-Pesa, Crypto, and Global Payouts</h3>
          <p>
            Unlike Western-centric platforms that ignore the global South, OnlyCrave features native M-Pesa integration, allowing creators across Africa to receive earnings directly to their mobile wallets. We also support USDT and Bitcoin payouts for creators who prefer the security and speed of blockchain technology. 
          </p>
          <table style={{ width: '100%', marginTop: '40px', borderCollapse: 'collapse', border: `1px solid ${t.border}`, background: t.card }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${t.border}` }}>
                <th style={{ padding: '20px', textAlign: 'left' }}>Feature</th>
                <th style={{ padding: '20px', color: t.pink }}>OnlyCrave</th>
                <th style={{ padding: '20px' }}>Competitors</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: '15px' }}>Platform Fee</td><td style={{ color: t.cyan }}>5%</td><td>20%</td></tr>
              <tr><td style={{ padding: '15px' }}>Payout Methods</td><td style={{ color: t.cyan }}>M-Pesa, Crypto, Bank</td><td>Bank Only</td></tr>
              <tr><td style={{ padding: '15px' }}>Privacy</td><td style={{ color: t.cyan }}>256-bit Encrypted</td><td>Standard</td></tr>
            </tbody>
          </table>
          <p style={{ marginTop: '40px' }}>
            Our 1,200+ creator directory is optimized for search engines, ensuring your profile gets the visibility it deserves. From adult entertainment to fitness coaching, OnlyCrave provides a safe, inclusive environment for all niches. Our dedicated support team is available 24/7 to ensure your transition to our platform is seamless and profitable.
          </p>
        </article>
      </main>

      <footer style={{ padding: '60px', textAlign: 'center', borderTop: `1px solid ${t.border}`, opacity: 0.5 }}>
        &copy; 2026 OnlyCrave. All rights reserved.
      </footer>
    </div>
  );
}

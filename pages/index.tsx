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
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCreator, setLoadingCreator] = useState('');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');
  
  // Simulator State (5% Platform Fee)
  const [followers, setFollowers] = useState(5000);
  const [subPrice, setSubPrice] = useState(10);

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
    localStorage.setItem('crave-theme', themeMode);
  }, [themeMode, mounted]);

  const t = {
    bg: resolvedTheme === 'dark' ? '#050505' : '#f8f9fa',
    text: resolvedTheme === 'dark' ? '#ffffff' : '#0a0a0a',
    card: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    border: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    pink: '#e33cc7',
    cyan: '#2ddfff',
  };

  const estimatedEarnings = (followers * 0.05 * subPrice * 0.95); // 5% platform fee

  const handleAction = (username: string) => {
    setLoadingCreator(username);
    // 5-second beautiful neural processing delay
    setTimeout(() => {
      router.push(`/${username}`);
    }, 5000);
  };

  const filteredCreators = creators.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: t.bg, color: t.text, minHeight: '100vh', transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>
      <Head>
        <title>OnlyCrave | The World's Most Profitable Creator Platform</title>
        <meta name="description" content="Join OnlyCrave and keep 95% of your earnings. Optimized for M-Pesa, Crypto, and global creators. Discover why OnlyCrave is the best alternative to OnlyFans." />
        <link rel="canonical" href="https://onlycrave.com" />
      </Head>

      {/* --- FLOATING THEME SWITCHER --- */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', gap: '8px', padding: '6px', background: t.card, backdropFilter: 'blur(15px)', borderRadius: '20px', border: `1px solid ${t.border}` }}>
        {[
          { id: 'light', icon: '☀️' },
          { id: 'system', icon: '💻' },
          { id: 'dark', icon: '🌙' }
        ].map((m) => (
          <button 
            key={m.id}
            onClick={() => setThemeMode(m.id as any)}
            style={{ 
              border: 'none', background: themeMode === m.id ? t.cyan : 'transparent', 
              padding: '8px 12px', borderRadius: '15px', cursor: 'pointer', fontSize: '14px',
              transition: '0.3s'
            }}
          >
            {m.icon}
          </button>
        ))}
      </div>

      {/* --- AMBIENCE --- */}
      <div style={{ position: 'fixed', top: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '40%', background: `${t.pink}15`, filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '40%', height: '40%', background: `${t.cyan}15`, filter: 'blur(120px)' }} />
      </div>

      <nav style={{ position: 'sticky', top: 0, zIndex: 1000, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${t.border}`, padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 950, fontSize: '1.8rem', letterSpacing: '-2px' }}>
            <span style={{ color: t.pink }}>ONLY</span><span style={{ color: t.cyan }}>CRAVE</span>
          </div>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <Link href="/explore" style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: t.text, opacity: 0.7 }}>Explore</Link>
            <a href="https://onlycrave.com/signup" style={{ background: t.pink, color: '#fff', padding: '12px 24px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 900, boxShadow: `0 10px 20px ${t.pink}44` }}>SIGN UP</a>
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
        
        {/* --- HERO --- */}
        <header style={{ textAlign: 'center', marginBottom: '100px' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 1000, lineHeight: 0.9, letterSpacing: '-5px', marginBottom: '30px' }}>
            EARN <span style={{ color: t.pink }}>MORE</span>.<br/>CRAVE <span style={{ color: t.cyan }}>FREEDOM</span>.
          </h1>
          <p style={{ maxWidth: '650px', margin: '0 auto 50px', fontSize: '1.2rem', opacity: 0.6, lineHeight: 1.6 }}>
            The only platform where you keep <b>95%</b> of your revenue. 
            Native M-Pesa, Crypto & PayPal support.
          </p>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <input 
              style={{ width: '100%', padding: '25px 35px', borderRadius: '30px', border: `1px solid ${t.border}`, background: t.card, color: t.text, fontSize: '1.1rem', outline: 'none', backdropFilter: 'blur(10px)' }}
              placeholder="Discover verified creators..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* --- GRID --- */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', marginBottom: '120px' }}>
          {filteredCreators.slice(0, 8).map((c) => (
            <div key={c.username} className="card-glass" style={{ background: t.card, border: `1px solid ${t.border}`, padding: '40px 30px', borderRadius: '40px', textAlign: 'center', transition: '0.4s' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
                <img src={c.avatar} style={{ width: '100%', height: '100%', borderRadius: '35%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: t.cyan, width: '25px', height: '25px', borderRadius: '50%', border: `4px solid ${t.bg}` }} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '5px' }}>{c.name}</h3>
              <p style={{ color: t.pink, fontWeight: 800, marginBottom: '25px', fontSize: '0.9rem' }}>@{c.username}</p>
              
              <button 
                onClick={() => handleAction(c.username)}
                disabled={!!loadingCreator}
                className={loadingCreator === c.username ? 'loading-btn' : ''}
                style={{ 
                  width: '100%', padding: '18px', borderRadius: '20px', border: 'none', 
                  background: t.text, color: t.bg, fontWeight: 900, cursor: 'pointer',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {loadingCreator === c.username ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <div className="spinner" /> AUTHENTICATING...
                  </span>
                ) : "VIEW EXCLUSIVE CONTENT"}
              </button>
            </div>
          ))}
        </section>

        {/* --- CALCULATOR --- */}
        <section style={{ background: 'linear-gradient(135deg, #111, #000)', color: '#fff', borderRadius: '50px', padding: '80px 50px', marginBottom: '120px', border: '1px solid #222' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '20px' }}>The 95% Rule.</h2>
              <p style={{ opacity: 0.6, marginBottom: '40px' }}>We only take a 5% fee. Compare that to the 20% "tax" on other platforms. Your hard work belongs to you.</p>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: t.cyan, textTransform: 'uppercase', marginBottom: '15px' }}>Estimated Followers: {followers.toLocaleString()}</label>
                <input type="range" min="1000" max="100000" step="1000" value={followers} onChange={(e) => setFollowers(Number(e.target.value))} style={{ width: '100%', accentColor: t.cyan }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: t.pink, textTransform: 'uppercase', marginBottom: '15px' }}>Monthly Sub Price: ${subPrice}</label>
                <input type="range" min="5" max="50" step="1" value={subPrice} onChange={(e) => setSubPrice(Number(e.target.value))} style={{ width: '100%', accentColor: t.pink }} />
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '60px', borderRadius: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, opacity: 0.5 }}>ESTIMATED TAKE HOME</span>
              <h4 style={{ fontSize: '5rem', fontWeight: 1000, margin: '10px 0', color: t.cyan }}>${estimatedEarnings.toLocaleString()}</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.4 }}>Calculated at 5% conversion rate with 5% flat fee</p>
              <button style={{ marginTop: '40px', background: t.pink, padding: '20px 40px', borderRadius: '20px', border: 'none', color: '#fff', fontWeight: 900 }}>GET PAID NOW</button>
            </div>
          </div>
        </section>

        {/* --- SEO DEEP CONTENT (1200+ Words Structure) --- */}
        <section style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '80px' }}>
             <div style={{ background: t.card, padding: '40px', borderRadius: '30px', border: `1px solid ${t.border}` }}>
                <h3 style={{ fontWeight: 900, color: t.pink }}>Safe & Inclusive</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.7 }}>We welcome all content niches. From fitness and lifestyle to professional adult entertainment, OnlyCrave provides a judgment-free zone with robust security.</p>
             </div>
             <div style={{ background: t.card, padding: '40px', borderRadius: '30px', border: `1px solid ${t.border}` }}>
                <h3 style={{ fontWeight: 900, color: t.cyan }}>Local Globalism</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.7 }}>Withdraw via M-Pesa in Kenya, Bank Transfer in Europe, or USDT anywhere. We bridge the gap between creators and their local currency.</p>
             </div>
             <div style={{ background: t.card, padding: '40px', borderRadius: '30px', border: `1px solid ${t.border}` }}>
                <h3 style={{ fontWeight: 900, color: t.text }}>24/7 Concierge</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.7 }}>No bots. Real human support for our verified creators to help manage billing, geofencing, and account growth.</p>
             </div>
          </div>

          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '40px' }}>Comparing the Giants: OnlyCrave vs. OnlyFans vs. Fansly</h2>
          <div style={{ overflowX: 'auto', marginBottom: '80px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '25px', overflow: 'hidden', border: `1px solid ${t.border}` }}>
               <thead style={{ background: t.card }}>
                 <tr>
                    <th style={{ padding: '25px', textAlign: 'left' }}>Benefit</th>
                    <th style={{ padding: '25px', color: t.cyan }}>OnlyCrave</th>
                    <th style={{ padding: '25px', opacity: 0.5 }}>OnlyFans</th>
                    <th style={{ padding: '25px', opacity: 0.5 }}>Fansly</th>
                 </tr>
               </thead>
               <tbody>
                 <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                    <td style={{ padding: '20px' }}><b>Creator Payout</b></td>
                    <td style={{ padding: '20px', fontWeight: 900 }}>95%</td>
                    <td style={{ padding: '20px' }}>80%</td>
                    <td style={{ padding: '20px' }}>80%</td>
                 </tr>
                 <tr style={{ borderBottom: `1px solid ${t.border}` }}>
                    <td style={{ padding: '20px' }}><b>M-Pesa Support</b></td>
                    <td style={{ padding: '20px', color: '#10b981' }}>✅ Native</td>
                    <td style={{ padding: '20px' }}>❌ No</td>
                    <td style={{ padding: '20px' }}>❌ No</td>
                 </tr>
                 <tr>
                    <td style={{ padding: '20px' }}><b>Crypto Payouts</b></td>
                    <td style={{ padding: '20px', color: '#10b981' }}>✅ Instant</td>
                    <td style={{ padding: '20px' }}>❌ No</td>
                    <td style={{ padding: '20px' }}>⚠️ Limited</td>
                 </tr>
               </tbody>
            </table>
          </div>

          <div className="seo-text" style={{ opacity: 0.8 }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Direct Fan Support & Content Monetization</h3>
            <p>OnlyCrave is not just another subscription site; it is a movement toward creator independence. In an era where mainstream social media platforms are shadow-banning creators and payment processors are freezing accounts, OnlyCrave stands as a beacon of stability. Our infrastructure is built on decentralized principles while maintaining the ease of use of a modern fintech app.</p>
            <p>Whether you are an influencer looking to sell digital products, a fitness coach offering private training videos, or an artist sharing exclusive behind-the-scenes content, our platform is optimized for your success. We handle the complex compliance and payment routing so you can focus on what you do best: creating.</p>
            
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '40px' }}>The Creator Revolution: Why 95% Matters</h3>
            <p>When you earn $10,000 on OnlyFans, they take $2,000. On OnlyCrave, we only take $500. That $1,500 difference covers your rent, your equipment, or your marketing budget. We believe that platforms should be service providers, not digital landlords. By keeping our overhead low and our technology efficient, we pass the savings directly to the people who deserve it most.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginTop: '60px' }}>
              <div>
                <h4 style={{ fontWeight: 900 }}>Create Your Account</h4>
                <p style={{ fontSize: '0.9rem' }}>Verification takes minutes. Once approved, you have instant access to our global payout network. Set your own prices, create bundles, and launch your private community today.</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 900 }}>Secure Direct Payouts</h4>
                <p style={{ fontSize: '0.9rem' }}>We don't hold your money for weeks. Our automated settlement system ensures that once your funds are cleared, they are available for withdrawal via your preferred local method.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body { margin: 0; padding: 0; }
        .card-glass:hover { transform: translateY(-12px); border-color: ${t.pink} !important; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        
        .loading-btn {
          background: ${t.cyan} !important;
          color: #000 !important;
          cursor: wait !important;
        }

        .spinner {
          width: 18px; height: 18px; border: 3px solid rgba(0,0,0,0.1);
          border-top-color: #000; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        input[type=range] { -webkit-appearance: none; background: rgba(255,255,255,0.1); height: 6px; border-radius: 5px; }
        
        @media (max-width: 768px) {
          .faq-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

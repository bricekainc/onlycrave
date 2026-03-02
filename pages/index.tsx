import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCreators } from '../lib/getCreators';

export async function getServerSideProps() {
  try {
    const creators = await getCreators();
    return { props: { creators: creators || [] } };
  } catch (error) {
    return { props: { creators: [] } };
  }
}

export default function Home({ creators }: { creators: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [loadingCreator, setLoadingCreator] = useState('');
  
  // Simulator State
  const [followers, setFollowers] = useState(5000);
  const [subPrice, setSubPrice] = useState(10);

  useEffect(() => { setMounted(true); }, []);

  const theme = {
    bg: '#050505',
    glass: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
    pink: '#e33cc7',
    cyan: '#2ddfff',
    textMuted: '#888'
  };

  const estimatedEarnings = (followers * 0.05 * subPrice * 0.88);

  const filteredCreators = creators.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!mounted) return <div style={{ background: '#050505', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: theme.bg, color: '#fff', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>OnlyCrave | Monetize Content with M-Pesa & Crypto</title>
        <meta name="description" content="Join OnlyCrave, the premier creator platform. Keep 95% of your revenue. Supports M-Pesa, PayPal, and Crypto payouts. Verified creator directory." />
        <link rel="icon" href="https://raw.githubusercontent.com/bricekainc/onlycrave/main/lib/favicon.ico" />
      </Head>

      {/* --- FLOATING AMBIENCE --- */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: `${theme.pink}11`, filter: 'blur(120px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '40%', height: '40%', background: `${theme.cyan}11`, filter: 'blur(120px)', borderRadius: '50%' }} />
      </div>

      {/* --- NAVIGATION --- */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 1000, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${theme.border}`, padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-1px' }}>
            <span style={{ color: theme.pink }}>ONLY</span><span style={{ color: theme.cyan }}>CRAVE</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/explore" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#fff' }}>Explore</Link>
            <a href="https://onlycrave.com/signup" style={{ background: theme.pink, padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>JOIN NOW</a>
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        
        {/* --- HERO SECTION --- */}
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 950, lineHeight: 1, marginBottom: '20px', letterSpacing: '-3px' }}>
            MONETIZE YOUR <span style={{ background: `linear-gradient(to right, ${theme.pink}, ${theme.cyan})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CONTENT</span>
          </h1>
          <p style={{ color: '#aaa', maxWidth: '700px', margin: '0 auto 40px', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Creators deserve to own their revenue. Join the platform powering over <b>$5M</b> in payouts with 95% revenue share.
          </p>
          
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
             <input 
              style={{ width: '100%', padding: '25px', borderRadius: '24px', border: `1px solid ${theme.border}`, background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1.1rem', outline: 'none', backdropFilter: 'blur(10px)' }}
              placeholder="Search @username or creator name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </header>

        {/* --- CREATOR GRID --- */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px', marginBottom: '100px' }}>
          {filteredCreators.map((c) => (
            <div key={c.username} className="glass-card" style={{ background: theme.glass, border: `1px solid ${theme.border}`, padding: '30px', borderRadius: '32px', textAlign: 'center', transition: '0.3s' }}>
              <img src={c.avatar} style={{ width: '100px', height: '100px', borderRadius: '24px', objectFit: 'cover', marginBottom: '15px', border: `2px solid ${theme.border}` }} />
              <h3 style={{ fontWeight: 800, margin: '0' }}>{c.name}</h3>
              <p style={{ color: theme.pink, fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px' }}>@{c.username}</p>
              <button 
                onClick={() => handleAction(c.username)}
                style={{ width: '100%', padding: '15px', borderRadius: '15px', border: 'none', background: '#fff', color: '#000', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}
              >
                {loadingCreator === c.username ? "Authenticating..." : "View Profile"}
              </button>
            </div>
          ))}
        </section>

        {/* --- EARNINGS SIMULATOR --- */}
        <section style={{ background: 'linear-gradient(135deg, #111, #000)', border: `1px solid ${theme.border}`, borderRadius: '40px', padding: '60px 40px', marginBottom: '100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px' }}>Earnings Simulator</h2>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: theme.pink, fontWeight: 800, marginBottom: '10px', fontSize: '0.8rem' }}>FOLLOWERS: {followers.toLocaleString()}</label>
                <input type="range" min="1000" max="100000" step="1000" value={followers} onChange={(e) => setFollowers(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: theme.cyan, fontWeight: 800, marginBottom: '10px', fontSize: '0.8rem' }}>MONTHLY PRICE: ${subPrice}</label>
                <input type="range" min="5" max="50" step="1" value={subPrice} onChange={(e) => setSubPrice(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '50px', borderRadius: '30px', textAlign: 'center', border: `1px solid ${theme.border}` }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>Potential Monthly Income</p>
              <h3 style={{ fontSize: '4rem', fontWeight: 900, color: theme.cyan }}>${estimatedEarnings.toLocaleString()}</h3>
              <p style={{ fontSize: '0.7rem', color: '#444' }}>*Based on 5% conversion and 12% platform/processor fees</p>
              <a href="https://onlycrave.com/signup" style={{ display: 'block', marginTop: '30px', background: theme.pink, padding: '20px', borderRadius: '15px', fontWeight: 900 }}>START EARNING NOW</a>
            </div>
          </div>
        </section>

        {/* --- SEO COMPARISON TABLE --- */}
        <section style={{ marginBottom: '100px' }}>
           <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 900, marginBottom: '40px' }}>The Creator Revolution</h2>
           <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: theme.glass, borderRadius: '24px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '20px', textAlign: 'left' }}>Feature</th>
                  <th style={{ padding: '20px', color: theme.pink }}>OnlyCrave</th>
                  <th style={{ padding: '20px', opacity: 0.5 }}>OnlyFans / Fansly</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>Platform Fee</td>
                  <td style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, fontWeight: 800 }}>5% - 12%</td>
                  <td style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, opacity: 0.5 }}>20% +</td>
                </tr>
                <tr>
                  <td style={{ padding: '20px', borderBottom: `1px solid ${theme.border}` }}>Payouts</td>
                  <td style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, color: theme.cyan }}>M-Pesa, Crypto, Bank</td>
                  <td style={{ padding: '20px', borderBottom: `1px solid ${theme.border}`, opacity: 0.5 }}>Bank Only</td>
                </tr>
              </tbody>
            </table>
           </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }} className="faq-grid">
          <div>
            <h3 style={{ color: theme.pink, fontWeight: 900, marginBottom: '20px' }}>FOR CREATORS</h3>
            <details style={{ background: theme.glass, padding: '20px', borderRadius: '15px', marginBottom: '10px' }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer' }}>How much do I keep?</summary>
              <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#aaa' }}>OnlyCrave takes a flat 5% platform fee. You keep 95% of your earnings, compared to 80% on other platforms.</p>
            </details>
          </div>
          <div>
            <h3 style={{ color: theme.cyan, fontWeight: 900, marginBottom: '20px' }}>FOR FANS</h3>
            <details style={{ background: theme.glass, padding: '20px', borderRadius: '15px', marginBottom: '10px' }}>
              <summary style={{ fontWeight: 700, cursor: 'pointer' }}>Is my data safe?</summary>
              <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#aaa' }}>We use 256-bit encryption and never store full card details. Discreet billing is standard.</p>
            </details>
          </div>
        </section>

      </main>

      <footer style={{ borderTop: `1px solid ${theme.border}`, padding: '80px 20px', background: '#000' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '20px' }}>ONLYCRAVE</div>
            <p style={{ color: '#555', fontSize: '0.8rem' }}>The global creator revolution. Empowering icons since day one.</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '2px', marginBottom: '20px' }}>LEGAL</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem', color: '#555', lineHeight: 2 }}>
              <li><Link href="https://onlycrave.com/p/policy">Privacy Policy</Link></li>
              <li><Link href="https://onlycrave.com/p/terms">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '2px', marginBottom: '20px' }}>LINKS</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.8rem', color: '#555', lineHeight: 2 }}>
              <li><Link href="https://onlycrave.com/blog">Blog</Link></li>
              <li><Link href="https://onlycrave.com/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        body { background: #050505; margin: 0; }
        .glass-card:hover { transform: translateY(-10px); border-color: ${theme.pink} !important; background: rgba(255,255,255,0.06) !important; }
        input[type=range] { accent-color: ${theme.pink}; }
        @media (max-width: 768px) { .faq-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

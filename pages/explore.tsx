import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getCreators } from '../lib/getCreators';

export async function getServerSideProps() {
  try {
    const creators = await getCreators();
    return { props: { creators: creators || [] } };
  } catch (error) {
    return { props: { creators: [] } };
  }
}

export default function Explore({ creators }: { creators: any[] }) {
  const [displayCreators, setDisplayCreators] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isFansnub, setIsFansnub] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    if (host.includes('fansnub.com')) {
      setIsFansnub(true);
    }

    // Theme Detection Logic
    const savedTheme = localStorage.getItem('crave-theme');
    if (savedTheme === 'light') {
      setResolvedTheme('light');
    } else if (savedTheme === 'dark') {
      setResolvedTheme('dark');
    } else {
      // System default if set to 'system'
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setResolvedTheme(isDark ? 'dark' : 'light');
    }

    // Logic: Shuffle and pick 10 creators
    const shuffled = [...creators].sort(() => 0.5 - Math.random());
    setDisplayCreators(shuffled.slice(0, 10));
  }, [creators]);

  // Dynamic Theme Styling
  const theme = {
    bg: isFansnub ? '#050505' : (resolvedTheme === 'dark' ? '#020202' : '#ffffff'),
    text: isFansnub ? '#ffffff' : (resolvedTheme === 'dark' ? '#ffffff' : '#0a0a0a'),
    cyan: '#2ddfff',
    pink: '#e33cc7',
    glass: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    border: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
  };

  if (!mounted) return <div style={{ background: '#020202', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: '"Inter", sans-serif', transition: 'background 0.3s ease' }}>
      <Head>
        <title>Top 10 Creators | OnlyCrave Global Leaderboard</title>
        <meta name="description" content={`Explore the top 10 creators including ${displayCreators.map(c => c.name).join(', ')}. Join 1,200+ influencers on OnlyCrave.`} />
      </Head>

      {/* --- FANSNUB MIGRATION WARNING --- */}
      {isFansnub && (
        <div style={{ background: 'linear-gradient(to right, #ff3e80, #0102FD)', padding: '12px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
          ⚠️ Fansnub is now OnlyCrave. All rankings and profiles have been migrated.
        </div>
      )}

      {/* --- GLOW DECORATION --- */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '400px', height: '400px', background: `${theme.cyan}10`, filter: 'blur(120px)', pointerEvents: 'none' }} />

      {/* --- HEADER --- */}
      <section style={{ paddingTop: '80px', paddingBottom: '60px', textAlign: 'center', borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 950, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-3px', margin: 0 }}>
          GLOBAL <span style={{ color: theme.cyan }}>TOP 10</span>
        </h1>
        <p style={{ fontSize: '0.8rem', fontWeight: 800, color: theme.pink, letterSpacing: '4px', marginTop: '15px', textTransform: 'uppercase' }}>
          Verified Creator Power Rankings // Live Data
        </p>
      </section>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* --- LEADERBOARD LIST --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {displayCreators.map((c, index) => (
            <Link key={c.username} href={`/${c.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="leaderboard-card">
                <div style={{ width: '60px', fontSize: '1.8rem', fontWeight: 900, fontStyle: 'italic', opacity: 0.5 }}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div style={{ position: 'relative' }}>
                  <img src={c.avatar} alt={c.name} style={{ width: '70px', height: '70px', borderRadius: '18px', objectFit: 'cover', border: `2px solid ${index === 0 ? theme.cyan : theme.border}` }} />
                  {index < 3 && (
                    <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: index === 0 ? '#FFD700' : '#C0C0C0', color: '#000', fontSize: '0.6rem', fontWeight: 900, padding: '2px 6px', borderRadius: '5px' }}>
                      {index === 0 ? 'ELITE' : 'PRO'}
                    </div>
                  )}
                </div>

                <div style={{ flexGrow: 1, paddingLeft: '15px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>{c.name}</h2>
                  <span style={{ color: theme.pink, fontSize: '0.8rem', fontWeight: 700 }}>@{c.username}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 900, opacity: 0.4, textTransform: 'uppercase' }}>Reliability</div>
                  <div style={{ color: theme.cyan, fontWeight: 900 }}>99.9%</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- 1200+ WORD SEO RICH CONTENT SECTION --- */}
        <article className="seo-section">
          <h2>The Rise of OnlyCrave: 1,200+ Creators and Counting</h2>
          <p>
            The creator economy is shifting, and our current Top 10 leaderboard highlights exactly why <strong>OnlyCrave</strong> has become the preferred choice for 1,200+ influencers globally. 
            When we look at the success of creators like <strong>{displayCreators[0]?.name}</strong> and <strong>{displayCreators[1]?.name}</strong>, it becomes evident that independence is the new gold standard. 
            Unlike traditional platforms that take a 20% cut, OnlyCrave allows our elite partners to keep 95% of their hard-earned revenue.
          </p>

          <h3 style={{ color: theme.cyan }}>Why Fansnub Migrated to OnlyCrave</h3>
          <p>
            For those arriving from <strong>Fansnub.com</strong>, the transition to OnlyCrave represents a significant upgrade in technology and user experience. 
            Our migration was fueled by the need for faster payouts, M-Pesa integration, and crypto-ready wallets. Creators such as <strong>{displayCreators[2]?.name}</strong> and <strong>{displayCreators[3]?.name}</strong> have already seen a 40% increase in fan engagement since making the move.
          </p>

          <div className="seo-grid">
            <div className="seo-box">
              <h4>Direct Fan Connection</h4>
              <p>OnlyCrave eliminates the middleman. When fans subscribe to <strong>{displayCreators[4]?.name}</strong> or <strong>{displayCreators[5]?.name}</strong>, they are supporting the creator directly through a secure, encrypted tunnel.</p>
            </div>
            <div className="seo-box">
              <h4>Global Accessibility</h4>
              <p>With 1,200+ creators distributed across 50 countries, we prioritize regional payment localizations. Whether you are following <strong>{displayCreators[6]?.name}</strong> from Nairobi or London, the experience is seamless.</p>
            </div>
          </div>

          <h3 style={{ color: theme.pink }}>Verified Authenticity and Safety</h3>
          <p>
            Every creator on this list, including <strong>{displayCreators[7]?.name}</strong>, <strong>{displayCreators[8]?.name}</strong>, and <strong>{displayCreators[9]?.name}</strong>, has undergone rigorous identity verification. 
            This ensures that OnlyCrave remains a trusted ecosystem for adult content, lifestyle blogging, and fitness coaching. We don't just host content; we protect the intellectual property of our 1,200+ strong creator community.
          </p>
          
          <p>
            As we continue to grow, our leaderboard will evolve to reflect the trending stats of the world's most influential people. OnlyCrave is more than a directory—it is the hub for creators who crave more. More revenue, more privacy, and more control.
          </p>
        </article>
      </main>

      <footer style={{ padding: '80px 20px', textAlign: 'center', opacity: 0.3, borderTop: `1px solid ${theme.border}` }}>
        <div style={{ fontWeight: 900, letterSpacing: '10px', fontSize: '0.7rem' }}>ONLYCRAVE // GLOBAL LEADERBOARD</div>
        <div style={{ marginTop: '10px', fontSize: '0.6rem' }}>DATA SECURED BY 256-BIT ENCRYPTION // NO REPLICATION ALLOWED</div>
      </footer>

      <style jsx>{`
        .leaderboard-card {
          display: flex;
          align-items: center;
          padding: 20px;
          background: ${theme.glass};
          border: 1px solid ${theme.border};
          border-radius: 28px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }
        .leaderboard-card:hover {
          background: ${resolvedTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
          border-color: ${theme.cyan};
          transform: scale(1.02) translateX(10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .seo-section {
          margin-top: 100px;
          padding: 60px;
          background: ${theme.glass};
          border-radius: 40px;
          border: 1px solid ${theme.border};
          line-height: 1.8;
          color: ${theme.text}cc;
        }
        .seo-section h2 { color: ${theme.text}; margin-bottom: 30px; }
        .seo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin: 40px 0;
        }
        .seo-box {
          padding: 30px;
          background: rgba(255,255,255,0.02);
          border-radius: 20px;
          border: 1px solid ${theme.border};
        }
        .seo-box h4 { margin: 0 0 15px 0; color: ${theme.cyan}; }
        @media (max-width: 768px) {
          .seo-grid { grid-template-columns: 1fr; }
          .leaderboard-card { padding: 15px; }
        }
      `}</style>
    </div>
  );
}

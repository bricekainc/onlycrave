import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getCreators } from '../lib/getCreators';

export async function getServerSideProps() {
  try {
    const creators = await getCreators();
    // Return all creators; we will handle the "Random 5" on the client to avoid hydration flicker
    return { props: { creators: creators || [] } };
  } catch (error) {
    return { props: { creators: [] } };
  }
}

export default function Explore({ creators }: { creators: any[] }) {
  const [displayCreators, setDisplayCreators] = useState<any[]>([]);
  const [category, setCategory] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Logic: Shuffle and pick 5 creators randomly every time the page loads
    const shuffled = [...creators].sort(() => 0.5 - Math.random());
    setDisplayCreators(shuffled.slice(0, 5));
  }, [creators]);

  const theme = {
    bg: '#020202',
    cyan: '#2ddfff',
    pink: '#e33cc7',
    glass: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
  };

  const categories = ["All", "Trending", "Fitness", "Lifestyle", "Gaming", "Music", "AI"];

  if (!mounted) return <div style={{ background: theme.bg, minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: theme.bg, color: '#fff', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>Explore Top Creators | OnlyCrave Leaderboard</title>
        <meta name="description" content="Discover the top 5 trending OnlyCrave creators. Verified rankings updated hourly." />
      </Head>

      {/* --- GLOW DECORATION --- */}
      <div style={{ position: 'fixed', top: 0, right: 0, width: '300px', height: '300px', background: `${theme.cyan}15`, filter: 'blur(100px)', pointerEvents: 'none' }} />

      {/* --- HEADER --- */}
      <section style={{ paddingTop: '80px', paddingBottom: '40px', textAlign: 'center', borderBottom: `1px solid ${theme.border}` }}>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-2px', margin: 0 }}>
          CREATOR <span style={{ color: theme.cyan }}>LEADERBOARD</span>
        </h1>
        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#666', letterSpacing: '3px', marginTop: '10px', textTransform: 'uppercase' }}>
          RANKINGS UPDATED EVERY 60 MINUTES // SECURE ECOSYSTEM
        </p>
      </section>

      {/* --- CATEGORIES --- */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(2,2,2,0.8)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${theme.border}`, padding: '15px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '10px', overflowX: 'auto', padding: '0 20px', scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                border: category === cat ? `1px solid ${theme.cyan}` : `1px solid ${theme.border}`,
                background: category === cat ? theme.cyan : 'transparent',
                color: category === cat ? '#000' : '#888',
                fontSize: '0.65rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: '0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        {/* --- DYNAMIC LIST --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {displayCreators.map((c, index) => (
            <Link key={c.username} href={`/${c.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="leaderboard-item">
                
                {/* RANK */}
                <div style={{ width: '50px', fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#333' }}>
                  #{index + 1}
                </div>

                {/* AVATAR */}
                <div style={{ position: 'relative' }}>
                  <img src={c.avatar} style={{ width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover', border: `1px solid ${theme.border}` }} />
                  {index === 0 && <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: theme.cyan, color: '#000', fontSize: '0.5rem', fontWeight: 900, padding: '2px 5px', borderRadius: '4px' }}>TOP</div>}
                </div>

                {/* INFO */}
                <div style={{ flexGrow: 1, paddingLeft: '10px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>{c.name}</h2>
                  <span style={{ color: theme.pink, fontSize: '0.7rem', fontWeight: 700 }}>@{c.username}</span>
                </div>

                {/* STATUS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hide-mobile">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', color: '#444' }}>Live Now</span>
                </div>

                {/* ACTION */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- SEO ARTICLE --- */}
        <article style={{ marginTop: '80px', padding: '40px', background: theme.glass, borderRadius: '30px', border: `1px solid ${theme.border}` }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '20px', fontStyle: 'italic' }}>HOW OUR RANKING WORKS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div>
              <h4 style={{ color: theme.cyan, fontSize: '0.7rem', fontWeight: 900, marginBottom: '10px' }}>VERIFICATION SCORE</h4>
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.6 }}>Creators with completed KYC and blue checkmarks receive priority indexing for fan safety.</p>
            </div>
            <div>
              <h4 style={{ color: theme.pink, fontSize: '0.7rem', fontWeight: 900, marginBottom: '10px' }}>LOCAL IMPACT</h4>
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.6 }}>Weighting is given to creators using regional payment methods like M-Pesa or Crypto.</p>
            </div>
          </div>
        </article>
      </main>

      <footer style={{ padding: '60px 20px', textAlign: 'center', opacity: 0.2, fontSize: '0.6rem', fontWeight: 900, letterSpacing: '5px' }}>
        ONLYCRAVE OFFICIAL INDEX // {new Date().getFullYear()}
      </footer>

      <style jsx>{`
        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: ${theme.glass};
          border: 1px solid ${theme.border};
          border-radius: 24px;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .leaderboard-item:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: ${theme.cyan};
          transform: translateX(10px);
        }
        @media (max-width: 600px) {
          .hide-mobile { display: none; }
          .leaderboard-item { gap: 10px; padding: 15px; }
        }
      `}</style>
    </div>
  );
}

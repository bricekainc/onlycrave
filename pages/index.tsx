import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCreators } from '../lib/fetchCreators';

export async function getServerSideProps() {
  try {
    const creators = await getCreators();
    return { props: { creators: creators || [] } };
  } catch (error) {
    console.error("Fetch error:", error);
    return { props: { creators: [] } };
  }
}

export default function Home({ creators }: { creators: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingCreator, setLoadingCreator] = useState('');

  // Fix Hydration issues by ensuring theme logic only runs on client
  useEffect(() => {
    setMounted(true);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
  }, []);

  const theme = {
    bg: isDarkMode ? '#050505' : '#ffffff',
    card: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    glass: isDarkMode ? 'rgba(22, 22, 26, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    text: isDarkMode ? '#ffffff' : '#1a1a1b',
    primary: '#e33cc7', 
    secondary: '#2ddfff', 
    accent: '#0102FD',
    border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
  };

  const filteredCreators = creators.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (username: string) => {
    setLoadingCreator(username);
    // 2.2s delay for "security verification" - boosts dwell time and SEO
    setTimeout(() => {
      router.push(`/${username}`);
    }, 2200);
  };

  // Prevent flash of unstyled content
  if (!mounted) return <div style={{ backgroundColor: '#050505', minHeight: '100vh' }} />;

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', transition: '0.3s', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>OnlyCrave Search | Discover Verified Global Creators</title>
        <meta name="description" content="Search the official OnlyCrave directory. Discover top influencers, compare OnlyCrave vs OnlyFans, and enjoy secure M-Pesa, Crypto, and PayPal payments." />
        <meta name="keywords" content="OnlyCrave search, OnlyCrave vs Fansly, OnlyFans Mpesa, OnlyCrave creators, verified influencer directory, secure creator platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://onlycrave.com" />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is OnlyCrave better than OnlyFans for African creators?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, OnlyCrave natively supports M-Pesa, allowing creators in Kenya and other regions to withdraw funds instantly, a feature OnlyFans lacks." }},
            { "@type": "Question", "name": "How do I find verified creators on OnlyCrave?", "acceptedAnswer": { "@type": "Answer", "text": "Use the official OnlyCrave Search directory to find influencers with the blue verification badge." }}
          ]
        })}} />
      </Head>

      {/* --- 3D LOGO & NAV --- */}
      <nav style={{ padding: '30px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', backgroundColor: `${theme.bg}88` }}>
        <div className="logo-3d">
          <span className="logo-only">ONLY</span><span className="logo-crave">CRAVE</span>
        </div>
      </nav>

      {/* --- HERO --- */}
      <header style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', fontWeight: '900', marginBottom: '20px', letterSpacing: '-1px' }}>
          The World's Most <span style={{ color: theme.primary }}>Verified</span> Search
        </h1>
        <div className="search-pill-container">
          <input 
            className="search-input"
            type="text" 
            placeholder="Search by name or @username..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p style={{ marginTop: '20px', opacity: 0.6, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Indexing {creators.length} Premium Profiles
        </p>
      </header>

      {/* --- CREATOR GRID --- */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredCreators.map((c) => (
            <div key={c.username} className="creator-card">
              <div className="avatar-wrapper">
                <img src={c.avatar} alt={`${c.name} OnlyCrave Profile`} className="creator-img" />
              </div>
              <h2 style={{ fontSize: '1.2rem', margin: '10px 0 5px' }}>{c.name}</h2>
              <p style={{ color: theme.primary, fontWeight: '700', marginBottom: '20px' }}>@{c.username}</p>
              
              <button 
                onClick={() => handleAction(c.username)} 
                className={`pill-btn-3d ${loadingCreator === c.username ? 'loading' : ''}`}
                disabled={loadingCreator !== ''}
              >
                {loadingCreator === c.username ? "Authenticating..." : "View Exclusive Profile"}
              </button>
            </div>
          ))}
        </div>

        {/* --- SEO ARTICLE: GLOBAL RANKING --- */}
        <article className="seo-article">
          <section>
            <h2>The Global Search for OnlyCrave Excellence</h2>
            <p>
              As the digital content landscape shifts, users are increasingly moving toward <strong>OnlyCrave</strong> as their primary hub for creator interaction. 
              Our <strong>official search engine</strong> is optimized to provide the fastest route to verified content, cutting through the noise found on generic social platforms.
            </p>
          </section>

          {/* Comparison Table for SEO */}
          <div className="comparison-table-wrapper">
            <h3>Comparison: OnlyCrave vs Alternatives</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Benefits</th>
                  <th>OnlyCrave</th>
                  <th>OnlyFans / Fansly</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Local Payments</strong></td>
                  <td style={{ color: theme.secondary }}>M-Pesa / Crypto / PayPal</td>
                  <td>Credit Card Only</td>
                </tr>
                <tr>
                  <td><strong>Privacy Level</strong></td>
                  <td>High (Discreet Billing)</td>
                  <td>Standard</td>
                </tr>
                <tr>
                  <td><strong>Streaming Speed</strong></td>
                  <td>4K Ultra Optimized</td>
                  <td>Varies</td>
                </tr>
              </tbody>
            </table>
          </div>

          <section>
            <h2>Optimized for the Global Creator Economy</h2>
            <p>
              Whether you are searching for fitness influencers, digital artists, or lifestyle vloggers, OnlyCrave offers a decentralized yet secure experience. 
              By leveraging blockchain-ready payment systems and localized mobile money like M-Pesa, we ensure that fans can support creators from anywhere in the world without the traditional barriers of banking.
            </p>
          </section>

          <div className="faq-section">
            <h2>Search & Discovery FAQ</h2>
            <details>
              <summary>How can I rank as a creator on this search engine?</summary>
              <p>Search ranking is determined by profile completeness, verification status, and engagement. Ensure your OnlyCrave profile is fully updated to appear at the top of our directory.</p>
            </details>
            <details>
              <summary>Is the search anonymous?</summary>
              <p>Yes. Browsing our directory is completely anonymous. We do not track individual search queries to ensure the total privacy of our fan community.</p>
            </details>
          </div>
        </article>
      </main>

      <style jsx>{`
        .logo-3d {
          font-size: 2.2rem; font-weight: 900; letter-spacing: -2px;
          perspective: 1000px;
        }
        .logo-only { color: ${theme.primary}; text-shadow: 2px 2px 0px #000, 4px 4px 15px ${theme.primary}66; }
        .logo-crave { color: ${theme.secondary}; text-shadow: 2px 2px 0px #000, 4px 4px 15px ${theme.secondary}66; margin-left: 2px; }

        .search-pill-container {
          max-width: 600px; margin: 0 auto; padding: 0 10px;
        }
        .search-input {
          width: 100%; padding: 22px 35px; border-radius: 60px;
          border: 1px solid ${theme.border}; background: ${theme.glass};
          color: ${theme.text}; font-size: 1.1rem; outline: none;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1); transition: 0.4s;
          backdrop-filter: blur(10px);
        }
        .search-input:focus { border-color: ${theme.primary}; transform: scale(1.02); }

        .creator-card {
          background: ${theme.card}; border-radius: 35px; padding: 30px;
          text-align: center; border: 1px solid ${theme.border};
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .creator-card:hover { transform: translateY(-12px); border-color: ${theme.secondary}; }
        
        .avatar-wrapper {
          width: 120px; height: 120px; margin: 0 auto 15px;
          padding: 4px; border-radius: 50%;
          background: linear-gradient(45deg, ${theme.primary}, ${theme.secondary});
        }
        .creator-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; background: #000; }

        .pill-btn-3d {
          width: 100%; padding: 16px; border-radius: 50px; border: none;
          background: linear-gradient(135deg, ${theme.accent}, #000);
          color: white; font-weight: 800; cursor: pointer;
          box-shadow: 0 6px 0px #000, 0 12px 20px rgba(0,0,0,0.2);
          transition: 0.1s; position: relative;
        }
        .pill-btn-3d:active { transform: translateY(4px); box-shadow: 0 2px 0px #000; }
        .pill-btn-3d.loading { background: ${theme.primary}; opacity: 0.8; cursor: wait; }

        .seo-article { margin-top: 100px; padding: 40px; background: ${theme.card}; border-radius: 40px; line-height: 1.8; }
        .comparison-table-wrapper { margin: 40px 0; overflow-x: auto; }
        .comparison-table { width: 100%; border-collapse: collapse; min-width: 500px; }
        .comparison-table th { background: ${theme.primary}; color: white; padding: 15px; text-align: left; }
        .comparison-table td { padding: 15px; border-bottom: 1px solid ${theme.border}; }

        .faq-section { margin-top: 40px; }
        details { background: rgba(0,0,0,0.1); padding: 20px; border-radius: 20px; margin-bottom: 10px; cursor: pointer; }
        summary { font-weight: 700; }

        @media (max-width: 768px) {
          .logo-3d { font-size: 1.8rem; }
          .seo-article { padding: 20px; }
        }
      `}</style>
    </div>
  );
}

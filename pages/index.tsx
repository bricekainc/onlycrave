import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getCreators } from '../lib/fetchCreators';

export async function getServerSideProps() {
  const creators = await getCreators();
  return { props: { creators } };
}

export default function Home({ creators }: { creators: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [loadingCreator, setLoadingCreator] = useState('');

  useEffect(() => {
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
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (username: string) => {
    setLoadingCreator(username);
    setIsRedirecting(true);
    // Retention delay to simulate "Secure Connection"
    setTimeout(() => {
      router.push(`/${username}`);
    }, 2200);
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', transition: '0.3s', fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>OnlyCrave Search | Official Directory of Verified Content Creators</title>
        <meta name="description" content="Discover OnlyCrave creators with the official search directory. Compare OnlyCrave vs OnlyFans & Fansly. Support creators via M-Pesa, PayPal, and Crypto safely." />
        <meta name="keywords" content="OnlyCrave search, OnlyCrave vs OnlyFans, OnlyCrave vs Fansly, Mpesa OnlyCrave, verified creators directory, OnlyCrave login, top OnlyCrave accounts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How does OnlyCrave compare to OnlyFans?", "acceptedAnswer": { "@type": "Answer", "text": "OnlyCrave offers localized payments like M-Pesa, lower creator fees (80/20 split), and faster payout processing compared to OnlyFans." }},
            { "@type": "Question", "name": "Can I use M-Pesa on OnlyCrave?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, OnlyCrave natively supports M-Pesa for both direct subscriptions and wallet top-ups." }}
          ]
        })}} />
      </Head>

      {/* --- 3D LOGO & NAV --- */}
      <nav style={{ padding: '30px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
        <div className="logo-3d">
          <span className="logo-only">ONLY</span><span className="logo-crave">CRAVE</span>
        </div>
      </nav>

      {/* --- HERO --- */}
      <header style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: '800', marginBottom: '20px' }}>
          Find Your Favorite <span style={{ color: theme.primary }}>Verified</span> Creators
        </h1>
        <div className="search-pill-container">
          <input 
            className="search-input"
            type="text" 
            placeholder="Search 500+ creators by name or @username..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* --- GRID --- */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {filteredCreators.map((c) => (
            <div key={c.username} className="creator-card">
              <img src={c.avatar} alt={c.name} className="creator-img" />
              <h3>{c.name}</h3>
              <p style={{ color: theme.primary, fontWeight: 'bold' }}>@{c.username}</p>
              
              <button onClick={() => handleAction(c.username)} className="pill-btn-3d">
                {loadingCreator === c.username ? (
                  <span className="loader-dots">Verifying</span>
                ) : (
                  "View Profile"
                )}
              </button>
            </div>
          ))}
        </div>

        {/* --- SEO POWER CONTENT: COMPARISONS --- */}
        <section className="seo-article">
          <h2>Why OnlyCrave is the Leading OnlyFans Alternative</h2>
          <p>
            In the rapidly expanding creator economy, <strong>OnlyCrave</strong> stands out as a high-performance alternative to platforms like <strong>OnlyFans</strong> and <strong>Fansly</strong>. 
            While global giants focus on broad markets, OnlyCrave prioritizes creator autonomy, security, and localized payment accessibility—specifically for users in regions where traditional credit cards are less common.
          </p>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>OnlyCrave</th>
                  <th>OnlyFans</th>
                  <th>Fansly</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>M-Pesa Support</strong></td>
                  <td style={{color: theme.secondary}}>✓ Yes</td>
                  <td>✗ No</td>
                  <td>✗ No</td>
                </tr>
                <tr>
                  <td><strong>Creator Payout</strong></td>
                  <td>80% - 90%</td>
                  <td>80%</td>
                  <td>80%</td>
                </tr>
                <tr>
                  <td><strong>Crypto Payments</strong></td>
                  <td style={{color: theme.secondary}}>✓ Instant</td>
                  <td>✗ Limited</td>
                  <td>✓ Yes</td>
                </tr>
                <tr>
                  <td><strong>Verification Speed</strong></td>
                  <td>Fast (24h)</td>
                  <td>Slow (3-5 Days)</td>
                  <td>Moderate</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>The Official OnlyCrave Search Experience</h3>
          <p>
            Our directory is designed to bridge the gap between fans and elite creators. Unlike the fragmented search on other platforms, 
            the <strong>OnlyCrave Search</strong> tool allows users to find verified profiles with zero friction. Whether you are looking 
            for fitness tips, exclusive lifestyle vlogs, or digital art, our directory ensures you land on the official, 
            verified page of your favorite influencer.
          </p>

          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <details>
              <summary>Is OnlyCrave better than OnlyFans?</summary>
              <p>For creators, OnlyCrave offers superior payout methods and local support. For fans, it provides a much more flexible checkout experience, including M-Pesa and PayPal, which are often restricted on OnlyFans.</p>
            </details>
            <details>
              <summary>How do I know if a creator is verified?</summary>
              <p>All creators listed in this official directory have passed the OnlyCrave Identity Verification (IDV) process, ensuring you are subscribing to the real person and not a fake account.</p>
            </details>
            <details>
              <summary>What are the billing terms on OnlyCrave?</summary>
              <p>OnlyCrave uses discreet billing for your privacy. Your statement will show a generic descriptor rather than a site-specific tag, ensuring your lifestyle choices remain your own.</p>
            </details>
          </div>
        </article>
      </main>

      {/* --- STYLES --- */}
      <style jsx>{`
        .logo-3d {
          font-size: 2.5rem; font-weight: 900; letter-spacing: -2px;
          perspective: 500px; cursor: default;
        }
        .logo-only { color: ${theme.primary}; text-shadow: 2px 2px 0px #000, 4px 4px 15px ${theme.primary}66; }
        .logo-crave { color: ${theme.secondary}; text-shadow: 2px 2px 0px #000, 4px 4px 15px ${theme.secondary}66; transform: translateZ(20px); }

        .search-pill-container {
          max-width: 650px; margin: 0 auto; position: relative;
        }
        .search-input {
          width: 100%; padding: 20px 40px; border-radius: 50px;
          border: 1px solid ${theme.border}; background: ${theme.glass};
          color: ${theme.text}; font-size: 1.1rem; outline: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: 0.3s;
        }
        .search-input:focus { border-color: ${theme.primary}; box-shadow: 0 15px 40px ${theme.primary}22; }

        .creator-card {
          background: ${theme.card}; border-radius: 30px; padding: 25px;
          text-align: center; border: 1px solid ${theme.border};
          transition: 0.3s; position: relative;
        }
        .creator-card:hover { transform: translateY(-10px); border-color: ${theme.primary}; }
        .creator-img { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid ${theme.secondary}; margin-bottom: 15px; }

        .pill-btn-3d {
          width: 100%; margin-top: 15px; padding: 15px;
          border-radius: 50px; border: none;
          background: linear-gradient(145deg, ${theme.accent}, #000);
          color: white; font-weight: 800; cursor: pointer;
          box-shadow: 0 6px 0px #000, 0 10px 20px rgba(0,0,0,0.3);
          transition: 0.1s; position: relative; top: 0;
        }
        .pill-btn-3d:active { top: 4px; box-shadow: 0 2px 0px #000, 0 5px 10px rgba(0,0,0,0.3); }

        .seo-article { margin-top: 80px; padding: 60px 0; border-top: 1px solid ${theme.border}; line-height: 1.8; color: ${theme.text}cc; }
        .seo-article h2, .seo-article h3 { color: ${theme.text}; margin: 30px 0 15px; }

        .comparison-table-wrapper { overflow-x: auto; margin: 40px 0; }
        .comparison-table { width: 100%; border-collapse: collapse; background: ${theme.card}; border-radius: 20px; overflow: hidden; }
        .comparison-table th, .comparison-table td { padding: 20px; text-align: left; border-bottom: 1px solid ${theme.border}; }
        .comparison-table th { background: ${theme.primary}; color: white; }

        .faq-section { margin-top: 60px; }
        details { background: ${theme.card}; margin-bottom: 10px; padding: 20px; border-radius: 15px; cursor: pointer; }
        summary { font-weight: 800; list-style: none; }
        
        .loader-dots::after {
          content: '...';
          animation: dots 1.5s steps(5, end) infinite;
        }
        @keyframes dots { 0%, 20% { color: rgba(0,0,0,0); } 40% { color: white; } }

        @media (max-width: 768px) {
          .logo-3d { font-size: 1.8rem; }
          .pill-btn-3d { font-size: 0.9rem; }
        }
      `}</style>
    </div>
  );
}

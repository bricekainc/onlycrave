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
  const [loading, setLoading] = useState(true);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');

  // 1. Theme and Loading Logic
  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
    
    // Premium loading delay to reduce bounce rate and build anticipation
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const theme = {
    bg: isDarkMode ? '#050505' : '#ffffff',
    card: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
    glass: isDarkMode ? 'rgba(22, 22, 26, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    text: isDarkMode ? '#ffffff' : '#1a1a1b',
    primary: '#e33cc7', 
    secondary: '#2ddfff', 
    accent: '#0102FD',
    border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    muted: isDarkMode ? '#888' : '#666',
  };

  const filteredCreators = creators.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const triggerAgeGate = (username: string) => {
    setTargetUrl(`/${username}`);
    setShowAgeGate(true);
  };

  const handleAgeVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      router.push(targetUrl);
    } else {
      window.location.href = "https://briceka.com/onlycrave";
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#050505', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div className="loader-ring"></div>
        <h2 style={{ color: '#fff', marginTop: '20px', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: '300' }}>LOADING ONLYCRAVE</h2>
        <style jsx>{`
          .loader-ring {
            width: 80px; height: 80px;
            border: 2px solid #e33cc7;
            border-radius: 50%;
            border-top-color: #2ddfff;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', transition: '0.3s', fontFamily: '"Inter", system-ui, sans-serif' }}>
      <Head>
        <title>OnlyCrave Directory | Search 500+ Verified Creators & Influencers</title>
        <meta name="description" content="The ultimate OnlyCrave search engine. Find verified creators, browse exclusive profiles, and subscribe using M-Pesa, PayPal, or Crypto. Join the elite OnlyCrave community." />
        <meta name="keywords" content="OnlyCrave search, find OnlyCrave creators, Mpesa OnlyCrave, verified influencers, adult content directory, OnlyCrave Kenya, secure subscription" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="wsBEVCOeRh045P5uzn7Gk0kEjgf7eqshyP3XuDIKGn4" />
        
        {/* JSON-LD for rich snippets */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "OnlyCrave Search",
          "url": "https://onlycrave.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://onlycrave.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />
      </Head>

      {/* --- FLOATING ACTIONS --- */}
      <div className="floating-nav">
        <a href="https://onlycrave.com/register" className="btn-primary">Get Started</a>
        <a href="https://onlycrave.com/login" className="btn-secondary">Login</a>
      </div>

      <button onClick={() => setIsDarkMode(!isDarkMode)} className="theme-toggle">
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* --- HERO SECTION --- */}
      <header style={{ padding: '100px 20px 60px', textAlign: 'center', background: `radial-gradient(circle at top, ${theme.primary}11 0%, transparent 70%)` }}>
        <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>
          <span style={{ color: theme.primary, textShadow: `0 0 30px ${theme.primary}55` }}>Only</span>
          <span style={{ color: theme.secondary, textShadow: `0 0 30px ${theme.secondary}55` }}>Crave</span>
        </h1>
        <p style={{ maxWidth: '700px', margin: '20px auto', opacity: 0.8, fontSize: '1.2rem', lineHeight: '1.6', fontWeight: '300' }}>
          Discover the world's most <strong>exclusive verified creators</strong>. Access premium content with unmatched privacy and secure payment options including M-Pesa.
        </p>

        {/* --- 3D SEARCH BAR --- */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search by name or username..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="search-stats">
            Displaying {filteredCreators.length} elite creators
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT & SEO TEXT --- */}
      <main style={{ padding: '40px 20px', maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* Creator Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', marginBottom: '80px' }}>
          {filteredCreators.map((c) => (
            <div key={c.username} className="creator-card">
              <div className="card-inner">
                <img src={c.avatar} alt={c.name} className="avatar" />
                <h3 style={{ margin: '15px 0 5px 0', fontSize: '1.4rem' }}>{c.name}</h3>
                <p style={{ color: theme.primary, fontWeight: '700', fontSize: '0.9rem', marginBottom: '20px' }}>@{c.username}</p>
                <button onClick={() => triggerAgeGate(c.username)} className="view-btn">
                  Explore Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- SEO RICH CONTENT SECTION (400+ Words) --- */}
        <article className="seo-content">
          <section>
            <h2>The Official OnlyCrave Creator Directory</h2>
            <p>
              Welcome to the internet's most comprehensive search engine for <strong>OnlyCrave influencers and creators</strong>. 
              As the digital landscape evolves, fans are looking for more authentic, direct, and secure ways to support their 
              favorite personalities. OnlyCrave provides a bridge, offering a premium environment where content is 
              exclusive and interactions are meaningful.
            </p>
            <p>
              Our directory features over 500 verified profiles, ranging from top-tier fashion models and fitness experts 
              to digital artists and lifestyle influencers. Every creator in our database has undergone a rigorous 
              verification process to ensure that you, the fan, are interacting with real people and authentic content.
            </p>
          </section>

          <section style={{ margin: '40px 0' }}>
            <h2>Secure Payments: M-Pesa, PayPal, and Crypto</h2>
            <p>
              One of the primary reasons OnlyCrave has become a global leader in the creator economy is our flexible 
              and localized payment infrastructure. We understand that privacy and accessibility are paramount. 
              That is why we support:
            </p>
            <ul style={{ lineHeight: '2' }}>
              <li><strong>M-Pesa:</strong> Direct integration for our African audience, allowing for instant wallet top-ups.</li>
              <li><strong>PayPal & Cards:</strong> Standard secure processing for global convenience.</li>
              <li><strong>Cryptocurrency:</strong> Use Bitcoin, Ethereum, and more via Coinbase or CoinPayments for maximum anonymity.</li>
              <li><strong>Discreet Billing:</strong> We ensure your privacy is respected on every statement.</li>
            </ul>
          </section>

          {/* --- FAQ SECTION --- */}
          <section className="faq-section">
            <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '40px' }}>Frequently Asked Questions</h2>
            <div className="faq-grid">
              <details>
                <summary>How do I find a specific OnlyCrave creator?</summary>
                <p>Use our advanced search bar at the top of the page. You can search by their real name or their OnlyCrave @username. Our real-time filters will display verified profiles matching your query instantly.</p>
              </details>
              <details>
                <summary>Is OnlyCrave safe for users?</summary>
                <p>Absolutely. OnlyCrave uses high-level SSL encryption to protect user data. Furthermore, we offer 2FA (Two-Factor Authentication) and secure payment gateways to ensure your financial information is never compromised.</p>
              </details>
              <details>
                <summary>Can I use M-Pesa to subscribe?</summary>
                <p>Yes, OnlyCrave is one of the few premium platforms that supports M-Pesa. You can either pay directly for a subscription or deposit funds into your OnlyCrave Wallet using the M-Pesa STK push method.</p>
              </details>
              <details>
                <summary>Why should I join OnlyCrave?</summary>
                <p>OnlyCrave offers higher resolution content, faster streaming speeds, and a more intuitive interface than many other subscription platforms. It also supports creators with lower fees, meaning more of your support goes directly to them.</p>
              </details>
              <details>
                <summary>Are there any hidden fees?</summary>
                <p>No. The price you see on a creator's profile is the price you pay. Wallet deposits and direct subscriptions are transparent, and you can view your full transaction history in your account dashboard.</p>
              </details>
            </div>
          </section>
        </article>
      </main>

      {/* --- AGE VERIFICATION MODAL --- */}
      {showAgeGate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>🔞</div>
            <h2 style={{ fontSize: '1.8rem', color: theme.primary }}>18+ Verification</h2>
            <p style={{ margin: '15px 0 30px', opacity: 0.8 }}>This section contains adult content. Please confirm you are at least 18 years of age to proceed.</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => handleAgeVerify(false)} className="modal-btn-no">I am under 18</button>
              <button onClick={() => handleAgeVerify(true)} className="modal-btn-yes">I am 18 or older</button>
            </div>
          </div>
        </div>
      )}

      {/* --- STYLES --- */}
      <style jsx>{`
        .floating-nav {
          position: fixed; bottom: 30px; left: 30px; 
          display: flex; gap: 15px; z-index: 1000;
        }
        .btn-primary {
          padding: 14px 28px; background: ${theme.primary}; color: white;
          border-radius: 40px; font-weight: 800; text-decoration: none;
          box-shadow: 0 10px 20px ${theme.primary}44; transition: 0.3s;
        }
        .btn-secondary {
          padding: 14px 28px; background: ${theme.secondary}; color: #000;
          border-radius: 40px; font-weight: 800; text-decoration: none;
          box-shadow: 0 10px 20px ${theme.secondary}44; transition: 0.3s;
        }
        .theme-toggle {
          position: fixed; bottom: 30px; right: 30px; z-index: 1000;
          width: 60px; height: 60px; border-radius: 50%;
          border: 1px solid ${theme.border}; background: ${theme.glass};
          cursor: pointer; font-size: 24px; backdrop-filter: blur(10px);
        }
        .search-container {
          width: 90%; maxWidth: 700px; margin: 40px auto 0; position: relative;
        }
        .search-container input {
          width: 100%; padding: 25px 35px; border-radius: 100px;
          border: 1px solid ${theme.border}; background: ${theme.glass};
          color: ${theme.text}; fontSize: 1.2rem; outline: none;
          backdrop-filter: blur(20px); box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          transition: 0.3s;
        }
        .search-container input:focus { border-color: ${theme.primary}; transform: translateY(-5px); }
        .search-stats { margin-top: 20px; color: ${theme.muted}; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; }
        
        .creator-card {
          background: ${theme.card}; border-radius: 32px; padding: 30px;
          border: 1px solid ${theme.border}; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative; overflow: hidden;
        }
        .creator-card:hover { transform: translateY(-10px) rotateX(5deg); border-color: ${theme.secondary}; box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
        .avatar { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid ${theme.secondary}; }
        .view-btn {
          width: 100%; padding: 15px; border-radius: 16px; border: none;
          background: ${theme.accent}; color: white; font-weight: 800;
          cursor: pointer; transition: 0.3s;
        }
        .view-btn:hover { background: ${theme.primary}; }

        .seo-content { margin-top: 100px; line-height: 1.8; color: ${theme.muted}; }
        .seo-content h2 { color: ${theme.text}; margin-bottom: 20px; }
        
        .faq-grid { display: grid; gap: 15px; }
        details { background: ${theme.card}; padding: 20px; border-radius: 20px; border: 1px solid ${theme.border}; }
        summary { font-weight: 700; cursor: pointer; color: ${theme.text}; }
        
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.95);
          backdrop-filter: blur(20px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;
        }
        .modal-content {
          background: ${theme.glass}; padding: 50px; border-radius: 40px;
          max-width: 500px; width: 100%; text-align: center; border: 1px solid ${theme.primary};
        }
        .modal-btn-no { flex: 1; padding: 18px; border-radius: 15px; border: 1px solid ${theme.border}; background: transparent; color: ${theme.text}; cursor: pointer; }
        .modal-btn-yes { flex: 1; padding: 18px; border-radius: 15px; border: none; background: ${theme.primary}; color: white; font-weight: 900; cursor: pointer; }
        
        @media (max-width: 768px) {
          .floating-nav { left: 10px; right: 10px; bottom: 10px; flex-direction: row; }
          .btn-primary, .btn-secondary { flex: 1; text-align: center; padding: 12px; font-size: 0.8rem; }
          .theme-toggle { display: none; }
        }
      `}</style>
    </div>
  );
}

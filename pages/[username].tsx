import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCreators } from '../lib/getCreators';

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const creators = await getCreators();
  const creator = creators.find((c: any) => c.username.toLowerCase() === username.toLowerCase());

  if (!creator) return { notFound: true };

  return { props: { creator } };
}

export default function CreatorProfile({ creator }: { creator: any }) {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);

  useEffect(() => {
    // Sync with system theme or default to light mode as per user preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
  }, []);

  const theme = {
    bg: isDarkMode ? '#0a0a0c' : '#ffffff',
    card: isDarkMode ? '#16161a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#1a1a1b',
    primary: '#e33cc7', // OnlyCrave Pink
    secondary: '#2ddfff', // OnlyCrave Cyan
    blue: '#0102FD',
    border: isDarkMode ? '#222' : '#eaeaea',
    muted: isDarkMode ? '#888' : '#666',
  };

  // SEO Optimized Meta & FAQ Schema
  const pageTitle = `${creator.name} (@${creator.username}) | Official OnlyCrave Profile`;
  const seoDescription = `Access ${creator.name}'s exclusive content on OnlyCrave. Support @${creator.username} using M-Pesa, PayPal, or Crypto. Join the official community today.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How can I subscribe to ${creator.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can subscribe to ${creator.name} on OnlyCrave using PayPal, Credit/Debit Cards, or M-Pesa. Simply log in and click the subscribe button.`
        }
      },
      {
        "@type": "Question",
        "name": `Does OnlyCrave accept M-Pesa for ${creator.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, OnlyCrave supports M-Pesa. You can pay directly at checkout or top up your wallet using M-Pesa."
        }
      },
      {
        "@type": "Question",
        "name": "Is my payment anonymous?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OnlyCrave offers various secure and private payment methods including Crypto (Coinbase/CoinPayments) for enhanced privacy."
        }
      }
    ]
  };

  const handleAgeVerify = (isOfAge: boolean) => {
    if (isOfAge) {
      window.location.href = creator.link;
    } else {
      window.location.href = "https://briceka.com/onlycrave";
    }
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", transition: '0.3s' }}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={`${creator.name}, ${creator.username}, OnlyCrave, Mpesa, PayPal, Subscription, Exclusive Content`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={creator.avatar} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Navigation */}
        <nav style={{ marginBottom: '40px' }}>
          <button 
            onClick={() => router.push('/')} 
            style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}
          >
            ← Back to Directory
          </button>
        </nav>

        {/* Profile Header */}
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={creator.avatar} 
              alt={`${creator.name} profile`} 
              style={{ width: 'clamp(120px, 20vw, 180px)', height: 'clamp(120px, 20vw, 180px)', borderRadius: '50%', objectFit: 'cover', border: `4px solid ${theme.primary}`, boxShadow: `0 15px 35px ${theme.primary}44` }} 
            />
            <div title="Verified Creator" style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: theme.secondary, color: '#000', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: `3px solid ${theme.bg}` }}>✓</div>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '900', marginTop: '25px', marginBottom: '8px', letterSpacing: '-0.02em' }}>{creator.name}</h1>
          <p style={{ color: theme.primary, fontSize: '1.25rem', fontWeight: '600' }}>@{creator.username}</p>
        </header>

        {/* Bio Section */}
        <section style={{ backgroundColor: theme.card, padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: `1px solid ${theme.border}`, marginBottom: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', color: theme.secondary, textTransform: 'uppercase', letterSpacing: '1px' }}>Creator Bio</h2>
          <p style={{ lineHeight: '1.8', opacity: 0.9, fontSize: '1.1rem' }}>{creator.description}</p>
        </section>

        {/* Payment & CTA Card */}
        <section style={{ backgroundColor: theme.card, padding: 'clamp(20px, 5vw, 40px)', borderRadius: '24px', border: `2px solid ${theme.blue}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 16px', background: theme.blue, color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', borderBottomLeftRadius: '16px' }}>SECURE GATEWAY</div>
          
          <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>How to Support {creator.name}</h2>
          
          <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <span style={{ background: theme.primary, color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0, fontWeight: 'bold' }}>1</span>
              <p style={{ margin: 0 }}><strong>Instant Access:</strong> Pay via <strong>M-Pesa, PayPal, or Credit Card</strong> directly on the profile checkout.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <span style={{ background: theme.primary, color: '#fff', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0, fontWeight: 'bold' }}>2</span>
              <p style={{ margin: 0 }}><strong>Wallet Top-up:</strong> Load your <a href="https://onlycrave.com/my/wallet" style={{ color: theme.secondary, fontWeight: '600' }}>OnlyCrave Wallet</a> using <strong>Crypto (BTC/ETH), Atlos, or Bank Transfer</strong>.</p>
            </div>
          </div>

          <button 
            onClick={() => setShowAgeGate(true)}
            style={{ width: '100%', padding: '22px', borderRadius: '16px', border: 'none', background: `linear-gradient(135deg, ${theme.blue} 0%, ${theme.primary} 100%)`, color: '#fff', fontWeight: '800', fontSize: '1.2rem', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 10px 25px rgba(227, 60, 199, 0.3)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Unlock {creator.name}'s Content
          </button>
        </section>

        {/* Enhanced FAQ Section for SEO */}
        <section style={{ marginTop: '60px' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '20px', textAlign: 'center' }}>Frequently Asked Questions</h3>
          
          {[
            { q: `Is this the official page for ${creator.name}?`, a: `Yes, this is the verified directory page for ${creator.name} on OnlyCrave.` },
            { q: `How do I use M-Pesa on OnlyCrave?`, a: "Select the 'M-Pesa' option at checkout. You will receive an STK push on your phone to enter your PIN and complete the transaction safely." },
            { q: "Will 'OnlyCrave' show up on my bank statement?", a: "To ensure your privacy, we use discreet billing descriptors. Check your wallet settings for more details." },
            { q: "Can I cancel my subscription anytime?", a: "Yes, you have full control over your subscriptions and can cancel at any time from your account dashboard." }
          ].map((item, idx) => (
            <details key={idx} style={{ padding: '20px 0', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }}>
              <summary style={{ fontWeight: '600', fontSize: '1.1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.q}
                <span style={{ color: theme.primary }}>+</span>
              </summary>
              <p style={{ paddingTop: '15px', color: theme.muted, lineHeight: '1.6' }}>{item.a}</p>
            </details>
          ))}
        </section>
      </main>

      {/* --- AGE VERIFICATION MODAL --- */}
      {showAgeGate && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '32px', maxWidth: '450px', width: '100%', textAlign: 'center', border: `2px solid ${theme.primary}`, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔞</div>
            <h2 style={{ color: theme.primary, fontSize: '1.8rem', marginBottom: '10px' }}>Age Verification</h2>
            <p style={{ marginBottom: '30px', opacity: 0.8, fontSize: '1.1rem' }}>This profile contains adult content. Are you 18 years of age or older?</p>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => handleAgeVerify(false)} 
                style={{ flex: 1, padding: '18px', borderRadius: '14px', border: `1px solid ${theme.border}`, backgroundColor: 'transparent', color: theme.text, cursor: 'pointer', fontWeight: '600' }}
              >
                No, I am under 18
              </button>
              <button 
                onClick={() => handleAgeVerify(true)} 
                style={{ flex: 1, padding: '18px', borderRadius: '14px', border: 'none', background: theme.primary, color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
              >
                Yes, I am 18+
              </button>
            </div>
            <p style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.5 }}>By clicking "Yes", you agree to our Terms of Service.</p>
          </div>
        </div>
      )}

      {/* Footer SEO Text */}
      <footer style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.6, fontSize: '0.9rem' }}>
        <p>© {new Date().getFullYear()} OnlyCrave Directory • Verified Profile of {creator.name}</p>
      </footer>

      <style jsx global>{`
        body { margin: 0; padding: 0; }
        details > summary::-webkit-details-marker { display: none; }
        a { text-decoration: none; transition: 0.2s; }
        a:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
}

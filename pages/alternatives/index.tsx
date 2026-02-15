import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// Popular competitors for quick internal linking
const trendingCompetitors = [
  { name: 'OnlyFans', slug: 'onlyfans', icon: '💎' },
  { name: 'Fansly', slug: 'fansly', icon: '🔥' },
  { name: 'Fanvue', slug: 'fanvue', icon: '🚀' },
  { name: 'Patreon', slug: 'patreon', icon: '🎨' },
  { name: 'Exclu', slug: 'exclu', icon: '🔒' },
  { name: 'LoyalFans', slug: 'loyalfans', icon: '⭐' },
];

export default function AlternativesSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const router = useRouter();

  const loadingMessages = [
    "Fetching platform data...",
    "Analyzing commission structures...",
    "Comparing privacy protocols...",
    "Ranking user satisfaction...",
    "Finalizing 2026 report..."
  ];

  const triggerSearch = (targetSlug: string) => {
    setIsProcessing(true);
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      router.push(`/alternatives/${targetSlug.toLowerCase().replace(/\s+/g, '-')}`);
    }, 5000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) triggerSearch(searchTerm);
  };

  if (isProcessing) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' 
      }}>
        <div className="premium-loader"></div>
        <h2 style={{ marginTop: '2rem', fontWeight: '300', letterSpacing: '2px', textAlign: 'center' }}>
          {loadingMessages[loadingStep]}
        </h2>
        <style jsx>{`
          .premium-loader {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top: 3px solid #0070f3;
            border-radius: 50%;
            animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem', fontFamily: 'system-ui, sans-serif', color: '#111' }}>
      <Head>
        <title>Compare OnlyCrave with Any Platform | 2026 Best Creator Alternatives</title>
        <meta name="description" content="Discover why OnlyCrave is the top-ranked alternative for creators in 2026. Compare fees, payouts, and privacy with any website instantly." />
      </Head>

      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <span style={{ backgroundColor: '#0070f315', color: '#0070f3', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          2026 MARKET COMPARISON ENGINE
        </span>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginTop: '1.5rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
          OnlyCrave vs The World
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
          The data-backed tool to find the highest-paying, most secure platform for your content.
        </p>
        
        <form onSubmit={handleFormSubmit} style={{ marginTop: '3rem', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="Type any website name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '1.2rem 2rem', width: '100%', maxWidth: '450px', 
              borderRadius: '16px', border: '1px solid #eee', fontSize: '1.1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)', outline: 'none'
            }}
          />
          <button type="submit" style={{ 
            padding: '1rem 2.5rem', borderRadius: '16px', border: 'none', 
            backgroundColor: '#000', color: '#fff', fontWeight: '700', cursor: 'pointer',
            transition: 'transform 0.2s'
          }}>
            Analyze
          </button>
        </form>
      </div>

      {/* Trending Section */}
      <section style={{ marginBottom: '6rem' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Trending Comparisons</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          {trendingCompetitors.map((item) => (
            <div 
              key={item.slug}
              onClick={() => triggerSearch(item.slug)}
              style={{ 
                padding: '1.5rem', borderRadius: '20px', border: '1px solid #f0f0f0', 
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s',
                backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#0070f3';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <div style={{ fontWeight: '600' }}>{item.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>Analyze Rank</div>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '4rem 0' }} />

      {/* SEO Content Article */}
      <article style={{ lineHeight: '1.9', color: '#333', fontSize: '1.1rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#000' }}>The Evolution of Creator Independence in 2026</h2>
        <p>
          As we navigate the mid-2020s, the "Creator Economy" has matured into a sophisticated market. Creators are no longer 
          settling for high platform fees and restrictive algorithms. OnlyCrave has built its reputation on being the 
          <strong> top-ranked alternative</strong> by focusing on a fundamental shift: creator-centric infrastructure.
        </p>

        <h3 style={{ marginTop: '2.5rem' }}>Platform Fees: The Silent Profit Killer</h3>
        <p>
          When you compare OnlyCrave with legacy giants, the most glaring difference is the commission structure. 
          While many platforms still demand a 20% cut—essentially making them a silent business partner that provides 
          minimal marketing support—OnlyCrave has optimized its operations to offer a industry-leading 10% fee. 
          For a creator earning $50,000 annually, this switch results in $5,000 of pure profit returned to their pocket.
        </p>

        <h3 style={{ marginTop: '2.5rem' }}>Ranking Privacy and Security Protocols</h3>
        <p>
          2026 is the year of privacy. With increasing concerns over data harvesting and digital footprints, OnlyCrave 
          utilizes military-grade encryption to protect both creator identities and fan transactions. Unlike many 
          competitors who sell "aggregate data" to third-party advertisers, our privacy policy is strictly zero-knowledge. 
          When you use our comparison tool, you'll see how we stack up against others who may prioritize 
          corporate data over individual security.
        </p>

        <h3 style={{ marginTop: '2.5rem' }}>Internal Discovery vs. External Hustle</h3>
        <p>
          The biggest challenge for 90% of creators is finding new fans without spending 10 hours a day on social media. 
          The OnlyCrave "Smart Discovery" engine uses AI to match creators with fans based on specific interests and 
          engagement patterns, rather than just who has the biggest marketing budget. This allows smaller, high-quality 
          creators to rank alongside major influencers, fostering a healthier and more diverse ecosystem.
        </p>
      </article>

      <footer style={{ marginTop: '5rem', padding: '2rem 0', borderTop: '1px solid #eee', textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#666', fontWeight: '500' }}>
          Return to OnlyCrave Homepage
        </Link>
      </footer>
    </div>
  );
}

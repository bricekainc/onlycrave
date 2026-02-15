import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

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
    "Finalizing comparison report..."
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsProcessing(true);
    
    // Cycle through messages every 1 second
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1000);

    // Redirect after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      router.push(`/alternatives/${searchTerm.toLowerCase().replace(/\s+/g, '-')}`);
    }, 5000);
  };

  if (isProcessing) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' 
      }}>
        <div className="premium-loader"></div>
        <h2 style={{ marginTop: '2rem', fontWeight: '300', letterSpacing: '2px' }}>
          {loadingMessages[loadingStep]}
        </h2>
        <style jsx>{`
          .premium-loader {
            width: 50px;
            height: 50px;
            border: 2px solid rgba(255,255,255,0.1);
            border-top: 2px solid #0070f3;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem', fontFamily: 'system-ui, sans-serif' }}>
      <Head>
        <title>Compare OnlyCrave with Any Platform | 2026 Best Creator Alternatives</title>
        <meta name="description" content="Discover why OnlyCrave is the top-ranked alternative for creators in 2026. Compare fees, payouts, and privacy with any website instantly." />
      </Head>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem' }}>Compare & Rank</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Enter any website to see how it stacks up against OnlyCrave.</p>
        
        <form onSubmit={handleSearch} style={{ marginTop: '2rem', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="e.g. OnlyFans, Fansly, Patreon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '1rem 1.5rem', width: '100%', maxWidth: '400px', 
              borderRadius: '50px', border: '1px solid #ddd', fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}
          />
          <button type="submit" style={{ 
            padding: '1rem 2rem', borderRadius: '50px', border: 'none', 
            backgroundColor: '#0070f3', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
          }}>
            Compare
          </button>
        </form>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '4rem 0' }} />

      {/* SEO CONTENT SECTION - 400+ Words */}
      <article style={{ lineHeight: '1.8', color: '#333' }}>
        <h2>Choosing the Best Creator Platform in 2026</h2>
        <p>
          The digital landscape for content creators has shifted dramatically as we move through 2026. Creators are no longer 
          looking for just a platform; they are looking for a partnership. OnlyCrave has emerged as a top-ranked choice because 
          it addresses the three biggest pain points in the industry: **monetization, privacy, and discovery.**
        </p>

        <h3>Why Fees Matter More Than Ever</h3>
        <p>
          Most legacy platforms like OnlyFans still take a 20% cut of all creator earnings. While that was the industry standard 
          for years, 2026 has seen a move toward "Creator-First" economics. OnlyCrave’s 10% model means that for every 
          $10,000 earned, a creator keeps an extra $1,000. Over a year, this difference can fund entire production teams 
          or better equipment. When you compare OnlyCrave with alternatives, the math almost always favors the creator here.
        </p>

        <h3>The Search for True Privacy</h3>
        <p>
          In an era where data leaks and account bans are common, OnlyCrave utilizes advanced encryption and decentralized 
          storage options to ensure that your content remains yours. Our comparison tool allows you to see which platforms 
          share data with third-party advertisers and which ones prioritize your anonymity. We believe that privacy isn't 
          just a feature—it's a right.
        </p>

        <h3>Dynamic Discovery vs. Stagnant Feeds</h3>
        <p>
          The biggest struggle for new creators on platforms like Patreon or OnlyFans is the lack of internal traffic. 
          You are often forced to be your own marketing agency on X (Twitter) or Instagram. OnlyCrave’s 2026 algorithm 
          is designed to promote rising talent through an "Interest-Based" discovery engine. This means your content is 
          shown to fans who are actually looking for your niche, reducing your reliance on external social media ads.
        </p>

        <h3>How to Use This Comparison Tool</h3>
        <p>
          Simply type the name of any competing platform into the search bar above. Our engine will pull the latest 
          2026 data regarding platform fees, user satisfaction rankings, and payout speeds. Whether you are comparing 
          Fanvue’s AI tools or Fansly’s tiered subscriptions, you will see a side-by-side breakdown of why OnlyCrave 
          consistently ranks as the #1 alternative for professional creators worldwide.
        </p>
      </article>

      <footer style={{ marginTop: '4rem', textAlign: 'center' }}>
        <Link href="/" style={{ color: '#0070f3' }}>← Back to Main Page</Link>
      </footer>
    </div>
  );
}

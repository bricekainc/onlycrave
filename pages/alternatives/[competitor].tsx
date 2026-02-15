import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const ONLYCRAVE_DATA = {
  name: 'OnlyCrave',
  fee: 'Less than 5%',
  kyc: '5 Minutes',
  rating: 4.9,
  payouts: ['BTC/USDT', 'M-Pesa', 'Mobile Money', 'PayPal', 'Paystack', 'Flutterwave', 'Bank Transfer'],
  features: ['Creator Shop', 'Encrypted Privacy', 'Video & Audio Calls', 'Age Verification', 'Live Streaming', 'Instant KYC', 'AI Friendly']
};

const competitorsData: Record<string, any> = {
  'onlyfans': { name: 'OnlyFans', fee: '20%', kyc: '24-72h', rating: 4.0, features: ['Standard Subs', 'PPV Messaging'] },
  'fansly': { name: 'Fansly', fee: '20%', kyc: '12-48h', rating: 4.4, features: ['Tiered Subs', 'Discovery'] },
  'loyalfans': { name: 'LoyalFans', fee: '20%', kyc: '24h+', rating: 4.1, features: ['Standard Tools'] }
};

export default function SEOComparisonPage() {
  const router = useRouter();
  const { competitor: slug } = router.query;
  if (!router.isReady) return null;

  const safeSlug = String(slug).toLowerCase();
  const competitor = competitorsData[safeSlug] || { 
    name: safeSlug.charAt(0).toUpperCase() + safeSlug.slice(1), 
    fee: '20%', kyc: '24h+', rating: 3.5, features: ['Standard Tools'] 
  };

  return (
    <div className="page-container">
      <Head>
        <title>OnlyCrave vs {competitor.name} | The Best {competitor.name} Alternative (2026)</title>
        <meta name="description" content={`Is OnlyCrave better than ${competitor.name}? Discover why creators are switching for < 5% fees, instant KYC, and localized payouts like M-Pesa.`} />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #ffffff;
          --text: #111827;
          --text-muted: #6b7280;
          --glass-bg: rgba(255, 255, 255, 0.7);
          --glass-border: rgba(0, 0, 0, 0.1);
          --accent: #3b82f6;
          --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #0a0a0a;
            --text: #f9fafb;
            --text-muted: #9ca3af;
            --glass-bg: rgba(255, 255, 255, 0.03);
            --glass-border: rgba(255, 255, 255, 0.1);
            --card-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
          }
        }

        body {
          background-color: var(--bg);
          color: var(--text);
          margin: 0;
          font-family: 'Inter', -apple-system, sans-serif;
          transition: background-color 0.3s ease;
        }

        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: var(--card-shadow);
        }
      `}</style>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Header Section */}
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.04em' }}>
            {ONLYCRAVE_DATA.name} <span style={{ color: 'var(--accent)' }}>vs</span> {competitor.name}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
            The definitive 2026 guide for creators looking for lower fees, faster payouts, and ultimate creative freedom.
          </p>
        </header>

        {/* Comparison Table Section */}
        <div className="glass-card" style={{ overflowX: 'auto', marginBottom: '80px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '25px', textAlign: 'left', color: 'var(--text-muted)' }}>Core Features</th>
                <th style={{ padding: '25px', textAlign: 'left', color: 'var(--accent)' }}>OnlyCrave</th>
                <th style={{ padding: '25px', textAlign: 'left' }}>{competitor.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '20px 25px', borderBottom: '1px solid var(--glass-border)' }}>Commission Fee</td>
                <td style={{ padding: '20px 25px', borderBottom: '1px solid var(--glass-border)', fontWeight: 800, color: '#10b981' }}>{ONLYCRAVE_DATA.fee}</td>
                <td style={{ padding: '20px 25px', borderBottom: '1px solid var(--glass-border)' }}>{competitor.fee}</td>
              </tr>
              <tr>
                <td style={{ padding: '20px 25px', borderBottom: '1px solid var(--glass-border)' }}>KYC Verification</td>
                <td style={{ padding: '20px 25px', borderBottom: '1px solid var(--glass-border)' }}>{ONLYCRAVE_DATA.kyc}</td>
                <td style={{ padding: '20px 25px', borderBottom: '1px solid var(--glass-border)' }}>{competitor.kyc}</td>
              </tr>
              {ONLYCRAVE_DATA.features.map((feature, i) => (
                <tr key={i}>
                  <td style={{ padding: '15px 25px', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>{feature}</td>
                  <td style={{ padding: '15px 25px', borderBottom: '1px solid var(--glass-border)' }}>✅</td>
                  <td style={{ padding: '15px 25px', borderBottom: '1px solid var(--glass-border)' }}>{competitor.features.includes(feature) ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SEO CONTENT AREA (400+ Words) */}
        <section style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '24px' }}>Why Creators are Choosing OnlyCrave as the Best {competitor.name} Alternative</h2>
          
          <p style={{ marginBottom: '24px' }}>
            In 2026, content creators are facing a turning point. Traditional platforms like {competitor.name} have long dominated the market, but their 20% commission rates are increasingly hard for independent artists to justify. OnlyCrave was built to disrupt this model by offering a <strong>sub-5% platform fee</strong>, ensuring that creators keep the vast majority of their hard-earned revenue.
          </p>

          <h3 style={{ fontSize: '1.8rem', marginTop: '40px', marginBottom: '16px' }}>Localized Payouts: M-Pesa, Paystack, and Beyond</h3>
          <p style={{ marginBottom: '24px' }}>
            One of the biggest hurdles for creators in Africa and Latin America has been receiving payments from US-centric platforms. OnlyCrave solves this by integrating directly with <strong>M-Pesa, Mobile Money, Flutterwave, and Paystack</strong>. Whether you are in Kenya, Nigeria, or South Africa, you no longer have to wait weeks for bank transfers or deal with expensive middle-man services. We also fully support <strong>Crypto (BTC/USDT)</strong> for instant, borderless transactions.
          </p>

          <div className="glass-card" style={{ padding: '30px', margin: '40px 0' }}>
            <h4 style={{ marginTop: 0 }}>Integrated Creator Shop</h4>
            <p>
              Unlike {competitor.name}, which focuses primarily on subscriptions, OnlyCrave includes a built-in <strong>E-commerce Shop</strong>. Creators can sell physical merchandise, custom toys, or digital products directly from their profile. This multi-stream revenue approach allows you to diversify your income without needing third-party tools like Shopify or Etsy.
            </p>
          </div>

          <h3 style={{ fontSize: '1.8rem', marginTop: '40px', marginBottom: '16px' }}>Advanced Safety and 5-Minute KYC</h3>
          <p style={{ marginBottom: '24px' }}>
            Safety and compliance are at our core. OnlyCrave utilizes a state-of-the-art <strong>Age Verification System</strong> to protect our community and ensure that access is restricted to adults. While {competitor.name} often takes 24 to 72 hours to verify a new profile, our automated KYC process gets you verified and ready to post in just <strong>5 minutes</strong>.
          </p>

          <h3 style={{ fontSize: '1.8rem', marginTop: '40px', marginBottom: '16px' }}>A Platform for All Creative Niches</h3>
          <p style={{ marginBottom: '24px' }}>
            Whether you are a fitness coach, a digital artist, or an NSFW creator, OnlyCrave provides the tools you need. From <strong>Live Streaming</strong> and <strong>Video Calls</strong> to <strong>Private Messaging and Reels</strong>, the platform is designed for maximum engagement. We celebrate diversity and allow all content categories, including Kink, Alternative Interests, and AI-generated media.
          </p>

          <p style={{ marginBottom: '24px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
            Join over thousands of creators who have already made the switch. With lower fees, better support, and localized payment options, OnlyCrave is not just an alternative—it's an upgrade.
          </p>
        </section>

        {/* Final CTA */}
        <section style={{ textAlign: 'center', marginTop: '80px', padding: '60px', borderRadius: '40px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Start Your OnlyCrave Journey Today</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9 }}>Stop giving away 20% of your life's work. Join the 5% revolution.</p>
          <Link href="https://onlycrave.com/signup" style={{ 
            backgroundColor: '#fff', color: '#2563eb', padding: '18px 45px', borderRadius: '50px', 
            fontWeight: 900, fontSize: '1.1rem', textDecoration: 'none', display: 'inline-block',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}>Join the Crave
          </Link>
        </section>
      </main>
    </div>
  );
}

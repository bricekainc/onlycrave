import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const ONLYCRAVE_DATA = {
  name: 'OnlyCrave',
  fee: 'Less than 5%',
  kyc: '5 Minutes',
  rating: 4.9,
  payouts: ['BTC/USDT', 'M-Pesa', 'Mobile Money', 'PayPal', 'Paystack', 'Flutterwave', 'Bank Transfer'],
  features: ['Creator Shop (Toys/Merch)', 'Encrypted Privacy', 'Video & Audio Calls', 'Age Verification', 'Live Streaming', 'Instant KYC']
};

const competitorsData: Record<string, any> = {
  'onlyfans': { name: 'OnlyFans', fee: '20%', kyc: '24-72h', rating: 4.0, features: ['Standard Subs', 'PPV Messaging'] },
  'fansly': { name: 'Fansly', fee: '20%', kyc: '12-48h', rating: 4.4, features: ['Tiered Subs', 'Discovery'] },
  'loyalfans': { name: 'LoyalFans', fee: '20%', kyc: '24h+', rating: 4.1, features: ['Standard Tools'] }
};

export default function ComparisonPage() {
  const router = useRouter();
  const { competitor: slug } = router.query;
  if (!router.isReady) return null;

  const safeSlug = String(slug).toLowerCase();
  const competitor = competitorsData[safeSlug] || { 
    name: safeSlug.charAt(0).toUpperCase() + safeSlug.slice(1), 
    fee: '20%', kyc: '24h+', rating: 3.5, features: ['Standard Tools'] 
  };

  const glassStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  };

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <Head>
        <title>OnlyCrave vs {competitor.name} | Best Alternative 2026</title>
      </Head>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Hero */}
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '10px', letterSpacing: '-0.02em' }}>
            OnlyCrave <span style={{ color: '#444' }}>vs</span> {competitor.name}
          </h1>
          <p style={{ color: '#888', fontSize: '1.2rem' }}>Keep more of your money. Switch to the sub-5% fee platform.</p>
        </header>

        {/* Glass Comparison Table */}
        <div style={{ ...glassStyle, overflow: 'hidden', marginBottom: '60px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '20px' }}>Feature</th>
                <th style={{ padding: '20px', color: '#3b82f6' }}>OnlyCrave</th>
                <th style={{ padding: '20px', color: '#666' }}>{competitor.name}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Platform Fee', crave: ONLYCRAVE_DATA.fee, other: competitor.fee, highlight: true },
                { label: 'KYC Speed', crave: ONLYCRAVE_DATA.kyc, other: competitor.kyc },
                ...ONLYCRAVE_DATA.features.map(f => ({ label: f, crave: '✅', other: competitor.features.includes(f) ? '✅' : '❌' }))
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px 20px', color: '#aaa' }}>{row.label}</td>
                  <td style={{ padding: '15px 20px', fontWeight: row.highlight ? 800 : 400, color: row.highlight ? '#4ade80' : '#fff' }}>{row.crave}</td>
                  <td style={{ padding: '15px 20px', color: '#555' }}>{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA Card */}
        <div style={{ ...glassStyle, padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Join the Future of Content Creation</h2>
          <p style={{ color: '#aaa', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
            Supporting M-Pesa, Crypto, and Global Payouts. Get verified in 5 minutes and keep 95%+ of your revenue.
          </p>
          <Link href="https://onlycrave.com/signup" style={{ 
            backgroundColor: '#fff', color: '#000', padding: '16px 40px', borderRadius: '50px', 
            fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', transition: 'transform 0.2s' 
          }}>
            Start Earning Now
          </Link>
        </div>
      </div>
    </div>
  );
}

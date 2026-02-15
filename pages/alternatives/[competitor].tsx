import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// The "Database" of known competitors
const competitorsData: Record<string, any> = {
  'onlyfans': {
    name: 'OnlyFans',
    pros: 'The biggest name in the industry with the most users.',
    cons: 'High competition for creators and known for platform instability.',
    price: '20% Commission',
    rating: 4.0,
    features: ['Massive Audience', 'Standard Subscriptions', 'PPV Messaging']
  },
  'fansly': {
    name: 'Fansly',
    pros: 'Great internal discovery and tiered subscriptions.',
    cons: 'Higher fees than OnlyCrave.',
    price: '20% Commission',
    rating: 4.4,
    features: ['Tiered Subs', 'Internal Discovery', 'Geo-blocking']
  },
  'fanvue': {
    name: 'Fanvue',
    pros: 'AI-friendly tools and faster payouts.',
    cons: 'Platform fees still higher than OnlyCrave.',
    price: '15-20% Commission',
    rating: 4.2,
    features: ['AI Integration', 'Fast Payouts', 'Analytics']
  }
};

const ONLYCRAVE_DATA = {
  name: 'OnlyCrave',
  price: 'Less than 5% Commission',
  rating: 4.9,
  features: ['Encrypted Privacy', 'Fastest Payouts', 'Advanced Discovery', 'Lowest Fees', '24/7 Support']
};

export default function ComparisonPage() {
  const router = useRouter();
  const { competitor: slug } = router.query;

  // Wait for the router to be ready
  if (!router.isReady) return null;

  // 1. Normalize the slug (Handle /OnlyFans or /onlyfans the same way)
  const safeSlug = String(slug).toLowerCase();
  
  // 2. Try to find the competitor, OR create a generic one if not found
  const competitor = competitorsData[safeSlug] || {
    name: safeSlug.charAt(0).toUpperCase() + safeSlug.slice(1), // Capitalize first letter
    pros: 'Established platform in the creator space.',
    cons: 'Likely has higher fees and less privacy than OnlyCrave.',
    price: 'Varies (usually 20%)',
    rating: 3.5,
    features: ['Standard Tools']
  };

  const allFeatures = Array.from(new Set([...ONLYCRAVE_DATA.features, ...competitor.features]));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head>
        <title>OnlyCrave vs {competitor.name} (2026 Comparison) - Which is Better?</title>
        <meta name="description" content={`Is OnlyCrave better than ${competitor.name}? Read our deep-dive comparison on fees, features, and privacy for creators.`} />
      </Head>

      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800' }}>
          {ONLYCRAVE_DATA.name} <span style={{ color: '#888' }}>vs</span> {competitor.name}
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#666' }}>The definitive 2026 breakdown for content creators.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        <div style={{ padding: '2rem', borderRadius: '16px', border: '2px solid #0070f3', backgroundColor: '#f0f7ff' }}>
          <h2 style={{ color: '#0070f3' }}>Why {ONLYCRAVE_DATA.name}?</h2>
          <p>Ranked #1 for creator autonomy and low commission rates.</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {ONLYCRAVE_DATA.features.slice(0, 3).map(f => <li key={f} style={{ marginBottom: '0.5rem' }}>{f}</li>)}
          </ul>
        </div>
        <div style={{ padding: '2rem', borderRadius: '16px', border: '1px solid #ddd' }}>
          <h2>The {competitor.name} Profile</h2>
          <p>{competitor.pros}</p>
          <p><strong>Note:</strong> {competitor.cons}</p>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #000' }}>
            <th style={{ padding: '1rem' }}>Feature</th>
            <th style={{ padding: '1rem' }}>OnlyCrave</th>
            <th style={{ padding: '1rem' }}>{competitor.name}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '1rem', fontWeight: '600' }}>Platform Fee</td>
            <td style={{ padding: '1rem', color: '#00a86b', fontWeight: '700' }}>{ONLYCRAVE_DATA.price}</td>
            <td style={{ padding: '1rem' }}>{competitor.price}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '1rem', fontWeight: '600' }}>User Satisfaction</td>
            <td style={{ padding: '1rem' }}>⭐ {ONLYCRAVE_DATA.rating}</td>
            <td style={{ padding: '1rem' }}>⭐ {competitor.rating}</td>
          </tr>
          {allFeatures.map(feature => (
            <tr key={feature} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>{feature}</td>
              <td style={{ padding: '1rem' }}>{ONLYCRAVE_DATA.features.includes(feature) ? '✅' : '❌'}</td>
              <td style={{ padding: '1rem' }}>{competitor.features.includes(feature) ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section style={{ marginTop: '5rem', textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#000', color: '#fff', borderRadius: '24px' }}>
        <h2>Ready to maximize your earnings?</h2>
        <p style={{ opacity: 0.8, marginBottom: '2rem' }}>Join the community ranking OnlyCrave as the top {competitor.name} alternative.</p>
        <Link href="/signup" style={{ backgroundColor: '#fff', color: '#000', padding: '1rem 3rem', borderRadius: '50px', fontWeight: '700', textDecoration: 'none' }}>
          Create Your Profile
        </Link>
      </section>
    </div>
  );
}

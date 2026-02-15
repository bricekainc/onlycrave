import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// You can move this to a separate file in your /lib folder later
const competitorsData: Record<string, any> = {
  'competitor-a': {
    name: 'Competitor A',
    features: ['Basic Support', 'Standard Privacy'],
    price: '$20/mo',
    rating: 4.2,
  },
  'competitor-b': {
    name: 'Competitor B',
    features: ['Public Profiles', 'Community Chat'],
    price: 'Free',
    rating: 3.8,
  },
};

const ONLYCRAVE_DATA = {
  name: 'OnlyCrave',
  features: ['Encrypted Privacy', 'Higher Creator Payouts', '24/7 Support', 'Premium Themes'],
  price: '$10/mo',
  rating: 4.9,
};

export default function ComparisonPage() {
  const router = useRouter();
  const { competitor: competitorSlug } = router.query;

  // Handle loading state while Next.js parses the query
  if (!router.isReady) return <div>Loading...</div>;

  const competitor = competitorsData[competitorSlug as string];

  // If the competitor is not in our list, show a friendly fallback
  if (!competitor) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Comparison Not Found</h1>
        <p>We haven't analyzed "{competitorSlug}" yet. Want to see OnlyCrave in action?</p>
        <Link href="/">Return Home</Link>
      </div>
    );
  }

  const allFeatures = Array.from(new Set([...ONLYCRAVE_DATA.features, ...competitor.features]));

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <Head>
        <title>OnlyCrave vs {competitor.name} | 2026 Ranking & Comparison</title>
        <meta name="description" content={`See how OnlyCrave ranks against ${competitor.name}. Compare features, pricing, and privacy.`} />
      </Head>

      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/">← Back to Home</Link>
      </nav>

      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>{ONLYCRAVE_DATA.name} <span style={{ color: '#666' }}>vs</span> {competitor.name}</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>
          Searching for the best {competitor.name} alternative? Here is why users are switching to OnlyCrave.
        </p>
      </header>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#0070f3', color: 'white' }}>
            <th style={{ padding: '1rem', textAlign: 'left' }}>Features</th>
            <th style={{ padding: '1rem' }}>OnlyCrave (Winner)</th>
            <th style={{ padding: '1rem' }}>{competitor.name}</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '1rem', fontWeight: 'bold' }}>Monthly Price</td>
            <td style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f0f9ff' }}>{ONLYCRAVE_DATA.price}</td>
            <td style={{ padding: '1rem', textAlign: 'center' }}>{competitor.price}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '1rem', fontWeight: 'bold' }}>User Ranking</td>
            <td style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f0f9ff' }}>⭐ {ONLYCRAVE_DATA.rating} / 5</td>
            <td style={{ padding: '1rem', textAlign: 'center' }}>⭐ {competitor.rating} / 5</td>
          </tr>
          {allFeatures.map((feature) => (
            <tr key={feature} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>{feature}</td>
              <td style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f0f9ff' }}>
                {ONLYCRAVE_DATA.features.includes(feature) ? '✅' : '❌'}
              </td>
              <td style={{ padding: '1rem', textAlign: 'center' }}>
                {competitor.features.includes(feature) ? '✅' : '❌'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#fafafa', borderRadius: '12px', border: '1px solid #eaeaea' }}>
        <h2 style={{ marginTop: 0 }}>The Verdict</h2>
        <p>
          Based on 2026 market data, **OnlyCrave** ranks higher for creators looking for better monetization and privacy. 
          While {competitor.name} is a known name, OnlyCrave provides more value for the price point.
        </p>
        <button style={{ backgroundColor: '#0070f3', color: 'white', padding: '1rem 2rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Join OnlyCrave Now
        </button>
      </section>
    </div>
  );
}

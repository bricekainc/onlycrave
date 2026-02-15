import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

// Detailed data for known competitors
const competitorsData: Record<string, any> = {
  'onlyfans': {
    name: 'OnlyFans',
    fee: '20%',
    kyc: '24-72 Hours',
    payouts: 'Bank, Paxum',
    pros: 'Massive brand name and large existing user base.',
    cons: 'High fees (20%), slow KYC, and limited payout options for African creators.',
    rating: 4.0,
    features: ['Standard Subscriptions', 'PPV Messaging', 'Live Streaming']
  },
  'fansly': {
    name: 'Fansly',
    fee: '20%',
    kyc: '12-48 Hours',
    payouts: 'Bank, Crypto, Paxum',
    pros: 'Excellent internal discovery and tiered subscription models.',
    cons: 'Platform fee is 4x higher than OnlyCrave.',
    rating: 4.4,
    features: ['Tiered Subs', 'Internal Discovery', 'Geo-blocking', 'Live Streaming']
  },
  'fanvue': {
    name: 'Fanvue',
    fee: '15-20%',
    kyc: '12-24 Hours',
    payouts: 'Bank, Crypto',
    pros: 'AI-friendly tools and a modern interface.',
    cons: 'Fees are still significantly higher than OnlyCrave.',
    rating: 4.2,
    features: ['AI Integration', 'Fast Payouts', 'Analytics', 'CRM Tools']
  }
};

const ONLYCRAVE_DATA = {
  name: 'OnlyCrave',
  fee: 'Less than 5%',
  kyc: '5 Minutes',
  rating: 4.9,
  payouts: ['BTC/USDT', 'M-Pesa', 'Mobile Money', 'PayPal', 'Paystack', 'Flutterwave', 'Bank Transfer'],
  features: [
    'Creator Shop (Toys/Merch/Customs)',
    'Encrypted Privacy',
    'AI & Synthetic Media Friendly',
    'Video & Audio Calls',
    'Age Verification System',
    'Live Streaming',
    'Instant KYC'
  ]
};

export default function ComparisonPage() {
  const router = useRouter();
  const { competitor: slug } = router.query;

  if (!router.isReady) return null;

  const safeSlug = String(slug).toLowerCase();
  
  // Dynamic fallback for any slug not in our hardcoded list
  const competitor = competitorsData[safeSlug] || {
    name: safeSlug.charAt(0).toUpperCase() + safeSlug.slice(1),
    fee: '20%',
    kyc: '24+ Hours',
    payouts: 'Standard Bank/Card',
    pros: 'Established platform in the creator space.',
    cons: 'Higher fees and restricted payment options compared to OnlyCrave.',
    rating: 3.5,
    features: ['Standard Tools', 'Subscriptions']
  };

  const allFeatures = Array.from(new Set([...ONLYCRAVE_DATA.features, ...competitor.features]));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
      <Head>
        <title>OnlyCrave vs {competitor.name} (2026) - Best {competitor.name} Alternative</title>
        <meta name="description" content={`Compare OnlyCrave vs ${competitor.name}. OnlyCrave offers < 5% fees, 5-minute KYC, and M-Pesa/Crypto payouts. The best alternative for global creators.`} />
      </Head>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <header className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
            2026 Platform Comparison
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
            {ONLYCRAVE_DATA.name} <span className="text-zinc-600">vs</span> {competitor.name}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Switch to the platform that respects your earnings. OnlyCrave takes <strong>{ONLYCRAVE_DATA.fee}</strong> while {competitor.name} takes <strong>{competitor.fee}</strong>.
          </p>
        </header>

        {/* Value Prop Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-3xl bg-blue-600/5 border border-blue-500/20 shadow-2xl shadow-blue-500/5">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 italic">The OnlyCrave Advantage</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span><strong>Massive Payout Choice:</strong> M-Pesa, Paystack, Flutterwave, and Crypto.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span><strong>Integrated Shop:</strong> Sell toys, physical merch, or custom videos directly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">✓</span>
                <span><strong>Rapid Onboarding:</strong> Get verified and live in under 5 minutes.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800">
            <h2 className="text-2xl font-bold text-zinc-400 mb-4 italic">The {competitor.name} Reality</h2>
            <p className="text-zinc-300 mb-4">{competitor.pros}</p>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-200/80 text-sm">
              <strong>Downside:</strong> {competitor.cons}
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm mb-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-800/50 border-b border-zinc-700">
                <th className="p-6 text-sm font-semibold uppercase tracking-wider text-zinc-400">Feature</th>
                <th className="p-6 text-sm font-bold uppercase tracking-wider text-blue-400">OnlyCrave</th>
                <th className="p-6 text-sm font-semibold uppercase tracking-wider text-zinc-500">{competitor.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              <tr>
                <td className="p-6 font-medium text-zinc-300">Platform Fee</td>
                <td className="p-6 text-green-400 font-black text-lg">{ONLYCRAVE_DATA.fee}</td>
                <td className="p-6 text-zinc-500">{competitor.fee}</td>
              </tr>
              <tr>
                <td className="p-6 font-medium text-zinc-300">KYC Verification</td>
                <td className="p-6 text-zinc-100">{ONLYCRAVE_DATA.kyc}</td>
                <td className="p-6 text-zinc-500">{competitor.kyc}</td>
              </tr>
              {allFeatures.map(feature => (
                <tr key={feature} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="p-6 text-zinc-400">{feature}</td>
                  <td className="p-6">{ONLYCRAVE_DATA.features.includes(feature) ? '✅' : '—'}</td>
                  <td className="p-6">{competitor.features.includes(feature) ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Call to Action */}
        <section className="text-center py-20 px-8 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-500/20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to maximize your earnings?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-xl mx-auto opacity-90">
            Join the creators switching to OnlyCrave for the best local payout support and the lowest fees in the industry.
          </p>
          <Link 
            href="https://onlycrave.com/signup" 
            className="inline-block bg-white text-blue-600 px-10 py-5 rounded-full font-black text-xl hover:bg-zinc-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl"
          >Create Your Profile Now
          </Link>
        </section>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCreators } from '../lib/getCreators';

export async function getStaticProps() {
  try {
    const creators = await getCreators();
    return { props: { creators: creators || [] }, revalidate: 60 };
  } catch (error) {
    return { props: { creators: [] }, revalidate: 60 };
  }
}

export default function Home({ creators }: { creators: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingCreator, setLoadingCreator] = useState('');
  
  // Earnings Simulator State
  const [followers, setFollowers] = useState(1000);
  const [subPrice, setSubPrice] = useState(5);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);

  useEffect(() => {
    // Logic: 5% conversion rate, 88% payout (after platform/processor fees)
    const calc = (followers * 0.05) * subPrice * 0.88;
    setEstimatedEarnings(calc);
  }, [followers, subPrice]);

  const filteredCreators = creators.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (username: string) => {
    setLoadingCreator(username);
    setTimeout(() => { router.push(`/${username}`); }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-pink-500/40">
      <Head>
        <title>OnlyCrave | Official Search & Creator Monetization Hub</title>
        <meta name="description" content="The premier subscription platform for exclusive content. Support creators via M-Pesa, Crypto, and PayPal. 95% revenue share for creators." />
        <meta name="keywords" content="OnlyCrave search, OnlyFans alternative M-Pesa, earn from content, creator economy, crypto subscriptions" />
      </Head>

      {/* --- FUTURISTIC NAV --- */}
      <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black italic tracking-tighter">
            <span className="text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">ONLY</span>
            <span className="text-cyan-400">CRAVE</span>
          </div>
          <div className="hidden md:flex gap-6 text-xs font-bold tracking-widest uppercase italic">
            <Link href="/explore" className="hover:text-pink-500 transition">Explore</Link>
            <Link href="https://onlycrave.com/login" className="hover:text-pink-500 transition">Login</Link>
            <Link href="https://onlycrave.com/signup" className="bg-pink-600 px-4 py-2 rounded-lg hover:bg-pink-700 transition">Join Now</Link>
          </div>
        </div>
      </nav>

      {/* --- HERO & SEARCH --- */}
      <header className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-pink-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
            Monetize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">Content</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Creators deserve to own their revenue. Join the premier platform for exclusive content, digital products, and authentic fan engagement.
          </p>

          <div className="relative max-w-xl mx-auto mb-4">
            <input 
              type="text"
              placeholder="Search @username or creator name..."
              className="w-full bg-zinc-900/50 border border-white/10 px-8 py-5 rounded-2xl outline-none focus:border-pink-500/50 transition-all text-lg backdrop-blur-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex justify-center gap-4 opacity-60">
            <span className="text-[10px] font-bold tracking-widest uppercase">Verified Hubs: {creators.length}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-green-500">Payouts: $5M+</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* --- CREATOR RESULTS --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
          {filteredCreators.map((c) => (
            <div key={c.username} className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-pink-500/40 transition-all group">
              <img src={c.avatar} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 border-2 border-white/5" alt={c.name} />
              <h2 className="text-center font-bold italic uppercase tracking-tighter">{c.name}</h2>
              <p className="text-center text-pink-500 text-xs font-black mb-6 italic tracking-widest">@{c.username}</p>
              <button 
                onClick={() => handleAction(c.username)}
                className="w-full bg-white text-black text-[10px] font-black py-4 rounded-xl uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all shadow-xl"
              >
                {loadingCreator === c.username ? "AUTHENTICATING..." : "VIEW EXCLUSIVE MIRROR"}
              </button>
            </div>
          ))}
        </section>

        {/* --- EARNINGS SIMULATOR --- */}
        <section className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-[3rem] p-8 md:p-16 mb-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 font-black italic uppercase">Calculator</div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Creator Earnings Simulator</h2>
              <p className="text-zinc-400 mb-8">Calculate how much you can earn based on followers and subscription rates.</p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-4 text-pink-500">Followers: {followers.toLocaleString()}</label>
                  <input type="range" min="1000" max="1000000" step="1000" value={followers} onChange={(e) => setFollowers(parseInt(e.target.value))} className="w-full accent-pink-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-4 text-cyan-400">Monthly Price: ${subPrice}</label>
                  <input type="range" min="1" max="100" step="1" value={subPrice} onChange={(e) => setSubPrice(parseInt(e.target.value))} className="w-full accent-cyan-400" />
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-[2rem] p-10 text-center border border-white/10 backdrop-blur-md">
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-2 text-zinc-500">Estimated Revenue</p>
              <h3 className="text-6xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
                ${estimatedEarnings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              <p className="text-xs text-zinc-500 mt-4 italic">* Based on 5% subscriber conversion and 12% platform/processing fee.</p>
              <Link href="https://onlycrave.com/signup" className="inline-block mt-8 bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-xl font-black italic uppercase tracking-widest transition-all">Start Earning</Link>
            </div>
          </div>
        </section>

        {/* --- COMPARISON TABLE --- */}
        <section className="mb-32">
            <h2 className="text-center text-4xl font-black italic uppercase mb-12">The Creator Revolution</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-zinc-900/30 rounded-[2rem] overflow-hidden">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="p-6 font-black italic uppercase">Feature</th>
                            <th className="p-6 font-black italic uppercase text-pink-500">OnlyCrave</th>
                            <th className="p-6 font-black italic uppercase opacity-40">Others (OF/Fansly)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <tr>
                            <td className="p-6 font-bold uppercase text-xs">Platform Fee</td>
                            <td className="p-6 font-black text-green-500">5% - 12%</td>
                            <td className="p-6 opacity-40">20%</td>
                        </tr>
                        <tr>
                            <td className="p-6 font-bold uppercase text-xs">Payment Methods</td>
                            <td className="p-6 text-cyan-400 font-bold">M-Pesa, Crypto, PayPal, Cards</td>
                            <td className="p-6 opacity-40">Credit Cards Only</td>
                        </tr>
                        <tr>
                            <td className="p-6 font-bold uppercase text-xs">Privacy</td>
                            <td className="p-6">Geofencing & Discreet Billing</td>
                            <td className="p-6 opacity-40">Standard</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        {/* --- FAQ SECTION --- */}
        <section className="grid md:grid-cols-2 gap-12 mb-32">
          <div>
            <h3 className="text-2xl font-black italic uppercase text-pink-500 mb-6">For Creators</h3>
            <div className="space-y-4">
              <details className="group bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer">
                <summary className="font-bold list-none flex justify-between uppercase text-xs tracking-widest">How much do I keep? <span className="text-pink-500">+</span></summary>
                <p className="pt-4 text-zinc-400 text-sm leading-relaxed">OnlyCrave takes an industry-low flat fee. You earn up to 95% on subscriptions, tips, and PPV. We believe creators should keep their profits.</p>
              </details>
              <details className="group bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer">
                <summary className="font-bold list-none flex justify-between uppercase text-xs tracking-widest">Payout Methods? <span className="text-pink-500">+</span></summary>
                <p className="pt-4 text-zinc-400 text-sm leading-relaxed">Withdraw via Bank Transfer, Mobile Money (M-Pesa), or Crypto (BTC/USDT). Processed in 3-5 business days.</p>
              </details>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black italic uppercase text-cyan-400 mb-6">For Fans</h3>
            <div className="space-y-4">
              <details className="group bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer">
                <summary className="font-bold list-none flex justify-between uppercase text-xs tracking-widest">Is my data safe? <span className="text-cyan-400">+</span></summary>
                <p className="pt-4 text-zinc-400 text-sm leading-relaxed">We use 256-bit SSL encryption and PCI-compliant gateways. We never store your full card details.</p>
              </details>
              <details className="group bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer">
                <summary className="font-bold list-none flex justify-between uppercase text-xs tracking-widest">Discreet Billing? <span className="text-cyan-400">+</span></summary>
                <p className="pt-4 text-zinc-400 text-sm leading-relaxed">Transactions appear under neutral names. For 100% anonymity, use Cryptocurrency.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* --- FUTURISTIC FOOTER --- */}
      <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-black italic uppercase mb-6">OnlyCrave</div>
            <p className="text-zinc-500 text-sm leading-relaxed">The global creator revolution. Empowering icons since day one.</p>
          </div>
          <div>
            <h4 className="font-black italic uppercase text-[10px] tracking-[0.3em] mb-6 text-zinc-400">Legal</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="https://onlycrave.com/p/policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="https://onlycrave.com/p/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="https://onlycrave.com/p/refund" className="hover:text-white transition">Refunds</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black italic uppercase text-[10px] tracking-[0.3em] mb-6 text-zinc-400">Categories</h4>
            <ul className="space-y-4 text-sm text-zinc-500 uppercase font-bold text-[10px]">
              <li>Fitness & Wellness</li>
              <li>AI & Synthetic</li>
              <li>Music & ASMR</li>
              <li>Kink & Alternative</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black italic uppercase text-[10px] tracking-[0.3em] mb-6 text-zinc-400">Links</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link href="https://onlycrave.com/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="https://onlycrave.com/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="https://onlycrave.com/affiliate" className="hover:text-white transition">Affiliate Program</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-zinc-700 text-[10px] font-black tracking-widest uppercase">
          © {new Date().getFullYear()} OnlyCrave. All Rights Reserved.
        </div>
      </footer>

      <style jsx global>{`
        input[type='range'] {
          -webkit-appearance: none;
          background: rgba(255,255,255,0.1);
          height: 4px;
          border-radius: 2px;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ec4899;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(236,72,153,0.5);
        }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
      `}</style>
    </div>
  );
}

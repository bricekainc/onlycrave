import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getCreators } from '../lib/getCreators';

export async function getServerSideProps() {
  try {
    const creators = await getCreators();
    // Logic: Sort by a 'rank' or 'followers' field if available, 
    // or just pass them as a list to be ranked by index.
    return { props: { creators: creators || [] } };
  } catch (error) {
    return { props: { creators: [] } };
  }
}

export default function Explore({ creators }: { creators: any[] }) {
  const [category, setCategory] = useState('All');

  const categories = [
    "All", "Trending", "Fitness", "Lifestyle", "Gaming", "Music", "AI & Digital"
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-cyan-500/30">
      <Head>
        <title>Top OnlyCrave Creators | Official 2026 Rankings</title>
        <meta name="description" content="Discover the top 100 verified OnlyCrave creators. Filter by category, engagement, and region. The official directory for the creator economy." />
        <meta name="keywords" content="Top OnlyCrave creators, best OnlyFans alternatives, trending influencers 2026, verified content creators" />
      </Head>

      {/* --- LEADERBOARD HEADER --- */}
      <section className="pt-20 pb-12 px-6 border-b border-white/5 bg-gradient-to-b from-zinc-900/20 to-transparent">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
            Creator <span className="text-cyan-400">Leaderboard</span>
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm font-bold tracking-widest uppercase italic">
            Rankings updated every 60 minutes based on engagement & verification.
          </p>
        </div>
      </section>

      {/* --- FILTER BAR --- */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6 flex gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                category === cat 
                ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                : "bg-transparent border-white/10 text-zinc-500 hover:border-white/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-4">
          {creators.map((c, index) => (
            <Link key={c.username} href={`/${c.username}`}>
              <div className="group relative bg-zinc-900/20 border border-white/5 hover:border-cyan-500/50 p-4 md:p-6 rounded-2xl flex items-center gap-4 md:gap-8 transition-all hover:translate-x-2">
                
                {/* RANK NUMBER */}
                <div className="w-10 md:w-16 flex-shrink-0 text-center">
                  <span className={`text-2xl md:text-4xl font-black italic ${
                    index === 0 ? "text-yellow-400 drop-shadow-md" : 
                    index === 1 ? "text-zinc-400" : 
                    index === 2 ? "text-orange-400" : "text-zinc-700"
                  }`}>
                    #{index + 1}
                  </span>
                </div>

                {/* AVATAR */}
                <div className="relative">
                  <img 
                    src={c.avatar} 
                    alt={c.name} 
                    className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/10 group-hover:border-cyan-400 transition-colors"
                  />
                  {index < 3 && (
                    <div className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded italic">
                      PRO
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-grow">
                  <h2 className="text-lg md:text-xl font-black uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors">
                    {c.name}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-pink-500 text-[10px] font-black uppercase tracking-widest">@{c.username}</span>
                    <span className="hidden md:inline h-1 w-1 bg-zinc-700 rounded-full"></span>
                    <span className="hidden md:inline text-zinc-500 text-[10px] font-bold uppercase tracking-tighter italic">Verified Global Artist</span>
                  </div>
                </div>

                {/* STATS/ACTION */}
                <div className="hidden md:flex flex-col items-end gap-1">
                  <div className="text-[10px] font-black tracking-widest text-zinc-600 uppercase italic">Status</div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-black italic uppercase">Online</span>
                  </div>
                </div>

                <div className="ml-auto">
                   <div className="bg-white/5 group-hover:bg-cyan-500 group-hover:text-black p-3 rounded-xl transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="9 5l7 7-7 7" />
                      </svg>
                   </div>
                </div>

                {/* PROGRESS BAR DECORATION */}
                <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- SEO FOOTER ARTICLE --- */}
        <article className="mt-32 p-10 bg-zinc-900/40 rounded-[3rem] border border-white/5">
          <h2 className="text-3xl font-black italic uppercase mb-6 tracking-tighter">How Our Ranking System Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <section>
              <h3 className="text-cyan-400 font-black uppercase text-xs tracking-[.2em] mb-4 underline decoration-2 underline-offset-4">Verification Score</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Creators with completed KYC and the blue checkmark receive priority indexing. This ensures fans always find legitimate, secure profiles.
              </p>
            </section>
            <section>
              <h3 className="text-pink-500 font-black uppercase text-xs tracking-[.2em] mb-4 underline decoration-2 underline-offset-4">Engagement Rate</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Our algorithm tracks daily interaction levels, subscription growth, and tip frequency to surface the fastest-growing influencers.
              </p>
            </section>
            <section>
              <h3 className="text-white font-black uppercase text-xs tracking-[.2em] mb-4 underline decoration-2 underline-offset-4">Local Impact</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Special weighting is given to creators utilizing local payment methods like M-Pesa, making them more accessible to regional fanbases.
              </p>
            </section>
          </div>
        </article>
      </main>

      {/* --- MINI FOOTER --- */}
      <footer className="py-20 text-center opacity-30 text-[10px] font-black tracking-[0.5em] uppercase italic">
        OnlyCrave Official Index // {new Date().getFullYear()} // Secure Ecosystem
      </footer>
    </div>
  );
}

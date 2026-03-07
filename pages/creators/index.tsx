import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Parser from 'rss-parser';

export async function getStaticProps() {
  const parser = new Parser();
  let creators: any[] = [];

  const googleFeeds = [
    'https://www.google.com/alerts/feeds/01441943357185983502/10271601532123878621',
    'https://www.google.com/alerts/feeds/01441943357185983502/9761647876109762227',
    'https://www.google.com/alerts/feeds/01441943357185983502/13120870724569043521',
    'https://www.google.com/alerts/feeds/01441943357185983502/15721545087151547856',
    'https://www.google.com/alerts/feeds/01441943357185983502/4153531990675198701',
    'https://www.google.com/alerts/feeds/01441943357185983502/14140302812017746122',
    'https://www.google.com/alerts/feeds/01441943357185983502/7146660539207966665',
    'https://www.google.com/alerts/feeds/01441943357185983502/12893446076237304652',
    'https://www.google.com/alerts/feeds/01441943357185983502/6907578491817998773',
    'https://www.google.com/alerts/feeds/01441943357185983502/7654207322957982057'
  ];

  const googleResults = await Promise.allSettled(googleFeeds.map(url => parser.parseURL(url)));

  googleResults.forEach(result => {
    if (result.status === 'fulfilled') {
      const items = result.value.items.map(item => {
        const cleanName = (item.title || 'Verified Creator').replace(/<\/?[^>]+(>|$)/g, "");
        return {
          name: cleanName,
          slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          username: 'Verified Network',
          avatar: 'https://raw.githubusercontent.com/bricekainc/onlycrave/main/lib/favicon.ico',
          isFallback: true
        };
      });
      creators = [...creators, ...items];
    }
  });

  try {
    const res = await fetch('https://onlycrave.com/rss/creators/feed');
    if (res.ok) {
      const internalData = await res.json();
      const formattedInternal = internalData.map((c: any) => ({
        name: c.name,
        slug: c.username.toLowerCase(),
        username: c.username,
        avatar: c.avatar || 'https://raw.githubusercontent.com/bricekainc/onlycrave/main/lib/favicon.ico',
        isFallback: false
      }));
      creators = [...creators, ...formattedInternal];
    }
  } catch (e) { console.error("Internal Feed Failed"); }

  const uniqueCreators = Array.from(new Map(creators.map(item => [item.slug, item])).values());

  return {
    props: { creators: uniqueCreators },
    revalidate: 86400 // Cache for 24 hours (86400 seconds)
  };
}

export default function CreatorsPage({ creators }: { creators: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [promptCreator, setPromptCreator] = useState<string | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Logic for 30-second hover prompt
  const handleMouseEnter = (slug: string) => {
    hoverTimer.current = setTimeout(() => {
      setPromptCreator(slug);
    }, 30000); // 30 seconds
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const triggerTransition = (slug: string) => {
    setPromptCreator(null);
    setIsProcessing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        clearInterval(interval);
        router.push(`/creators/${slug}`);
      }
      setLoadingProgress(Math.min(progress, 100));
    }, 200);
  };

  const filtered = creators.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="skeuo-container">
      <Head>
        <title>Verified Creators | OnlyCrave 2026 Directory</title>
        <meta name="description" content="High-end, verified creator directory for the OnlyCrave editorial network." />
      </Head>

      {/* Glossy Top Loading Bar */}
      {isProcessing && (
        <div className="loading-bar-wrapper">
          <div className="loading-bar-fill" style={{ width: `${loadingProgress}%` }}></div>
          <div className="loading-text">ESTABLISHING SECURE CONNECTION... {Math.round(loadingProgress)}%</div>
        </div>
      )}

      {/* 30-Second Hover Modal */}
      {promptCreator && (
        <div className="prompt-overlay">
          <div className="skeuo-modal">
            <h3>View Profile?</h3>
            <p>You've been interested in this creator for a while.</p>
            <div className="modal-actions">
              <button onClick={() => triggerTransition(promptCreator)} className="btn-yes">YES</button>
              <button onClick={() => setPromptCreator(null)} className="btn-no">NO</button>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <header className="skeuo-header">
          <h1 className="title-emboss">Verified Creators</h1>
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Search 2026 Network..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="skeuo-input"
            />
          </div>
        </header>

        <div className="creator-grid">
          {filtered.map((creator, i) => (
            <div 
              key={i} 
              className="skeuo-card"
              onMouseEnter={() => handleMouseEnter(creator.slug)}
              onMouseLeave={handleMouseLeave}
              onClick={() => triggerTransition(creator.slug)}
            >
              <div className="avatar-well">
                <img src={creator.avatar} alt="" className="avatar-img" />
              </div>
              <div className="card-info">
                <div className="creator-name">{creator.name}</div>
                <div className="badge-glass">VERIFIED</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body { 
          background: #0f1012; 
          color: #e0e0e0; 
          font-family: 'Inter', sans-serif;
          margin: 0; overflow-x: hidden;
        }

        .skeuo-container { min-height: 100vh; padding: 40px 20px; }

        /* Skeuomorphic Elements */
        .skeuo-card {
          background: linear-gradient(145deg, #1a1c1f, #141518);
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 10px 10px 20px #08090a, -5px -5px 15px #1c1e22;
          border-radius: 28px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .skeuo-card:active {
          box-shadow: inset 5px 5px 10px #08090a, inset -5px -5px 10px #1c1e22;
          transform: scale(0.98);
        }

        .avatar-well {
          width: 64px; height: 64px;
          border-radius: 20px;
          background: #0f1012;
          box-shadow: inset 3px 3px 6px #08090a, inset -3px -3px 6px #1c1e22;
          padding: 4px;
        }

        .avatar-img { width: 100%; height: 100%; border-radius: 16px; object-fit: cover; }

        .title-emboss {
          font-size: 3.5rem; font-weight: 900; color: #1a1c1f;
          text-shadow: 1px 1px 1px rgba(255,255,255,0.1), -1px -1px 1px rgba(0,0,0,0.5);
          text-align: center; margin-bottom: 40px;
        }

        .skeuo-input {
          width: 100%; padding: 20px 30px; border-radius: 50px;
          background: #0f1012; border: none; color: #fff;
          box-shadow: inset 6px 6px 12px #08090a, inset -6px -6px 12px #1c1e22;
          outline: none; font-size: 1rem;
        }

        /* Loading Bar Styles */
        .loading-bar-wrapper {
          position: fixed; top: 0; left: 0; width: 100%; height: 4px;
          background: #000; z-index: 1000;
        }
        .loading-bar-fill {
          height: 100%; background: #2ddfff;
          box-shadow: 0 0 15px #2ddfff; transition: width 0.3s ease;
        }
        .loading-text {
          position: fixed; top: 10px; right: 20px; font-size: 10px;
          letter-spacing: 2px; color: #2ddfff; font-weight: 800;
        }

        /* Modal Styles */
        .prompt-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justifyContent: center; z-index: 1100;
          backdrop-filter: blur(10px);
        }
        .skeuo-modal {
          background: #141518; padding: 40px; border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.1); text-align: center;
          box-shadow: 20px 20px 60px #000;
        }
        .btn-yes, .btn-no {
          padding: 15px 40px; border-radius: 20px; border: none;
          font-weight: 900; margin: 10px; cursor: pointer; transition: 0.2s;
        }
        .btn-yes { background: #2ddfff; color: #000; }
        .btn-no { background: #1a1c1f; color: #fff; box-shadow: 4px 4px 10px #000; }

        .creator-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px; max-width: 1200px; margin: 0 auto;
        }
      `}</style>
    </div>
  );
}

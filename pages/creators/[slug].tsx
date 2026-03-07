import { useRouter } from 'next/router';
import Head from 'next/head';
import Parser from 'rss-parser';

const GOOGLE_FEEDS = [
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

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Converts 'john-doe' back to 'John Doe' for the generic view
const formatSlugToName = (slug: string) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }: any) {
  const parser = new Parser();
  const targetSlug = params.slug || 'creator';

  try {
    const results = await Promise.allSettled(GOOGLE_FEEDS.map(url => parser.parseURL(url)));
    let foundCreator = null;

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const item = result.value.items.find(i => generateSlug(i.title || '') === targetSlug);
        if (item) {
          foundCreator = {
            name: (item.title || '').replace(/<\/?[^>]+(>|$)/g, ""),
            content: (item.contentSnippet || "Verified 2026 Network Creator").replace(/<\/?[^>]+(>|$)/g, ""),
            isGeneric: false
          };
          break;
        }
      }
    }

    // FALLBACK: If not found in RSS, create a generic entry instead of returning 404
    if (!foundCreator) {
      foundCreator = {
        name: formatSlugToName(targetSlug),
        content: "This creator is part of the OnlyCrave global network. Secure your access to their latest verified 2026 updates.",
        isGeneric: true
      };
    }

    return {
      props: { creator: foundCreator },
      revalidate: 3600
    };
  } catch (e) {
    // Ultimate safety fallback
    return {
      props: {
        creator: {
          name: formatSlugToName(targetSlug),
          content: "Verified Network Profile",
          isGeneric: true
        }
      }
    };
  }
}

export default function CreatorProfile({ creator }: any) {
  const router = useRouter();

  if (router.isFallback || !creator) {
    return (
      <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ letterSpacing: '2px', fontSize: '0.8rem' }}>SYNCING NETWORK...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      <Head>
        <title>{creator.name} - Profile | OnlyCrave | Coomer.st | Coomer.su | OnlyFans leaks | Fansly Leaks | Patreon Leaks | Kemono.cr party</title>
        <meta name="description" content={`Official 2026 profile for ${creator.name} on OnlyCrave.`} />
      </Head>

      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '50px 40px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '35px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Glow Effect for High-End Look */}
        <div style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: 'rgba(45, 223, 255, 0.05)', filter: 'blur(50px)', borderRadius: '100%' }}></div>

        <div style={{ width: '90px', height: '90px', background: 'linear-gradient(135deg, #111 0%, #222 100%)', borderRadius: '25px', margin: '0 auto 25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid #222', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          {creator.isGeneric ? '🛡️' : '⭐'}
        </div>
        
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '15px', letterSpacing: '-1.5px', background: 'linear-gradient(to bottom, #fff, #888)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {creator.name}
        </h1>
        
        <div style={{ display: 'inline-block', padding: '5px 15px', borderRadius: '100px', background: 'rgba(45, 223, 255, 0.1)', color: '#2ddfff', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '25px' }}>
          VERIFIED 2026
        </div>

        <p style={{ color: '#666', marginBottom: '40px', lineHeight: '1.7', fontSize: '1rem', fontWeight: 400 }}>
          {creator.content}
        </p>
        
        <a 
          href="https://onlycrave.com/creators/" 
          style={{ 
            display: 'block', 
            width: '100%', 
            padding: '22px', 
            background: '#2ddfff', 
            color: '#000', 
            borderRadius: '18px', 
            fontWeight: 900, 
            textDecoration: 'none', 
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fontSize: '1rem',
            boxShadow: '0 15px 30px rgba(45, 223, 255, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(45, 223, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(45, 223, 255, 0.2)';
          }}
        >
          VIEW FULL PROFILE
        </a>
        
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => router.push('/creators')}
            style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}
          >
            ← Directory Home
          </button>
        </div>
      </div>
    </div>
  );
}

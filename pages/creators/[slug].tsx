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

// Helper to ensure slugs are identical to the index page
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace emojis/special chars with hyphens
    .replace(/(^-|-$)/g, '');    // Remove leading/trailing hyphens
};

export async function getStaticPaths() {
  // We return an empty paths array with 'blocking' 
  // This saves build time and generates pages on-demand
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }: any) {
  const parser = new Parser();
  const targetSlug = params.slug;

  try {
    // Search through all feeds for the matching creator
    const results = await Promise.allSettled(GOOGLE_FEEDS.map(url => parser.parseURL(url)));
    
    let foundCreator = null;

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const item = result.value.items.find(i => generateSlug(i.title || '') === targetSlug);
        if (item) {
          foundCreator = {
            name: (item.title || 'Verified Creator').replace(/<\/?[^>]+(>|$)/g, ""),
            content: (item.contentSnippet || "Verified Network Creator").replace(/<\/?[^>]+(>|$)/g, ""),
          };
          break;
        }
      }
    }

    if (!foundCreator) {
      return { notFound: true };
    }

    return {
      props: { creator: foundCreator },
      revalidate: 3600 // Cache for 1 hour
    };
  } catch (e) {
    console.error("Critical error fetching creator data:", e);
    return { notFound: true };
  }
}

export default function CreatorProfile({ creator }: any) {
  const router = useRouter();

  // Safety check for 'blocking' fallback state
  if (router.isFallback || !creator) {
    return (
      <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading Profile...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      <Head>
        <title>{creator.name} - Profile | OnlyCrave</title>
        <meta name="description" content={`View the official ${creator.name} profile on OnlyCrave. Join the network today.`} />
      </Head>

      <div style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '40px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        <div style={{ width: '100px', height: '100px', background: 'linear-gradient(45deg, #111, #222)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: '1px solid #333' }}>
          ⭐
        </div>
        
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '15px', letterSpacing: '-1px' }}>
          {creator.name}
        </h1>
        
        <p style={{ color: '#888', marginBottom: '35px', lineHeight: '1.6', fontSize: '0.95rem' }}>
          {creator.content}
        </p>
        
        <a 
          href="https://onlycrave.com/creators/" 
          style={{ 
            display: 'block', 
            width: '100%', 
            padding: '20px', 
            background: '#2ddfff', 
            color: '#000', 
            borderRadius: '16px', 
            fontWeight: 800, 
            textDecoration: 'none', 
            transition: '0.3s ease',
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.filter = 'brightness(1)'}
        >
          VIEW FULL PROFILE
        </a>
        
        <div style={{ marginTop: '25px' }}>
          <button 
            onClick={() => router.back()}
            style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            ← BACK TO DIRECTORY
          </button>
        </div>
      </div>
    </div>
  );
}

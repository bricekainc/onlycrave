import { useRouter } from 'next/router';
import Head from 'next/head';
import Parser from 'rss-parser';

export async function getStaticPaths() {
  const parser = new Parser();
  try {
    const googleFeed = await parser.parseURL('https://www.google.com/alerts/feeds/01441943357185983502/10271601532123878621');
    const paths = googleFeed.items.map(item => ({
      params: { slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
    }));
    return { paths, fallback: 'blocking' };
  } catch (e) {
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }: any) {
  const parser = new Parser();
  try {
    const googleFeed = await parser.parseURL('https://www.google.com/alerts/feeds/01441943357185983502/10271601532123878621');
    const creator = googleFeed.items.find(item => 
      item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.slug
    );

    if (!creator) return {适当: { notFound: true } };

    return {
      props: {
        creator: {
          name: creator.title.replace(/<\/?[^>]+(>|$)/g, ""),
          content: creator.contentSnippet || "Verified Creator Profile",
        }
      },
      revalidate: 3600
    };
  } catch (e) {
    return { notFound: true };
  }
}

export default function CreatorProfile({ creator }: any) {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <Head>
        <title>{creator.name} - Profile | OnlyCrave</title>
        <meta name="description" content={`View the official ${creator.name} profile on OnlyCrave. Join the network today.`} />
      </Head>

      <div style={{ maxWidth: '500px', textAlign: 'center', padding: '40px', background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '30px' }}>
        <div style={{ width: '100px', height: '100px', background: '#111', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          ⭐
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px' }}>{creator.name}</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>{creator.content}</p>
        
        <a href="https://onlycrave.com/creators/" style={{ display: 'block', width: '100%', padding: '18px', background: '#2ddfff', color: '#000', borderRadius: '15px', fontWeight: 800, textDecoration: 'none', transition: '0.2s' }}>
          VIEW FULL PROFILE
        </a>
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';
import Head from 'next/head';
import { getCreators } from '../lib/fetchCreators';

export async function getServerSideProps(context: any) {
  const { username } = context.params;
  const creators = await getCreators();
  const creator = creators.find((c: any) => c.username.toLowerCase() === username.toLowerCase());

  if (!creator) return { notFound: true };

  return { props: { creator } };
}

export default function CreatorProfile({ creator }: { creator: any }) {
  const router = useRouter();

  const handleSubscribeClick = () => {
    // Redirect to the wallet or age gate first? 
    // Usually, we send them to the wallet deposit page you mentioned.
    window.location.href = "https://onlycrave.com/my/wallet";
  };

  const theme = {
    primary: '#e33cc7',
    secondary: '#2ddfff',
    blue: '#0102FD',
    bg: '#0a0a0c',
    card: '#16161a',
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Head>
        <title>{creator.name} (@{creator.username}) | OnlyCrave Official Profile</title>
        <meta name="description" content={`Subscribe to ${creator.name} on OnlyCrave. Exclusive content, live streams, and more.`} />
      </Head>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src={creator.avatar} alt={creator.name} style={{ width: '150px', height: '150px', borderRadius: '50%', border: `4px solid ${theme.primary}`, marginBottom: '20px' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{creator.name}</h1>
          <p style={{ color: theme.secondary, fontWeight: 'bold' }}>@{creator.username}</p>
        </div>

        {/* Bio Section */}
        <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '20px', marginBottom: '30px' }}>
          <h3>About Creator</h3>
          <p style={{ opacity: 0.8, lineHeight: '1.6' }}>{creator.description}</p>
        </div>

        {/* Subscription / Payment Instructions */}
        <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '20px', border: `1px solid ${theme.blue}` }}>
          <h3 style={{ color: theme.blue }}>How to Subscribe</h3>
          <ul style={{ lineHeight: '2', opacity: 0.9 }}>
            <li>1. Login to your <strong>OnlyCrave</strong> account.</li>
            <li>2. Go to your <strong>Wallet</strong> and click Deposit.</li>
            <li>3. Choose your preferred gateway: 
                <span style={{ color: theme.secondary }}> M-Pesa, PayPal, CoinPayments, Coinbase, Atlos, or Bank Transfer.</span>
            </li>
            <li>4. Once your balance is updated, return to this profile and click <strong>Subscribe</strong>.</li>
          </ul>
          
          <button 
            onClick={handleSubscribeClick}
            style={{ width: '100%', padding: '18px', marginTop: '20px', borderRadius: '15px', border: 'none', background: theme.blue, color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
          >
            Deposit & Subscribe Now
          </button>
        </div>

        <button onClick={() => router.push('/')} style={{ marginTop: '40px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
          ← Back to Directory
        </button>
      </main>
    </div>
  );
}

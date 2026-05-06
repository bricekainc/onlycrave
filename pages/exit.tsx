import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function ExitPage() {
  const router = useRouter();
  const { url } = router.query;
  const [decodedUrl, setDecodedUrl] = useState<string>('');

  useEffect(() => {
    if (url) {
      setDecodedUrl(decodeURIComponent(url as string));
    }
  }, [url]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      window.close();
    }
  };

  const hostname = decodedUrl ? new URL(decodedUrl).hostname : 'External Site';

  return (
    <div style={{ backgroundColor: '#0f0f19', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <Head>
        <title>Visiting {hostname} via OnlyCrave</title>
        <meta name="description" content={`You are leaving OnlyCrave to visit ${hostname}. Please verify the destination for your security.`} />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <main style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', border: '1px solid rgba(0, 210, 255, 0.2)', borderRadius: '30px', padding: '40px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
        
        <div style={{ fontSize: '3rem', color: '#00d2ff', marginBottom: '20px', filter: 'drop-shadow(0 0 10px rgba(0, 210, 255, 0.4))' }}>
          🛡️
        </div>

        <h1 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letter-spacing: '2px', marginBottom: '15px' }}>
          Security Intercept
        </h1>
        
        <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5' }}>
          You are leaving OnlyCrave to visit an external destination:
        </p>
        
        <div style={{ background: 'rgba(0, 0, 0, 0.3)', borderLeft: '4px solid #00d2ff', padding: '15px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#00d2ff', wordBreak: 'break-all', textAlign: 'left', margin: '25px 0' }}>
          {decodedUrl || 'Loading destination...'}
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={handleBack}
            style={{ padding: '12px 25px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', border: '1px solid #444', background: '#222', color: 'white' }}
          >
            GO BACK
          </button>
          
          <a 
            href={decodedUrl} 
            style={{ padding: '12px 25px', borderRadius: '50px', fontWeight: '700', textDecoration: 'none', background: '#00d2ff', color: 'black', boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)' }}
          >
            PROCEED
          </a>
        </div>

        <p style={{ marginTop: '25px', color: '#666', fontSize: '0.75rem' }}>
          Verify the URL above before proceeding. OnlyCrave is not responsible for content on external sites.
        </p>
      </main>
    </div>
  );
}

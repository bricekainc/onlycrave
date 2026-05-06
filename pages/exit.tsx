import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

export default function ExitPage() {
  const router = useRouter();
  const { url } = router.query;
  const [decodedUrl, setDecodedUrl] = useState<string>('');
  const [hostname, setHostname] = useState<string>('External Site');

  useEffect(() => {
    if (url && typeof url === 'string') {
      const decoded = decodeURIComponent(url);
      setDecodedUrl(decoded);
      try {
        const urlObj = new URL(decoded);
        setHostname(urlObj.hostname);
      } catch (e) {
        setHostname('External Site');
      }
    }
  }, [url]);

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        router.back();
      } else {
        window.close();
      }
    }
  };

  return (
    <>
      <Head>
        <title>Security Check: {hostname}</title>
        <meta name="description" content={`You are leaving OnlyCrave to visit ${hostname}.`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{ backgroundColor: '#0f0f19', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', margin: 0, padding: '20px' }}>
        <main style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', border: '1px solid rgba(0, 210, 255, 0.2)', borderRadius: '30px', padding: '40px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          
          <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🛡️</div>

          <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', color: '#fff' }}>
            Security Intercept
          </h1>
          
          <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>
            You are navigating to an external protocol. Review the destination:
          </p>
          
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderLeft: '4px solid #00d2ff', padding: '15px', borderRadius: '10px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#00d2ff', wordBreak: 'break-all', textAlign: 'left', marginBottom: '30px' }}>
            {decodedUrl || 'Validating URL...'}
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button 
              onClick={handleBack}
              type="button"
              style={{ padding: '12px 25px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', border: '1px solid #444', background: '#222', color: 'white', transition: '0.2s' }}
            >GO BACK
            </button>
            
            <a 
              href={decodedUrl || '#'} 
              rel="noopener noreferrer"
              style={{ padding: '12px 25px', borderRadius: '50px', fontWeight: '700', textDecoration: 'none', background: '#00d2ff', color: 'black', boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)', transition: '0.2s' }}
            >PROCEED (Open Link)
            </a>
          </div>

          <p style={{ marginTop: '30px', color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            OnlyCrave Security Protocol
          </p>
        </main>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CombinedLanding() {
  const [mounted, setMounted] = useState(false);
  const [isFansnub, setIsFansnub] = useState(false);
  const [gateStage, setGateStage] = useState(1);
  const [age, setAge] = useState('');
  const [ageError, setAgeError] = useState(false);
  const [captchaSolved, setCaptchaSolved] = useState(false);
  const [math, setMath] = useState({ q: '', a: 0, opts: [] as number[] });

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    // Detect if user is on Fansnub
    if (host.includes('fansnub.com')) {
      setIsFansnub(true);
      const n1 = Math.floor(Math.random() * 9) + 1;
      const n2 = Math.floor(Math.random() * 5) + 1;
      const ans = n1 + n2;
      const choices = [ans, ans + 1, ans - 2].sort(() => Math.random() - 0.5);
      setMath({ q: `${n1} + ${n2}`, a: ans, opts: choices });
    }
  }, []);

  if (!mounted) return null;

  // ==========================================
  // VIEW A: FANSNUB MIGRATION (Mirror)
  // ==========================================
  if (isFansnub) {
    return (
      <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Head>
          <title>Fansnub Has Moved to OnlyCrave – Exclusive Creator Platform</title>
          <meta name="description" content="Fansnub (Fansnub.com) is now OnlyCrave.com — an exclusive content platform for creators. Low fees, fast payouts, and the content you crave!" />
        </Head>

        <div style={{ margin: 0, padding: '80px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 50% 0%, #1a1a2e 0%, #050505 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255, 62, 128, 0.1) 0%, transparent 70%)', top: '-200px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}></div>

          <div style={{ maxWidth: '800px', width: '100%', zIndex: 2 }}>
            {gateStage === 1 && (
              <div id="stage-1" style={{ background: 'rgba(17, 17, 17, 0.8)', padding: '40px', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(10px)' }}>
                <div style={{ display: 'inline-block', padding: '5px 15px', background: 'rgba(1, 2, 253, 0.2)', border: '1px solid #0102FD', color: '#7071ff', borderRadius: '20px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
                  Secure Access Protocol
                </div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '15px', background: 'linear-gradient(to right, #fff, #ff3e80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  We've upgraded! Fansnub has merged with OnlyCrave.
                </h2>
                <p style={{ color: '#a0a0a0', fontSize: '1.1rem', marginBottom: '30px' }}>
                  All user profiles and balances have been moved to offer better tools and faster payouts.
                </p>

                <div style={{ background: '#000', padding: '25px', borderRadius: '20px', border: '1px solid rgba(1, 2, 253, 0.3)' }}>
                  <span style={{ display: 'block', fontWeight: 600, marginBottom: '15px' }}>Verify you are human: {math.q} = ?</span>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {math.opts.map(o => (
                      <button key={o} onClick={() => o === math.a && setGateStage(2)} style={{ background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>{o}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gateStage === 2 && (
              <div style={{ background: 'rgba(17, 17, 17, 0.9)', padding: '40px', borderRadius: '28px', border: '1px solid #ff3e80' }}>
                <h2 style={{ color: '#ff3e80', marginBottom: '10px' }}>Adult Content (18+)</h2>
                <p style={{ color: '#ccc', marginBottom: '25px' }}>Please verify your age to access premium creator profiles.</p>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" style={{ background: '#000', border: '2px solid #ff3e80', color: '#fff', padding: '15px', borderRadius: '12px', width: '100px', fontSize: '1.5rem', textAlign: 'center', outline: 'none', marginBottom: '20px' }} />
                {ageError && <div style={{ color: '#ff4444', marginBottom: '15px', fontWeight: 'bold' }}>Access Denied.</div>}
                <button onClick={() => parseInt(age) >= 18 ? window.location.href = "https://onlycrave.com" : setAgeError(true)} style={{ width: '100%', padding: '18px', background: '#ff3e80', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 800, cursor: 'pointer' }}>ENTER PLATFORM</button>
              </div>
            )}
          </div>
        </div>

        {/* SEO Footer (Only for Fansnub) */}
        <footer style={{ background: '#080808', padding: '50px 0', borderTop: '2px solid #1a1a1a' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px', background: '#111', borderRadius: '8px', borderBottom: '4px solid #00d2ff' }}>
            <div style={{ color: '#888', fontSize: '14px', textAlign: 'justify' }}>
              OnlyCrave is a leading global directory for content creators. We have migrated all Fansnub user profiles and active subscriptions. 
              <strong> Why did we migrate?</strong> This move allows us to provide lower 5% platform fees and more reliable streaming. 
              <strong> Is my account safe?</strong> Yes. Your credentials work perfectly on OnlyCrave.com.
            </div>
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <span style={{ color: '#aaa', fontSize: '12px' }}>&copy; 2026 ONLYCRAVE. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW B: ONLYCRAVE DIRECTORY (Vercel)
  // ==========================================
  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Head>
        <title>OnlyCrave - Connect with Fans. Earn with Content.</title>
        <meta name="description" content="Join 1,200+ creators on OnlyCrave. The ultimate platform for exclusive content." />
      </Head>

      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ff3e80' }}>ONLYCRAVE</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button style={{ background: '#0102FD', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700 }}>LOGIN</button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px' }}>
          The <span style={{ color: '#0102FD' }}>1,200+</span> Creator Network
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '700px', margin: '0 auto 50px' }}>
          OnlyCrave is the premier directory for finding the world's top creators. Connect, subscribe, and crave more.
        </p>

        {/* Creator Grid Placeholder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ background: '#111', borderRadius: '24px', padding: '40px', border: '1px solid #222' }}>
              <div style={{ width: '100px', height: '100px', background: '#222', borderRadius: '50%', margin: '0 auto 20px' }}></div>
              <h3 style={{ marginBottom: '5px' }}>Creator #{i}</h3>
              <p style={{ color: '#ff3e80', fontSize: '0.9rem' }}>@exclusive_creator</p>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '40px', opacity: 0.5, fontSize: '0.8rem' }}>
        &copy; 2026 OnlyCrave Global Directory
      </footer>
    </div>
  );
}

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';

interface TipPageProps {
  cpMerchantId: string;
}

export default function TipPage({ cpMerchantId }: TipPageProps) {
  const router = useRouter();
  const { username } = router.query;

  const [amount, setAmount] = useState<string>('10');
  const [localCurrency, setLocalCurrency] = useState({ code: 'KES', rate: 129.5, symbol: 'KSh' });
  const [method, setMethod] = useState<'mpesa' | 'crypto' | 'gpay' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates['KES']) setLocalCurrency((prev) => ({ ...prev, rate: data.rates['KES'] }));
      })
      .catch(() => console.error("Exchange fetch failed"));
  }, []);

  const handleTip = async () => {
    setError(null);
    if (!method) { setError("Select payment method"); return; }
    setLoading(true);
    try {
      if (method === 'mpesa') {
        const res = await axios.post('/api/payments/mpesa', { amount, phone, username });
        if (res.data.success) setShowSuccess(true);
      } else if (method === 'gpay') {
        // Placeholder for Google Pay Integration
        alert("Google Pay integration requires a business profile. Redirecting to backup...");
        setMethod('crypto');
      } else {
        const params = new URLSearchParams({
          cmd: '_pay_simple',
          merchant: cpMerchantId,
          item_name: `Tip for @${username}`,
          amountf: amount,
          currency: 'USD',
          custom: `${username}_tip`,
          success_url: `${window.location.origin}/${username}/tip?success=true`,
        });
        window.location.href = `https://www.coinpayments.net/index.php?${params.toString()}`;
      }
    } catch (err: any) {
      setError("Transaction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Inline Styles for "Bulletproof" UI ---
  const styles = {
    wrapper: {
      minHeight: '100vh',
      backgroundColor: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative' as 'relative',
      overflow: 'hidden'
    },
    glow: {
      position: 'absolute' as 'absolute',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(1, 2, 253, 0.15) 0%, rgba(0,0,0,0) 70%)',
      borderRadius: '50%',
      top: '-100px',
      left: '-100px',
      zIndex: 0
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '40px',
      padding: '40px 30px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      zIndex: 1,
      textAlign: 'center' as 'center'
    },
    inputContainer: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '24px',
      padding: '20px',
      margin: '25px 0',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    amountInput: {
      background: 'transparent',
      border: 'none',
      color: '#fff',
      fontSize: '48px',
      fontWeight: '900',
      width: '100%',
      textAlign: 'center' as 'center',
      outline: 'none',
      marginTop: '10px'
    },
    methodGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '10px',
      marginBottom: '20px'
    },
    methodBtn: (active: boolean) => ({
      background: active ? 'rgba(1, 2, 253, 0.15)' : 'rgba(255, 255, 255, 0.02)',
      border: active ? '2px solid #0102FD' : '2px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '20px',
      padding: '15px 5px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      gap: '8px'
    }),
    mainBtn: {
      width: '100%',
      height: '65px',
      background: '#0102FD',
      color: '#fff',
      border: 'none',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '900',
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: '2px',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(1, 2, 253, 0.3)',
      marginTop: '10px'
    },
    secondaryBtn: {
      background: 'transparent',
      border: 'none',
      color: '#555',
      fontSize: '10px',
      fontWeight: '900',
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: '3px',
      marginTop: '25px',
      cursor: 'pointer'
    }
  };

  if (showSuccess) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.card}>
            <div style={{width: '70px', height: '70px', background: '#10b981', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(16,185,129,0.4)'}}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h2 style={{fontSize: '28px', fontWeight: '900', fontStyle: 'italic', color: '#fff'}}>TIP SENT!</h2>
            <p style={{color: '#888', fontSize: '14px', margin: '15px 0 30px'}}>Thank you for supporting @{username}</p>
            <button style={styles.mainBtn} onClick={() => router.push(`/${username}`)}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <Head><title>Tip @{username}</title></Head>
      <div style={styles.glow}></div>

      <div style={styles.card}>
        <div style={{fontSize: '40px', marginBottom: '10px'}}>💎</div>
        <h1 style={{fontSize: '22px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-1px'}}>
          Support @{username}
        </h1>
        <p style={{fontSize: '9px', color: '#555', letterSpacing: '4px', fontWeight: '900', marginTop: '5px'}}>PREMIUM CREATOR TIP</p>

        {error && <div style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', marginTop: '20px'}}>{error}</div>}

        <div style={styles.inputContainer}>
            <label style={{fontSize: '10px', fontWeight: '900', color: '#666', letterSpacing: '2px', display: 'block'}}>TIP AMOUNT (USD)</label>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{fontSize: '30px', fontWeight: '900', color: '#0102FD', marginRight: '5px'}}>$</span>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    style={styles.amountInput}
                />
            </div>
            <div style={{marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between'}}>
                <span style={{fontSize: '10px', color: '#444', fontWeight: '900'}}>CONVERSION</span>
                <span style={{fontSize: '14px', color: '#0102FD', fontWeight: '900'}}>{localCurrency.symbol} {(Number(amount) * localCurrency.rate).toLocaleString()}</span>
            </div>
        </div>

        <div style={styles.methodGrid}>
            <div onClick={() => setMethod('mpesa')} style={styles.methodBtn(method === 'mpesa')}>
                <span style={{fontSize: '20px'}}>📱</span>
                <span style={{fontSize: '9px', fontWeight: '900', color: method === 'mpesa' ? '#fff' : '#666'}}>M-PESA</span>
            </div>
            <div onClick={() => setMethod('gpay')} style={styles.methodBtn(method === 'gpay')}>
                <span style={{fontSize: '20px'}}>💳</span>
                <span style={{fontSize: '9px', fontWeight: '900', color: method === 'gpay' ? '#fff' : '#666'}}>G-PAY</span>
            </div>
            <div onClick={() => setMethod('crypto')} style={styles.methodBtn(method === 'crypto')}>
                <span style={{fontSize: '20px'}}>₿</span>
                <span style={{fontSize: '9px', fontWeight: '900', color: method === 'crypto' ? '#fff' : '#666'}}>CRYPTO</span>
            </div>
        </div>

        {method === 'mpesa' && (
            <input 
                placeholder="2547XXXXXXXX" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                style={{width: '100%', background: '#000', border: '1px solid #222', borderRadius: '15px', padding: '15px', color: '#fff', fontWeight: 'bold', marginBottom: '15px', outline: 'none'}}
            />
        )}

        <button 
            style={{...styles.mainBtn, opacity: (loading || !method) ? 0.3 : 1}} 
            disabled={loading || !method} 
            onClick={handleTip}
        >
          {loading ? "Processing..." : "Authorize Transaction"}
        </button>

        <button style={styles.secondaryBtn} onClick={() => router.push(`/${username}`)}>
            Return to @{username}
        </button>

        <div style={{marginTop: '30px', opacity: 0.3, fontSize: '8px', fontWeight: '900', letterSpacing: '5px', color: '#fff'}}>
            ONLYCRAVE • ENCRYPTED GATEWAY
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { cpMerchantId: process.env.COINPAYMENTS_MERCHANT_ID || '' } };
};

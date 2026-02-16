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

  // --- UI State ---
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [themeSetting, setThemeSetting] = useState<'light' | 'dark' | 'system'>('system');
  
  // --- Payment State ---
  const [amount, setAmount] = useState<string>('10');
  const [localCurrency, setLocalCurrency] = useState({ code: 'KES', rate: 129.5, symbol: 'KSh' });
  const [method, setMethod] = useState<'mpesa' | 'crypto' | 'paypal' | 'gpay' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Theme Detection Logic ---
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      if (themeSetting === 'system') {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setTheme(themeSetting);
      }
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [themeSetting]);

  // --- Exchange Rate Sync ---
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
    if (!method) { setError("Please select a payment method."); return; }
    setLoading(true);

    try {
      if (method === 'mpesa') {
        if (!phone.match(/^(254|0)(7|1)\d{8}$/)) throw new Error("Invalid M-Pesa number.");
        const res = await axios.post('/api/payments/mpesa', { amount, phone, username });
        if (res.data.success) setShowSuccess(true);
      } else if (method === 'paypal') {
        // Redirect to PayPal Donation flow
        const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'africka@mail.com';
        window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${paypalEmail}&item_name=Tip+for+${username}&amount=${amount}&currency_code=USD`;
      } else if (method === 'gpay') {
        setError("Google Pay is currently in maintenance. Please use M-Pesa, PayPal or Crypto.");
      } else {
        const params = new URLSearchParams({
          cmd: '_pay_simple',
          merchant: cpMerchantId,
          item_name: `Tip for @${username}`,
          amountf: amount,
          currency: 'USD',
          success_url: `${window.location.origin}/${username}/tip?success=true`,
        });
        window.location.href = `https://www.coinpayments.net/index.php?${params.toString()}`;
      }
    } catch (err: any) {
      setError(err.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'dark';

  const styles = {
    wrapper: {
      minHeight: '100vh',
      backgroundColor: isDark ? '#050505' : '#F4F7FF',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, system-ui, sans-serif',
      transition: 'background-color 0.4s ease',
    },
    themeBar: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      padding: '5px',
      borderRadius: '12px'
    },
    themeBtn: (active: boolean) => ({
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '10px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      background: active ? (isDark ? '#fff' : '#000') : 'transparent',
      color: active ? (isDark ? '#000' : '#fff') : (isDark ? '#888' : '#444'),
    }),
    card: {
      width: '100%',
      maxWidth: '400px',
      background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#ffffff',
      backdropFilter: 'blur(30px)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)',
      borderRadius: '35px',
      padding: '30px',
      boxShadow: isDark ? '0 30px 60px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.05)',
      textAlign: 'center' as 'center',
    },
    inputBox: {
      background: isDark ? 'rgba(255,255,255,0.04)' : '#F9FAFB',
      borderRadius: '24px',
      padding: '20px',
      margin: '20px 0',
      border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E5E7EB',
    },
    methodBtn: (active: boolean) => ({
      background: active ? '#0102FD' : (isDark ? 'rgba(255,255,255,0.03)' : '#F3F4F6'),
      color: active ? '#fff' : (isDark ? '#888' : '#4B5563'),
      border: 'none',
      borderRadius: '18px',
      padding: '12px 5px',
      cursor: 'pointer',
      fontSize: '9px',
      fontWeight: '900',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      gap: '5px',
      transition: '0.2s transform active'
    }),
    alert: {
      padding: '12px',
      borderRadius: '15px',
      fontSize: '11px',
      fontWeight: 'bold',
      marginBottom: '15px',
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.2)'
    }
  };

  return (
    <div style={styles.wrapper}>
      <Head><title>Tip @{username}</title></Head>
      
      {/* Theme Toggles */}
      <div style={styles.themeBar}>
        {(['light', 'dark', 'system'] as const).map(t => (
          <button key={t} onClick={() => setThemeSetting(t)} style={styles.themeBtn(themeSetting === t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <h1 style={{fontSize: '20px', fontWeight: '900', color: isDark ? '#fff' : '#000', fontStyle: 'italic'}}>SUPPORT @{username}</h1>
        
        {error && <div style={styles.alert}>⚠️ {error}</div>}

        <div style={styles.inputBox}>
          <span style={{fontSize: '10px', fontWeight: '900', color: '#888', letterSpacing: '2px'}}>AMOUNT (USD)</span>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            style={{background: 'transparent', border: 'none', width: '100%', fontSize: '40px', fontWeight: '900', textAlign: 'center', color: isDark ? '#fff' : '#0102FD', outline: 'none'}}
          />
          <div style={{fontSize: '11px', color: '#888', marginTop: '10px', fontWeight: 'bold'}}>
             ≈ {localCurrency.symbol} {(Number(amount) * localCurrency.rate).toLocaleString()}
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '20px'}}>
            {[{id: 'mpesa', icon: '📱', label: 'MPESA'}, {id: 'paypal', icon: '🅿️', label: 'PAYPAL'}, {id: 'gpay', icon: '💳', label: 'G-PAY'}, {id: 'crypto', icon: '₿', label: 'CRYPTO'}].map(m => (
                <button key={m.id} onClick={() => setMethod(m.id as any)} style={styles.methodBtn(method === m.id)}>
                    <span style={{fontSize: '18px'}}>{m.icon}</span>
                    <span>{m.label}</span>
                </button>
            ))}
        </div>

        {method === 'mpesa' && (
            <div style={{marginBottom: '15px'}}>
                <input 
                    placeholder="M-Pesa Number (254...)" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    style={{width: '100%', padding: '15px', borderRadius: '15px', border: isDark ? '1px solid #333' : '1px solid #DDD', background: isDark ? '#000' : '#fff', color: isDark ? '#fff' : '#000', fontWeight: 'bold'}}
                />
                <p style={{fontSize: '9px', color: '#888', marginTop: '5px', fontWeight: 'bold'}}>A prompt will be sent to your phone</p>
            </div>
        )}

        {method === 'paypal' && (
            <div style={{...styles.alert, color: '#0102FD', background: 'rgba(1, 2, 253, 0.05)', border: '1px solid rgba(1, 2, 253, 0.1)'}}>
                You will be redirected to PayPal to complete your donation.
            </div>
        )}

        <button 
            disabled={loading || !method}
            onClick={handleTip}
            style={{
                width: '100%', height: '60px', background: '#0102FD', color: '#fff', border: 'none', borderRadius: '18px', fontSize: '12px', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', opacity: loading ? 0.5 : 1
            }}
        >
            {loading ? "PROCESSING..." : "SEND TIP NOW"}
        </button>

        <button 
            onClick={() => router.push(`/${username}`)}
            style={{background: 'transparent', border: 'none', marginTop: '20px', color: '#888', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '2px'}}
        >
            CANCEL AND RETURN
        </button>
      </div>

      <p style={{marginTop: '30px', fontSize: '8px', fontWeight: '900', color: isDark ? '#444' : '#BBB', letterSpacing: '4px'}}>
        ONLYCRAVE SECURE • {theme.toUpperCase()} MODE
      </p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { cpMerchantId: process.env.COINPAYMENTS_MERCHANT_ID || '' } };
};

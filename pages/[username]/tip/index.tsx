import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';

interface TipPageProps {
  cpMerchantId: string;
}

type PaymentMethod = 'mpesa' | 'crypto' | 'paypal' | 'gpay' | 'bitpay' | null;

type BitpayCurrencyKey = 'btc' | 'ton' | 'usdt_trc20' | 'usdt_erc20';

type BitpayTransactionMethod = 'bank_transfer' | 'debit_card' | 'credit_card' | 'paypal' | 'other';

const BITPAY_MINIMUM_AMOUNT = 50;

const BITPAY_ASSETS: Record<BitpayCurrencyKey, {
  label: string;
  crypto_currency: string;
  crypto_chain: string;
  crypto_address: string;
}> = {
  btc: {
    label: 'BTC',
    crypto_currency: 'btc',
    crypto_chain: 'btc',
    crypto_address: '1MaiRgdYHRFChiTm2aRCm1LDn9iAjSbiTi',
  },
  ton: {
    label: 'TON',
    crypto_currency: 'ton',
    crypto_chain: 'ton',
    crypto_address: 'UQAEqcYmBcyKQmGHYJdckUOgeerIB6FOrcAli4fq47eLkYPx',
  },
  usdt_trc20: {
    label: 'USDT TRC20',
    crypto_currency: 'usdt',
    crypto_chain: 'trx',
    crypto_address: 'TFmk9jML8GMy2Wau3EfYJdo2YcKeuYncgD',
  },
  usdt_erc20: {
    label: 'USDT ERC20',
    crypto_currency: 'usdt',
    crypto_chain: 'eth',
    crypto_address: '0xe42a3721d20da6e73f4f9457396dca98a0b30d43',
  },
};

const BITPAY_METHODS: Record<BitpayTransactionMethod, string> = {
  bank_transfer: 'Bank Transfer',
  debit_card: 'Debit Card',
  credit_card: 'Credit Card',
  paypal: 'PayPal',
  other: 'Mobile Money / Other',
};

export default function TipPage({ cpMerchantId }: TipPageProps) {
  const router = useRouter();
  const { username } = router.query;

  // --- UI State ---
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [themeSetting, setThemeSetting] = useState<'light' | 'dark' | 'system'>('system');
  
  // --- Payment State ---
  const [amount, setAmount] = useState<string>('10');
  const [localCurrency, setLocalCurrency] = useState({ code: 'KES', rate: 129.5, symbol: 'KSh' });
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- BitPay State ---
  const [bitpayCurrency, setBitpayCurrency] = useState<BitpayCurrencyKey>('btc');
  const [bitpayMethod, setBitpayMethod] = useState<BitpayTransactionMethod>('other');

  const numericAmount = Number(amount || '0');
  const bitpayAmountTooLow = method === 'bitpay' && numericAmount < BITPAY_MINIMUM_AMOUNT;

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

  const buildBitpayUrl = () => {
    const selectedAsset = BITPAY_ASSETS[bitpayCurrency];

    const params = new URLSearchParams({
      fiat_currency: 'usd',
      transaction_method: bitpayMethod,
      fiat_amount: amount,
      crypto_currency: selectedAsset.crypto_currency,
      crypto_chain: selectedAsset.crypto_chain,
      crypto_address: selectedAsset.crypto_address,
    });

    const baseUrl =
      bitpayMethod === 'other'
        ? 'https://bitpay.com/crypto-widget/buy/transaction-method'
        : 'https://bitpay.com/crypto-widget/buy';

    return `${baseUrl}?${params.toString()}`;
  };

  const Icon3D = ({ type }: { type: 'phone' | 'paypal' | 'bitpay' | 'card' | 'bitcoin' }) => {
    const base: React.CSSProperties = {
      width: '30px',
      height: '30px',
      borderRadius: '12px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.35), 0 8px 16px rgba(0,0,0,0.3)',
    };

    const text: React.CSSProperties = {
      fontSize: '13px',
      fontWeight: 900,
      color: '#fff',
      lineHeight: 1,
      textShadow: '0 1px 2px rgba(0,0,0,0.35)',
    };

    const map: Record<string, React.CSSProperties> = {
      phone: { background: 'linear-gradient(145deg, #22c55e, #064e3b)' },
      paypal: { background: 'linear-gradient(145deg, #38bdf8, #075985)' },
      bitpay: { background: 'linear-gradient(145deg, #60a5fa, #1d4ed8)' },
      card: { background: 'linear-gradient(145deg, #fb7185, #be123c)' },
      bitcoin: { background: 'linear-gradient(145deg, #fbbf24, #b45309)' },
    };

    const label: Record<string, string> = {
      phone: 'M',
      paypal: 'P',
      bitpay: 'BP',
      card: '$',
      bitcoin: 'B',
    };

    return (
      <span style={{ ...base, ...map[type] }}>
        <span style={text}>{label[type]}</span>
      </span>
    );
  };

  const handleTip = async () => {
    setError(null);
    setShowSuccess(false);
    if (!method) { setError("Please select a payment method."); return; }
    setLoading(true);

    try {
      if (method === 'mpesa') {
        if (!phone.match(/^(254|0)(7|1)\d{8}$/)) throw new Error("Invalid M-Pesa number.");
        const res = await axios.post('/api/payments/mpesa', { amount, phone, username });
        if (res.data.success) {
          setShowSuccess(true);
        }
      } else if (method === 'paypal') {
        const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'africka@mail.com';
        window.location.href = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${paypalEmail}&item_name=Tip+for+${username}&amount=${amount}&currency_code=USD`;
      } else if (method === 'gpay') {
        throw new Error("Google Pay is currently in maintenance. Please use M-Pesa, PayPal or Crypto.");
      } else if (method === 'bitpay') {
        if (!amount || numericAmount < BITPAY_MINIMUM_AMOUNT) {
          throw new Error(`BitPay requires a minimum tip of $${BITPAY_MINIMUM_AMOUNT}.`);
        }

        window.location.href = buildBitpayUrl();
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
      setError(err.response?.data?.message || err.message || "Transaction failed.");
      setLoading(false); 
    } finally {
      if (method === 'mpesa' || error) {
        setLoading(false);
      }
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
      gap: '7px',
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
        
        {error && <div style={styles.alert}>{error}</div>}

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

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px'}}>
            {[
              {id: 'mpesa', icon: <Icon3D type="phone" />, label: 'MPESA'},
              {id: 'paypal', icon: <Icon3D type="paypal" />, label: 'PAYPAL'},
              {id: 'bitpay', icon: <Icon3D type="bitpay" />, label: 'BITPAY'},
            ].map(m => (
                <button key={m.id} onClick={() => {setMethod(m.id as PaymentMethod); setShowSuccess(false);}} style={styles.methodBtn(method === m.id)}>
                    {m.icon}
                    <span>{m.label}</span>
                </button>
            ))}
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px'}}>
            {[
              {id: 'gpay', icon: <Icon3D type="card" />, label: 'G-PAY'},
              {id: 'crypto', icon: <Icon3D type="bitcoin" />, label: 'CRYPTO'}
            ].map(m => (
                <button key={m.id} onClick={() => {setMethod(m.id as PaymentMethod); setShowSuccess(false);}} style={styles.methodBtn(method === m.id)}>
                    {m.icon}
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

        {method === 'bitpay' && (
            <div style={{background: isDark ? '#090909' : '#F9FAFB', border: isDark ? '1px solid #333' : '1px solid #E5E7EB', borderRadius: '18px', padding: '15px', marginBottom: '15px', textAlign: 'left'}}>
                <label style={{ display: 'block', fontSize: '10px', color: '#888', fontWeight: 900, marginBottom: '8px', letterSpacing: '1px' }}>
                  BITPAY ASSET
                </label>

                <select
                  value={bitpayCurrency}
                  onChange={(e) => setBitpayCurrency(e.target.value as BitpayCurrencyKey)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', background: isDark ? '#000' : '#fff', border: isDark ? '1px solid #444' : '1px solid #DDD', color: isDark ? '#fff' : '#000', marginBottom: '12px', fontWeight: 800 }}
                >
                  {Object.entries(BITPAY_ASSETS).map(([key, asset]) => (
                    <option key={key} value={key}>{asset.label}</option>
                  ))}
                </select>

                <label style={{ display: 'block', fontSize: '10px', color: '#888', fontWeight: 900, marginBottom: '8px', letterSpacing: '1px' }}>
                  PAYMENT OPTION
                </label>

                <select
                  value={bitpayMethod}
                  onChange={(e) => setBitpayMethod(e.target.value as BitpayTransactionMethod)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', background: isDark ? '#000' : '#fff', border: isDark ? '1px solid #444' : '1px solid #DDD', color: isDark ? '#fff' : '#000', fontWeight: 800 }}
                >
                  {Object.entries(BITPAY_METHODS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>

                <div style={{...styles.alert, color: bitpayAmountTooLow ? '#ef4444' : '#2563eb', background: bitpayAmountTooLow ? 'rgba(239,68,68,0.08)' : 'rgba(37,99,235,0.08)', border: bitpayAmountTooLow ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(37,99,235,0.2)', marginTop: '12px', marginBottom: 0, textAlign: 'center'}}>
                  {bitpayAmountTooLow
                    ? 'BitPay requires a minimum tip of $50.'
                    : 'You will be redirected to BitPay to choose bank transfer, card, PayPal, mobile money, or another supported option.'}
                </div>
            </div>
        )}

        {/* STK Push Success Notice */}
        {showSuccess && method === 'mpesa' && (
          <div style={{
              padding: '12px',
              borderRadius: '15px',
              fontSize: '11px',
              fontWeight: 'bold',
              marginBottom: '15px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
          }}>
              STK PUSH SENT! <br/>
              Check your device and enter M-Pesa PIN to complete payment.
          </div>
        )}

        <button 
            disabled={loading || !method || bitpayAmountTooLow}
            onClick={handleTip}
            style={{
                width: '100%',
                height: '60px',
                background: '#0102FD',
                color: '#fff',
                border: 'none',
                borderRadius: '18px',
                fontSize: '12px',
                fontWeight: '900',
                letterSpacing: '2px',
                cursor: loading || !method || bitpayAmountTooLow ? 'not-allowed' : 'pointer',
                opacity: (loading || !method || bitpayAmountTooLow) ? 0.5 : 1
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

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';

interface DepositPageProps {
  cpMerchantId: string;
}

type PaymentMethod = 'mpesa' | 'crypto' | 'paypal' | 'patreon' | 'stars' | 'bitpay' | null;

type BitpayCurrencyKey = 'btc' | 'ton' | 'usdt_trc20' | 'usdt_erc20';

type BitpayTransactionMethod = 'bank_transfer' | 'debit_card' | 'credit_card' | 'paypal' | 'other';

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

export default function DepositPage({ cpMerchantId }: DepositPageProps) {
  const router = useRouter();
  const { amount: queryAmount } = router.query;

  // --- UI & Payment State ---
  const [amount, setAmount] = useState<string>('0');
  const [method, setMethod] = useState<PaymentMethod>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [receiptMode, setReceiptMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');

  // --- BitPay State ---
  const [bitpayCurrency, setBitpayCurrency] = useState<BitpayCurrencyKey>('btc');
  const [bitpayMethod, setBitpayMethod] = useState<BitpayTransactionMethod>('other');

  useEffect(() => {
    if (queryAmount) setAmount(queryAmount as string);
    setTransactionId('OC-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  }, [queryAmount]);

  const Icon3D = ({ type }: { type: 'phone' | 'bitpay' | 'card' | 'paypal' | 'bitcoin' | 'star' | 'download' | 'upload' }) => {
    const base: React.CSSProperties = {
      width: '28px',
      height: '28px',
      borderRadius: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '8px',
      position: 'relative',
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.35), 0 8px 16px rgba(0,0,0,0.35)',
      flexShrink: 0,
    };

    const text: React.CSSProperties = {
      fontSize: '14px',
      fontWeight: 900,
      color: '#fff',
      lineHeight: 1,
      textShadow: '0 1px 2px rgba(0,0,0,0.35)',
    };

    const map: Record<string, React.CSSProperties> = {
      phone: { background: 'linear-gradient(145deg, #22c55e, #064e3b)' },
      bitpay: { background: 'linear-gradient(145deg, #60a5fa, #1d4ed8)' },
      card: { background: 'linear-gradient(145deg, #fb7185, #be123c)' },
      paypal: { background: 'linear-gradient(145deg, #38bdf8, #075985)' },
      bitcoin: { background: 'linear-gradient(145deg, #fbbf24, #b45309)' },
      star: { background: 'linear-gradient(145deg, #7dd3fc, #0284c7)' },
      download: { background: 'linear-gradient(145deg, #e5e7eb, #6b7280)' },
      upload: { background: 'linear-gradient(145deg, #818cf8, #0102FD)' },
    };

    const label: Record<string, string> = {
      phone: 'M',
      bitpay: 'BP',
      card: '$',
      paypal: 'P',
      bitcoin: 'B',
      star: 'T',
      download: '↓',
      upload: '↑',
    };

    return (
      <span style={{ ...base, ...map[type] }}>
        <span style={text}>{label[type]}</span>
      </span>
    );
  };

  const GatewayButton = ({
    active,
    onClick,
    color,
    icon,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    color: string;
    icon: 'phone' | 'bitpay' | 'card' | 'paypal' | 'bitcoin' | 'star';
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      style={{
        background: active ? color : '#111',
        border: '1px solid #333',
        borderRadius: '16px',
        color: '#fff',
        padding: '14px 12px',
        cursor: 'pointer',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '62px',
      }}
    >
      <Icon3D type={icon} />
      <span>{children}</span>
    </button>
  );

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

  const handleDeposit = async () => {
    setError(null);
    if (!method) { setError("Select a payment method."); return; }
    setLoading(true);

    try {
      if (method === 'mpesa') {
        if (!phone.match(/^(254|0)(7|1)\d{8}$/)) throw new Error("Invalid M-Pesa number.");
        const res = await axios.post('/api/payments/mpesa', { amount, phone, username: 'Wallet_Deposit' });
        if (res.data.success) setReceiptMode(true);
      } 
      else if (method === 'paypal') {
        window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'africka@mail.com'}&item_name=Wallet+Deposit&amount=${amount}&currency_code=USD`, '_blank');
        setReceiptMode(true);
      } 
      else if (method === 'crypto') {
        const params = new URLSearchParams({
          cmd: '_pay_simple',
          merchant: cpMerchantId,
          item_name: `Wallet Deposit`,
          amountf: amount,
          currency: 'USD',
          success_url: `${window.location.origin}/deposit?success=true`,
        });
        window.open(`https://www.coinpayments.net/index.php?${params.toString()}`, '_blank');
        setReceiptMode(true);
      } 
      else if (method === 'stars') {
        const starAmount = Math.ceil(parseFloat(amount) * 50); 
        const res = await axios.post('/api/payments/telegram-stars', { 
            amount: starAmount, 
            transactionId 
        });

        if (res.data.invoiceLink) {
            window.open(res.data.invoiceLink, '_blank');
            setReceiptMode(true);
        }
      }
      else if (method === 'patreon') {
        window.open('https://trimd.cc/depositpatreononlycrave', '_blank');
        setReceiptMode(true);
      }
      else if (method === 'bitpay') {
        if (!amount || parseFloat(amount) <= 0) throw new Error("Invalid deposit amount.");
        window.open(buildBitpayUrl(), '_blank');
        setReceiptMode(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Gateway error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const receiptContent = `
      ONLYCRAVE DEPOSIT VOUCHER
      -------------------------
      Transaction Ref: ${transactionId}
      Amount: $${amount}
      Method: ${method?.toUpperCase()}
      Status: PENDING CONFIRMATION
      Date: ${new Date().toLocaleString()}
    `;
    const element = document.createElement("a");
    const file = new Blob([receiptContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Receipt-${transactionId}.jpg`;
    document.body.appendChild(element);
    element.click();
  };

  const ReceiptView = () => (
    <div id="receipt" style={{ background: '#fff', color: '#000', padding: '25px', borderRadius: '25px', textAlign: 'center', border: '3px solid #0102FD' }}>
      <div style={{ fontSize: '22px', fontWeight: '900', color: '#0102FD', marginBottom: '5px' }}>ONLYCRAVE</div>
      <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', color: '#888', marginBottom: '20px' }}>DEPOSIT VOUCHER</div>
      
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>Amount Expected</div>
        <div style={{ fontSize: '32px', fontWeight: '900' }}>${amount}</div>
      </div>

      <div style={{ textAlign: 'left', fontSize: '12px', lineHeight: '2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Method:</span> <strong>{method?.toUpperCase()}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Ref ID:</span> <strong>{transactionId}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Status:</span> <span style={{ color: '#ff424d', fontWeight: 'bold' }}>WAITING FOR PROOF</span>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '12px', background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', fontSize: '11px', color: '#3730a3', textAlign: 'left', lineHeight: '1.4' }}>
        <strong>FINAL STEPS:</strong><br/>
        1. Take a screenshot of this receipt.<br/>
        2. Go to <a href="https://onlycrave.com/my/wallet" target="_blank" style={{color: '#0102FD', fontWeight: 'bold'}}>Wallet Page</a>.<br/>
        3. Enter <b>{amount}</b>, click Manual, and upload the screenshot.<br/>
        4. Click "Add Funds" and wait 5-10 mins.
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head><title>Deposit Hub | OnlyCrave</title></Head>

      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: '30px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
        {error && <div style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', borderRadius: '10px', fontSize: '12px', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}
        
        {!receiptMode ? (
          <>
            <h1 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '2px', marginBottom: '30px', textAlign: 'center' }}>DEPOSIT INTERFACE</h1>
            
            <div style={{ background: 'linear-gradient(135deg, rgba(1, 2, 253, 0.1), rgba(0, 210, 255, 0.1))', padding: '25px', borderRadius: '24px', marginBottom: '25px', textAlign: 'center', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
              <span style={{ fontSize: '11px', color: '#00d2ff', fontWeight: 'bold', letterSpacing: '1px' }}>TOTAL TO DEPOSIT</span>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff' }}>${amount}</div>
            </div>

            <p style={{ fontSize: '11px', color: '#888', marginBottom: '15px', fontWeight: '600' }}>SELECT PAYMENT GATEWAY:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' }}>
              <GatewayButton active={method === 'mpesa'} onClick={() => setMethod('mpesa')} color="#0102FD" icon="phone">
                M-PESA
              </GatewayButton>

              <GatewayButton active={method === 'bitpay'} onClick={() => setMethod('bitpay')} color="#2563eb" icon="bitpay">
                BITPAY
              </GatewayButton>

              <GatewayButton active={method === 'patreon'} onClick={() => setMethod('patreon')} color="#FF424D" icon="card">
                CARD/PAYPAL
              </GatewayButton>

              <GatewayButton active={method === 'paypal'} onClick={() => setMethod('paypal')} color="#0070ba" icon="paypal">
                PAYPAL DIR.
              </GatewayButton>

              <GatewayButton active={method === 'crypto'} onClick={() => setMethod('crypto')} color="#f39c12" icon="bitcoin">
                CRYPTO
              </GatewayButton>

              <GatewayButton active={method === 'stars'} onClick={() => setMethod('stars')} color="#35A9F0" icon="star">
                TELEGRAM STARS
              </GatewayButton>
            </div>

            {method === 'mpesa' && (
              <input placeholder="Phone: 254..." value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '18px', borderRadius: '15px', marginBottom: '20px', background: '#000', border: '1px solid #444', color: '#fff', fontSize: '16px' }} />
            )}

            {method === 'bitpay' && (
              <div style={{ background: '#090909', border: '1px solid #333', borderRadius: '18px', padding: '15px', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>
                  BITPAY ASSET
                </label>

                <select
                  value={bitpayCurrency}
                  onChange={(e) => setBitpayCurrency(e.target.value as BitpayCurrencyKey)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#000', border: '1px solid #444', color: '#fff', marginBottom: '12px', fontWeight: 700 }}
                >
                  {Object.entries(BITPAY_ASSETS).map(([key, asset]) => (
                    <option key={key} value={key}>{asset.label}</option>
                  ))}
                </select>

                <label style={{ display: 'block', fontSize: '11px', color: '#888', fontWeight: 700, marginBottom: '8px' }}>
                  PAYMENT OPTION
                </label>

                <select
                  value={bitpayMethod}
                  onChange={(e) => setBitpayMethod(e.target.value as BitpayTransactionMethod)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#000', border: '1px solid #444', color: '#fff', fontWeight: 700 }}
                >
                  {Object.entries(BITPAY_METHODS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              disabled={loading || !method} 
              onClick={handleDeposit} 
              style={{ 
                width: '100%', 
                padding: '20px', 
                borderRadius: '50px', 
                border: 'none', 
                background: method === 'patreon' ? '#FF424D' : method === 'bitpay' ? '#2563eb' : '#0102FD', 
                color: '#fff', 
                fontWeight: '900', 
                cursor: 'pointer', 
                fontSize: '14px', 
                boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                opacity: (loading || !method) ? 0.6 : 1 
              }}
            >
              {loading ? "CONNECTING..." : `PAY $${amount} NOW ›`}
            </button>
          </>
        ) : (
          <>
            <ReceiptView />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleDownload} style={{ padding: '15px', borderRadius: '50px', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon3D type="download" /> DOWNLOAD
              </button>
              <button onClick={() => window.open('https://onlycrave.com/my/wallet', '_blank')} style={{ padding: '15px', borderRadius: '50px', background: '#0102FD', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon3D type="upload" /> UPLOAD NOW
              </button>
            </div>
            <button onClick={() => window.close()} style={{ width: '100%', marginTop: '15px', padding: '15px', background: 'transparent', border: '1px solid #444', color: '#888', borderRadius: '50px', cursor: 'pointer', fontSize: '11px' }}>
              CLOSE INTERFACE
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { 
    props: { 
      cpMerchantId: process.env.COINPAYMENTS_MERCHANT_ID || '' 
    } 
  };
};

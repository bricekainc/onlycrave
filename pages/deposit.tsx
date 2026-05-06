import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function DepositPage() {
  const router = useRouter();
  const { amount: queryAmount } = router.query;

  // --- UI & Payment State ---
  const [amount, setAmount] = useState<string>('0');
  const [method, setMethod] = useState<'mpesa' | 'crypto' | 'paypal' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [receiptMode, setReceiptMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');

  // Sync amount from URL
  useEffect(() => {
    if (queryAmount) setAmount(queryAmount as string);
    // Generate a random transaction ref for the receipt
    setTransactionId('OC-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  }, [queryAmount]);

  const handleDeposit = async () => {
    setError(null);
    if (!method) { setError("Select a payment method."); return; }
    setLoading(true);

    try {
      if (method === 'mpesa') {
        if (!phone.match(/^(254|0)(7|1)\d{8}$/)) throw new Error("Invalid M-Pesa number.");
        const res = await axios.post('/api/payments/mpesa', { amount, phone, username: 'Wallet_Deposit' });
        if (res.data.success) setReceiptMode(true);
      } else if (method === 'paypal') {
        const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'africka@mail.com';
        window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${paypalEmail}&item_name=Wallet+Deposit&amount=${amount}&currency_code=USD`, '_blank');
        setReceiptMode(true);
      } else if (method === 'crypto') {
        const params = new URLSearchParams({
          cmd: '_pay_simple',
          merchant: process.env.NEXT_PUBLIC_CP_MERCHANT_ID || '',
          item_name: `Wallet Deposit`,
          amountf: amount,
          currency: 'USD',
        });
        window.open(`https://www.coinpayments.net/index.php?${params.toString()}`, '_blank');
        setReceiptMode(true);
      }
    } catch (err: any) {
      setError(err.message || "Gateway error.");
    } finally {
      setLoading(false);
    }
  };

  const ReceiptView = () => (
    <div id="receipt" style={{ background: '#fff', color: '#000', padding: '30px', borderRadius: '20px', textAlign: 'center', border: '2px dashed #0102FD' }}>
      <div style={{ fontSize: '24px', fontWeight: '900', color: '#0102FD', marginBottom: '10px' }}>ONLYCRAVE RECEIPT</div>
      <p style={{ fontSize: '12px', color: '#666' }}>{new Date().toLocaleString()}</p>
      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span>Status:</span> <span style={{ fontWeight: 'bold', color: '#10b981' }}>PENDING VERIFICATION</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span>Method:</span> <span style={{ fontWeight: 'bold' }}>{method?.toUpperCase()}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span>Reference:</span> <span style={{ fontWeight: 'bold' }}>{transactionId}</span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '20px' }}>${amount}</div>
      <p style={{ fontSize: '10px', color: '#888', marginTop: '20px' }}>Please screenshot this and upload it to your wallet page.</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <Head><title>Secure Deposit Hub</title></Head>

      <div style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.03)', borderRadius: '35px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        {!receiptMode ? (
          <>
            <h1 style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1px', marginBottom: '20px' }}>SECURE DEPOSIT</h1>
            
            {error && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{error}</div>}

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '24px', marginBottom: '20px' }}>
              <span style={{ fontSize: '10px', color: '#888', fontWeight: 'bold' }}>DEPOSIT AMOUNT</span>
              <div style={{ fontSize: '40px', fontWeight: '900', color: '#00d2ff' }}>${amount}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setMethod('mpesa')} style={{ background: method === 'mpesa' ? '#0102FD' : '#222', border: 'none', borderRadius: '15px', color: '#fff', padding: '15px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>📱 MPESA</button>
              <button onClick={() => setMethod('paypal')} style={{ background: method === 'paypal' ? '#0102FD' : '#222', border: 'none', borderRadius: '15px', color: '#fff', padding: '15px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>🅿️ PAYPAL</button>
              <button onClick={() => setMethod('crypto')} style={{ background: method === 'crypto' ? '#0102FD' : '#222', border: 'none', borderRadius: '15px', color: '#fff', padding: '15px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>₿ CRYPTO</button>
            </div>

            {method === 'mpesa' && (
              <input 
                placeholder="254..." 
                value={phone} onChange={(e) => setPhone(e.target.value)} 
                style={{ width: '100%', padding: '15px', borderRadius: '15px', marginBottom: '20px', background: '#000', border: '1px solid #333', color: '#fff' }} 
              />
            )}

            <button 
              disabled={loading || !method}
              onClick={handleDeposit}
              style={{ width: '100%', padding: '20px', borderRadius: '18px', border: 'none', background: '#0102FD', color: '#fff', fontWeight: '900', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? "COMMUNICATING..." : "INITIATE DEPOSIT"}
            </button>
          </>
        ) : (
          <>
            <ReceiptView />
            <button 
              onClick={() => window.close()}
              style={{ width: '100%', marginTop: '20px', padding: '15px', borderRadius: '50px', background: 'transparent', border: '1px solid #444', color: '#888', fontWeight: 'bold', cursor: 'pointer' }}
            >
              DONE (CLOSE WINDOW)
            </button>
          </>
        )}
      </div>
    </div>
  );
}

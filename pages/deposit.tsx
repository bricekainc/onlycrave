import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function DepositPage() {
  const router = useRouter();
  const { amount: queryAmount } = router.query;

  // --- UI & Payment State ---
  const [amount, setAmount] = useState<string>('0');
  const [method, setMethod] = useState<'mpesa' | 'crypto' | 'paypal' | 'patreon' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [receiptMode, setReceiptMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (queryAmount) setAmount(queryAmount as string);
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
        window.open(`https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=${process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'africka@mail.com'}&item_name=Wallet+Deposit&amount=${amount}&currency_code=USD`, '_blank');
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
      } else if (method === 'patreon') {
        // Redirecting to your custom Patreon bridge/checkout
        window.open('https://trimd.cc/depositpatreononlycrave', '_blank');
        setReceiptMode(true);
      }
    } catch (err: any) {
      setError(err.message || "Gateway error.");
    } finally {
      setLoading(false);
    }
  };

  const ReceiptView = () => (
    <div id="receipt" style={{ background: '#fff', color: '#000', padding: '30px', borderRadius: '25px', textAlign: 'center', border: '3px solid #0102FD' }}>
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
          <span>Status:</span> <span style={{ color: '#ff424d', fontWeight: 'bold' }}>WAITING FOR SCREENSHOT</span>
        </div>
      </div>

      <div style={{ marginTop: '25px', padding: '10px', background: '#fff9e6', border: '1px solid #ffeeba', borderRadius: '10px', fontSize: '11px', color: '#856404' }}>
        ⚠️ <strong>Action Required:</strong> Take a screenshot of this page and the payment confirmation, then upload both to the wallet page.
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Head><title>Deposit Hub | OnlyCrave</title></Head>

      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', borderRadius: '35px', padding: '30px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
        {!receiptMode ? (
          <>
            <h1 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '2px', marginBottom: '30px', textAlign: 'center' }}>DEPOSIT INTERFACE</h1>
            
            <div style={{ background: 'linear-gradient(135deg, rgba(1, 2, 253, 0.1), rgba(0, 210, 255, 0.1))', padding: '25px', borderRadius: '24px', marginBottom: '25px', textAlign: 'center', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
              <span style={{ fontSize: '11px', color: '#00d2ff', fontWeight: 'bold', letterSpacing: '1px' }}>TOTAL TO DEPOSIT</span>
              <div style={{ fontSize: '48px', fontWeight: '900', color: '#fff' }}>${amount}</div>
            </div>

            <p style={{ fontSize: '11px', color: '#888', marginBottom: '15px', fontWeight: '600' }}>SELECT PAYMENT GATEWAY:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '25px' }}>
              <button onClick={() => setMethod('mpesa')} style={{ background: method === 'mpesa' ? '#0102FD' : '#111', border: '1px solid #333', borderRadius: '16px', color: '#fff', padding: '15px', cursor: 'pointer', fontWeight: 'bold' }}>📱 M-PESA</button>
              <button onClick={() => setMethod('patreon')} style={{ background: method === 'patreon' ? '#FF424D' : '#111', border: '1px solid #333', borderRadius: '16px', color: '#fff', padding: '15px', cursor: 'pointer', fontWeight: 'bold' }}>🎯 CARD/PAYPAL</button>
              <button onClick={() => setMethod('paypal')} style={{ background: method === 'paypal' ? '#0070ba' : '#111', border: '1px solid #333', borderRadius: '16px', color: '#fff', padding: '15px', cursor: 'pointer', fontWeight: 'bold' }}>🅿️ PAYPAL DIR.</button>
              <button onClick={() => setMethod('crypto')} style={{ background: method === 'crypto' ? '#f39c12' : '#111', border: '1px solid #333', borderRadius: '16px', color: '#fff', padding: '15px', cursor: 'pointer', fontWeight: 'bold' }}>₿ CRYPTO</button>
            </div>

            {method === 'patreon' && (
              <div style={{ background: 'rgba(255, 66, 77, 0.1)', padding: '15px', borderRadius: '15px', fontSize: '12px', color: '#ff6b73', marginBottom: '20px', border: '1px solid rgba(255, 66, 77, 0.2)' }}>
                ℹ️ <strong>Card/PayPal via Patreon:</strong> Best for International Cards. You will be redirected to Patreon to complete the secure checkout.
              </div>
            )}

            {method === 'mpesa' && (
              <input placeholder="Phone: 254..." value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: '100%', padding: '18px', borderRadius: '15px', marginBottom: '20px', background: '#000', border: '1px solid #444', color: '#fff', fontSize: '16px' }} />
            )}

            <button disabled={loading || !method} onClick={handleDeposit} style={{ width: '100%', padding: '20px', borderRadius: '50px', border: 'none', background: method === 'patreon' ? '#FF424D' : '#0102FD', color: '#fff', fontWeight: '900', cursor: 'pointer', fontSize: '14px', boxShadow: '0 10px 20px rgba(0,0,0,0.4)' }}>
              {loading ? "CONNECTING..." : `PAY $${amount} NOW ›`}
            </button>
          </>
        ) : (
          <>
            <ReceiptView />
            <button onClick={() => window.close()} style={{ width: '100%', marginTop: '25px', padding: '18px', borderRadius: '50px', background: '#222', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              I HAVE SCREENSHOTTED THIS
            </button>
          </>
        )}
      </div>
    </div>
  );
}

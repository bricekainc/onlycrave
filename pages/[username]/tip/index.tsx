import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function TipPage() {
  const router = useRouter();
  const { username } = router.query;

  const [amount, setAmount] = useState<string>('10');
  const [localCurrency, setLocalCurrency] = useState({ code: 'KES', rate: 129.5, symbol: 'KSh' });
  const [method, setMethod] = useState<'mpesa' | 'crypto' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  // Auto-convert USD to Local (KES)
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates['KES']) setLocalCurrency((prev) => ({ ...prev, rate: data.rates['KES'] }));
      })
      .catch(() => console.error("Exchange rate fetch failed"));
  }, []);

  const handleTip = async () => {
    if (!method) {
      setStatus({ type: 'error', msg: 'Please select a payment method.' });
      return;
    }
    
    setLoading(true);
    setStatus(null);

    try {
      if (method === 'mpesa') {
        if (!phone) throw new Error('Phone number is required for M-Pesa');
        
        const res = await axios.post('/api/tip-handler', { 
            method: 'mpesa',
            amount, 
            phone, 
            username 
        });
        
        if (res.data.success) {
          setStatus({ type: 'success', msg: '✅ STK Push sent! Enter your PIN on your phone.' });
        } else {
          throw new Error(res.data.error || 'M-Pesa initiation failed.');
        }
      } else {
        // Crypto Logic
        const res = await axios.post('/api/tip-handler', { method: 'crypto', amount, username });
        if (res.data.url) {
          window.location.href = res.data.url;
        }
      }
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Transaction failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#0102FD] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        <title>Support @{username} | OnlyCrave</title>
      </Head>

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0102FD]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-[2.5rem] p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0102FD] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[#0102FD]/20">
              <span className="text-2xl">💸</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Support @{username}</h1>
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Premium Tipping</p>
          </div>

          {status && (
            <div className={`mb-6 p-4 rounded-2xl text-sm border ${
              status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {status.msg}
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-6">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black">Amount (USD)</label>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-gray-500 mr-2">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-4xl font-bold focus:ring-0 outline-none"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between items-center text-sm">
                <span className="text-gray-400 font-medium">Estimated {localCurrency.code}</span>
                <span className="text-[#0102FD] font-bold">
                  {localCurrency.symbol} {(Number(amount) * localCurrency.rate).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setMethod('mpesa')}
                className={`p-4 rounded-2xl border transition-all ${method === 'mpesa' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/5 bg-white/5'}`}
              >
                <div className="text-xl mb-1">📲</div>
                <div className="text-xs font-bold uppercase">M-Pesa</div>
              </button>
              <button 
                onClick={() => setMethod('crypto')}
                className={`p-4 rounded-2xl border transition-all ${method === 'crypto' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/5 bg-white/5'}`}
              >
                <div className="text-xl mb-1">🪙</div>
                <div className="text-xs font-bold uppercase">Crypto</div>
              </button>
            </div>

            {method === 'mpesa' && (
              <input 
                placeholder="2547XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-lg focus:border-[#0102FD] outline-none transition-all"
              />
            )}

            <button
              onClick={handleTip}
              disabled={loading}
              className="w-full bg-[#0102FD] hover:bg-[#0001D1] disabled:opacity-50 text-white font-bold py-5 rounded-2xl shadow-xl shadow-[#0102FD]/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send Tip Now"}
            </button>

            <button 
              onClick={() => router.push(`/${username}`)}
              className="w-full text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

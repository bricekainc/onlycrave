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
  const [method, setMethod] = useState<'mpesa' | 'crypto' | null>(null);
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

  useEffect(() => {
    if (router.query.success === 'true') setShowSuccess(true);
  }, [router.query]);

  const handleTip = async () => {
    setError(null);
    if (!method) {
      setError("Select a payment method to continue.");
      return;
    }
    setLoading(true);
    try {
      if (method === 'mpesa') {
        if (!phone.match(/^(254|0)(7|1)\d{8}$/)) {
          throw new Error("Enter a valid M-Pesa number (e.g. 0712...)");
        }
        const res = await axios.post('/api/payments/mpesa', { amount, phone, username });
        if (res.data.success) setShowSuccess(true);
      } else {
        const params = new URLSearchParams({
          cmd: '_pay_simple',
          merchant: cpMerchantId,
          item_name: `Tip for @${username}`,
          amountf: amount,
          currency: 'USD',
          email: 'africka@mail.com',
          first_name: 'Fan',
          last_name: String(username),
          custom: `${username}_tip_${Date.now()}`,
          success_url: `${window.location.origin}/${username}/tip?success=true`,
          cancel_url: `${window.location.origin}/${username}/tip`
        });
        window.location.href = `https://www.coinpayments.net/index.php?${params.toString()}`;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full backdrop-blur-3xl bg-white/[0.03] border border-white/[0.1] rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black mb-2 italic tracking-tighter">SENT!</h2>
          <p className="text-gray-400 text-sm mb-8">Your tip of <span className="text-white font-bold">${amount}</span> is on its way to <span className="text-[#0102FD]">@{username}</span>.</p>
          <button onClick={() => router.push(`/${username}`)} className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-transform">Back to Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head><title>Tip @{username} | OnlyCrave</title></Head>

      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#0102FD]/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[120px]"></div>

      <div className="max-w-[440px] w-full relative z-10">
        <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/[0.08] rounded-[3rem] p-6 sm:p-10 shadow-2xl overflow-hidden">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0102FD] to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/40">
              <span className="text-2xl">💸</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter italic uppercase">Support @{username}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-bold mt-1">Direct Creator Tip</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Amount Visualizer */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-[2rem] p-6 focus-within:border-[#0102FD]/40 transition-all group">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black">Enter Amount (USD)</label>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-gray-700 mr-2 group-focus-within:text-[#0102FD] transition-colors">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-5xl font-black focus:ring-0 outline-none text-white placeholder:text-gray-800"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.03] flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Local Est.</span>
                <span className="text-[#0102FD] font-black text-lg">
                  {localCurrency.symbol} {(Number(amount) * localCurrency.rate).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setMethod('mpesa')}
                className={`group py-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-2 ${method === 'mpesa' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05]'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${method === 'mpesa' ? 'bg-[#0102FD] text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                  <span className="text-xl">S</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">M-Pesa</span>
              </button>
              <button 
                onClick={() => setMethod('crypto')}
                className={`group py-5 rounded-[1.5rem] border-2 transition-all flex flex-col items-center gap-2 ${method === 'crypto' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05]'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${method === 'crypto' ? 'bg-[#0102FD] text-white' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                  <span className="text-xl">₿</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Crypto</span>
              </button>
            </div>

            {/* Contextual Input */}
            {method === 'mpesa' && (
              <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                <input 
                  type="tel"
                  placeholder="2547XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.1] rounded-2xl py-5 px-6 text-white focus:border-[#0102FD] outline-none font-bold placeholder:text-gray-800 text-lg"
                />
                <p className="text-[9px] text-center text-gray-500 font-bold uppercase tracking-tighter">You will receive an M-Pesa prompt on this phone</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-4">
              <button 
                disabled={loading || !method || Number(amount) <= 0}
                onClick={handleTip}
                className="w-full h-16 bg-[#0102FD] disabled:opacity-20 text-white rounded-2xl shadow-[0_10px_30px_rgba(1,2,253,0.3)] transition-all active:scale-[0.97] hover:brightness-110 flex items-center justify-center overflow-hidden relative group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Authorize Tip</span>
                )}
              </button>

              <button 
                onClick={() => router.push(`/${username}`)}
                className="w-full text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
              >
                Return to @{username}
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-[9px] text-gray-700 font-black uppercase tracking-[0.5em] mt-8 opacity-50">
          ONLYCRAVE • SECURE GATEWAY
        </p>
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

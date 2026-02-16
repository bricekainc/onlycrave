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

  // --- State ---
  const [amount, setAmount] = useState<string>('10');
  const [localCurrency, setLocalCurrency] = useState({ code: 'KES', rate: 129.5, symbol: 'KSh' });
  const [method, setMethod] = useState<'mpesa' | 'crypto' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Currency Live Update ---
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates['KES']) setLocalCurrency((prev) => ({ ...prev, rate: data.rates['KES'] }));
      })
      .catch(() => console.error("Exchange fetch failed"));
  }, []);

  // --- Check for Redirect Success ---
  useEffect(() => {
    if (router.query.success === 'true') setShowSuccess(true);
  }, [router.query]);

  const handleTip = async () => {
    if (!method) return;
    if (method === 'mpesa' && !phone) {
      setError('Please enter your M-Pesa phone number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (method === 'mpesa') {
        // Calls your internal API bridge
        const res = await axios.post('/api/payments/mpesa', { 
            amount, 
            phone, 
            username,
            email: 'africka@mail.com',
            firstName: 'Tip',
            lastName: username
        });
        
        if (res.data.success) {
          setShowSuccess(true);
        } else {
          throw new Error();
        }
      } else {
        // Direct CoinPayments Redirect Logic
        const params = new URLSearchParams({
          cmd: '_pay_simple',
          merchant: cpMerchantId,
          item_name: `Tip for ${username}`,
          amountf: amount,
          currency: 'USD',
          email: 'africka@mail.com',
          first_name: 'Tip',
          last_name: String(username),
          custom: `${username}|tip`,
          success_url: `https://onlycrave.vercel.app/${username}/tip?success=true`,
          cancel_url: `https://onlycrave.vercel.app/${username}/tip`
        });
        window.location.href = `https://www.coinpayments.net/index.php?${params.toString()}`;
      }
    } catch (err) {
      setError('❌ Transaction failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- SUCCESS VIEW ---
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 font-sans">
        <Head><title>Tip Confirmed! | OnlyCrave</title></Head>
        <div className="max-w-md w-full backdrop-blur-3xl bg-white/[0.02] border border-white/[0.1] rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter italic">Tip Sent!</h2>
          <p className="text-gray-400 leading-relaxed mb-10 text-sm">
            You have sent the tip <span className="text-white font-bold">USD {amount}</span> to creator <span className="text-[#0102FD] font-bold">@{username}</span> on OnlyCrave.
          </p>
          <button 
            onClick={() => window.location.href = `https://onlycrave.vercel.app/${username}`}
            className="w-full bg-white text-black font-black py-5 rounded-2xl transition-transform active:scale-95 uppercase tracking-widest text-xs"
          >
            Visit @{username} OnlyCrave Page
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN VIEW ---
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#0102FD] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        <title>Support @{username} | OnlyCrave</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0102FD]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-2xl bg-white/[0.01] border border-white/[0.08] rounded-[2.8rem] p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#0102FD] to-blue-500 rounded-[2rem] mx-auto mb-5 flex items-center justify-center shadow-2xl shadow-[#0102FD]/30">
              <span className="text-3xl">💎</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase italic">@{username}</h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black mt-2">Verified OnlyCrave Creator</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 animate-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Amount Selector */}
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-[2rem] p-6 focus-within:border-[#0102FD]/50 transition-all">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-black">Tip Amount (USD)</label>
              <div className="flex items-center">
                <span className="text-4xl font-black text-gray-700 mr-2">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-5xl font-black focus:ring-0 outline-none text-white"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.03] flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-600 uppercase">Estimated Local</span>
                <span className="text-[#0102FD] font-black text-lg">
                  {localCurrency.symbol} {(Number(amount) * localCurrency.rate).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setMethod('mpesa')}
                className={`py-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'mpesa' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03]'}`}
              >
                <span className="text-2xl">📲</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">M-Pesa</span>
              </button>
              <button 
                onClick={() => setMethod('crypto')}
                className={`py-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'crypto' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03]'}`}
              >
                <span className="text-2xl">₿</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Crypto</span>
              </button>
            </div>

            {/* M-Pesa Input */}
            {method === 'mpesa' && (
              <div className="animate-in slide-in-from-top-2">
                <input 
                  type="tel"
                  placeholder="2547XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/50 border border-white/[0.1] rounded-2xl py-5 px-6 text-white focus:border-[#0102FD] outline-none font-bold placeholder:text-gray-800"
                />
              </div>
            )}

            {/* Final Action Buttons */}
            <div className="space-y-4 pt-2">
              <button 
                disabled={loading || !method || Number(amount) <= 0}
                onClick={handleTip}
                className="w-full relative h-16 bg-[#0102FD] disabled:opacity-20 text-white rounded-[1.4rem] shadow-2xl shadow-[#0102FD]/30 transition-all active:scale-[0.98] overflow-hidden"
              >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Processing</span>
                    </div>
                ) : (
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Confirm Tip</span>
                )}
              </button>

              <button 
                onClick={() => window.open(`https://onlycrave.vercel.app/${username}`, '_blank')}
                className="w-full py-4 text-gray-600 hover:text-white text-[10px] font-black uppercase tracking-[0.4em] transition-colors"
              >
                Visit Profile
              </button>
            </div>

            <p className="text-center text-[8px] text-gray-800 font-black uppercase tracking-[0.5em] pt-4">
              Secure • Anonymous • Powered by OnlyCrave
            </p>
          </div>
        </div>
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

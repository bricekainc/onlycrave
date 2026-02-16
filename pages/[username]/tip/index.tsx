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

  // State Management
  const [amount, setAmount] = useState<string>('10');
  const [localCurrency, setLocalCurrency] = useState({ code: 'KES', rate: 129.5, symbol: 'KSh' });
  const [method, setMethod] = useState<'mpesa' | 'crypto' | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-fetch Exchange Rate
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates['KES']) setLocalCurrency((prev) => ({ ...prev, rate: data.rates['KES'] }));
      })
      .catch(() => console.error("Currency conversion unavailable"));
  }, []);

  const handleTip = async () => {
    if (!method) return;
    if (method === 'mpesa' && (!phone || phone.length < 10)) {
      setError('Please enter a valid M-Pesa number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (method === 'mpesa') {
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
        // Crypto Redirect with pre-filled anonymous details
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
        });
        window.location.href = `https://www.coinpayments.net/index.php?${params.toString()}`;
      }
    } catch (err) {
      setError('Transaction could not be initiated. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Listen for Crypto Return Success
  useEffect(() => {
    if (router.query.success === 'true') setShowSuccess(true);
  }, [router.query]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#0102FD] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        <title>Tip @{username} | OnlyCrave</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#0102FD]/15 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px]"></div>

      <div className="max-w-md w-full relative z-20">
        {!showSuccess ? (
          <div className="backdrop-blur-2xl bg-white/[0.02] border border-white/[0.08] rounded-[3rem] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in-95 duration-500">
            
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0102FD] to-blue-500 rounded-[2rem] mx-auto mb-5 flex items-center justify-center shadow-2xl shadow-[#0102FD]/30 rotate-6 transition-transform hover:rotate-0">
                <span className="text-3xl">💎</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter">Support @{username}</h1>
              <div className="inline-block mt-2 px-3 py-1 bg-[#0102FD]/10 rounded-full border border-[#0102FD]/20">
                <p className="text-[#0102FD] text-[9px] uppercase tracking-[0.2em] font-black">Anonymous Tipping</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Amount Entry */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-[2rem] p-6 focus-within:border-[#0102FD]/40 transition-all">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-black">Amount (USD)</label>
                <div className="flex items-center">
                  <span className="text-4xl font-black text-gray-700 mr-2">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent border-none p-0 text-5xl font-black focus:ring-0 outline-none text-white placeholder-gray-800"
                    placeholder="0"
                  />
                </div>
                <div className="mt-5 pt-5 border-t border-white/[0.05] flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase">Local Est.</span>
                  <span className="text-[#0102FD] font-black text-xl drop-shadow-[0_0_8px_rgba(1,2,253,0.4)]">
                    {localCurrency.symbol} {(Number(amount) * localCurrency.rate).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setMethod('mpesa')}
                  className={`group py-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'mpesa' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]'}`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">📲</span>
                  <span className="text-[10px] font-black uppercase">M-Pesa</span>
                </button>
                <button 
                  onClick={() => setMethod('crypto')}
                  className={`group py-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${method === 'crypto' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]'}`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">₿</span>
                  <span className="text-[10px] font-black uppercase">Crypto</span>
                </button>
              </div>

              {method === 'mpesa' && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <input 
                    type="tel"
                    placeholder="Enter M-Pesa Number (254...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-2xl py-5 px-6 text-white focus:border-[#0102FD] outline-none font-bold text-center"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <button 
                  disabled={loading || !method || Number(amount) <= 0}
                  onClick={handleTip}
                  className="w-full relative h-16 bg-[#0102FD] disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-2xl shadow-2xl shadow-[#0102FD]/20 transition-all active:scale-[0.97] hover:brightness-110 font-black uppercase tracking-widest text-xs"
                >
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0102FD] rounded-2xl">
                      <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                  Confirm $${amount} Tip
                </button>

                <button 
                  onClick={() => window.location.href = `https://onlycrave.vercel.app/${username}`}
                  className="w-full bg-white/[0.03] text-gray-500 hover:text-white font-bold py-4 rounded-2xl transition-all border border-white/[0.05] uppercase text-[9px] tracking-[0.3em]"
                >
                  Return to Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/[0.1] rounded-[3rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
              <span className="text-4xl text-black">✅</span>
            </div>
            <h2 className="text-2xl font-black mb-4">Payment Sent!</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              You have sent a tip of <span className="text-white font-bold">${amount} USD</span> to creator <span className="text-[#0102FD] font-bold">@{username}</span> on OnlyCrave.
            </p>
            <button 
              onClick={() => window.location.href = `https://onlycrave.vercel.app/${username}`}
              className="w-full bg-white text-black font-black py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Visit @{username} OnlyCrave Page
            </button>
          </div>
        )}

        <p className="text-center text-[7px] text-gray-800 font-black uppercase tracking-[0.6em] mt-8">
          Powered by OnlyCrave Ecosystem • Secure & Encrypted
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      cpMerchantId: process.env.COINPAYMENTS_MERCHANT_ID || '',
    },
  };
};

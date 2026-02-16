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

  // --- Sync Exchange Rates ---
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates['KES']) setLocalCurrency((prev) => ({ ...prev, rate: data.rates['KES'] }));
      })
      .catch(() => console.error("Exchange fetch failed - using fallback rate"));
  }, []);

  // --- Listen for Payment Success via URL ---
  useEffect(() => {
    if (router.query.success === 'true') {
      setShowSuccess(true);
    }
  }, [router.query]);

  const handleTip = async () => {
    setError(null);
    if (!method) {
        setError("Please select a payment method.");
        return;
    }

    setLoading(true);

    try {
      if (method === 'mpesa') {
        // Validate Phone (Basic Kenyan Format)
        if (!phone.match(/^(254|0)(7|1)\d{8}$/)) {
            throw new Error("Please enter a valid M-Pesa number (e.g., 254712345678)");
        }

        // Trigger the Internal API Bridge
        const res = await axios.post('/api/payments/mpesa', { 
            amount, 
            phone, 
            username 
        });
        
        if (res.data.success) {
          // For M-Pesa, we show success once the STK push is triggered
          setShowSuccess(true);
        }
      } else {
        // Crypto Logic: Redirect to CoinPayments
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
      setError(err.response?.data?.error || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- SUCCESS STATE ---
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 font-sans">
        <Head><title>Success! | OnlyCrave</title></Head>
        <div className="max-w-md w-full backdrop-blur-3xl bg-white/[0.02] border border-white/[0.1] rounded-[3rem] p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-black mb-2 uppercase italic">Tip Initiated!</h2>
          <p className="text-gray-400 text-sm mb-8">
            If using M-Pesa, please check your phone for the PIN prompt. <br/>
            You sent <span className="text-white font-bold">${amount}</span> to <span className="text-[#0102FD]">@{username}</span>.
          </p>
          <button 
            onClick={() => router.push(`/${username}`)}
            className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
          >
            Return to Profile
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN FORM STATE ---
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        <title>Tip @{username} | OnlyCrave</title>
      </Head>

      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0102FD]/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="backdrop-blur-2xl bg-white/[0.01] border border-white/[0.08] rounded-[2.5rem] p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Send a Tip to @{username}</h1>
            <div className="h-1 w-12 bg-[#0102FD] mx-auto mt-2"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Amount Input */}
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-6 transition-all focus-within:border-[#0102FD]/50">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black">Amount (USD)</label>
              <div className="flex items-center">
                <span className="text-3xl font-black text-gray-600 mr-2">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-4xl font-black focus:ring-0 outline-none text-white"
                />
              </div>
              <p className="text-[11px] font-bold text-[#0102FD] mt-3 uppercase tracking-wider">
                ≈ {localCurrency.symbol} {(Number(amount) * localCurrency.rate).toLocaleString()} KES
              </p>
            </div>

            {/* Methods */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setMethod('mpesa')}
                className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${method === 'mpesa' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/[0.05] bg-white/[0.02]'}`}
              >
                <span className="text-xl">📱</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">M-Pesa</span>
              </button>
              <button 
                onClick={() => setMethod('crypto')}
                className={`py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${method === 'crypto' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-white/[0.05] bg-white/[0.02]'}`}
              >
                <span className="text-xl">₿</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Crypto</span>
              </button>
            </div>

            {/* M-Pesa Input Field */}
            {method === 'mpesa' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Phone Number</label>
                <input 
                  type="tel"
                  placeholder="2547XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-white/[0.1] rounded-2xl py-4 px-6 text-white focus:border-[#0102FD] outline-none font-bold"
                />
              </div>
            )}

            {/* Submit */}
            <button 
              disabled={loading || !method || Number(amount) <= 0}
              onClick={handleTip}
              className="w-full h-16 bg-[#0102FD] disabled:opacity-30 text-white rounded-2xl shadow-xl shadow-[#0102FD]/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="text-xs font-black uppercase tracking-[0.2em]">Complete Transaction</span>
              )}
            </button>

            <button 
                onClick={() => router.push(`/${username}`)}
                className="w-full text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] hover:text-white transition-colors"
            >
                Cancel and Go Back
            </button>
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

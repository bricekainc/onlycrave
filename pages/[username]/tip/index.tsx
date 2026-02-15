import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

const BRAND_COLOR = '#0102FD';

export default function TipPage() {
    const router = useRouter();
    const { username } = router.query;
    
    // State management
    const [amount, setAmount] = useState<string>('10');
    const [localCurrency, setLocalCurrency] = useState({ code: 'KES', rate: 129.50, symbol: 'KSh' });
    const [method, setMethod] = useState<'mpesa' | 'crypto' | null>(null);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch live exchange rates (USD to Local)
    useEffect(() => {
        const fetchExchange = async () => {
            try {
                // Free, no-auth currency API
                const res = await fetch('https://open.er-api.com/v6/latest/USD');
                const data = await res.json();
                
                // You can change 'KES' to any currency code or use a geo-ip logic
                const rate = data.rates['KES'];
                if (rate) {
                    setLocalCurrency({ code: 'KES', rate: rate, symbol: 'KSh' });
                }
            } catch (e) {
                console.error("Currency conversion unavailable, using fallback.");
            }
        };
        fetchExchange();
    }, []);

    const handleTip = async () => {
        if (!method) return;
        setLoading(true);

        const tipDetails = {
            amount: amount,
            username: username,
            email: 'africka@mail.com',
            firstName: 'Tip',
            lastName: username, // "Tip [Username]"
        };

        try {
            if (method === 'mpesa') {
                // Trigger M-Pesa STK Push via your PayHero backend logic
                const res = await fetch('/api/payments/mpesa', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...tipDetails, phone })
                });

                if (res.ok) {
                    alert('✅ M-Pesa prompt sent! Please check your phone.');
                } else {
                    throw new Error('M-Pesa request failed');
                }

            } else if (method === 'crypto') {
                // Redirect to CoinPayments with the exact parameters from your bot
                const params = new URLSearchParams({
                    cmd: '_pay_simple',
                    merchant: process.env.NEXT_PUBLIC_COINPAYMENTS_MERCHANT_ID || '', // Ensure this is in Vercel
                    item_name: `Tip for ${username}`,
                    item_number: `tip_${username}_${Date.now()}`,
                    amountf: amount,
                    currency: 'USD',
                    want_shipping: '0',
                    email: 'africka@mail.com',
                    first_name: 'Tip',
                    last_name: String(username),
                    success_url: `https://onlycrave.vercel.app/${username}`,
                    cancel_url: `https://onlycrave.vercel.app/${username}/tip`,
                    custom: `${username}|tip`
                });

                // Send notification to your email log before redirecting
                await fetch('/api/notify-tip', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...tipDetails, method: 'Crypto' })
                });

                window.location.href = `https://www.coinpayments.net/index.php?${params.toString()}`;
            }
        } catch (err) {
            alert('❌ There was an error processing your tip. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white font-sans flex items-center justify-center p-4">
            <Head>
                <title>Tip @{username} | OnlyCrave</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>

            <div className="max-w-md w-full bg-[#161618] border border-[#333] rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#0102FD] to-[#5e01fd] rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(1,2,253,0.3)] border-4 border-[#161618]">
                        <span className="text-4xl">💎</span>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Support @{username}</h1>
                    <p className="text-gray-400 mt-2 text-sm">Send a tip to unlock exclusive appreciation</p>
                </div>

                <div className="space-y-6">
                    {/* USD Input Section */}
                    <div className="bg-black/40 p-5 rounded-2xl border border-[#222]">
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-3 ml-1 font-bold">Amount in USD</label>
                        <div className="relative flex items-center">
                            <span className="absolute left-0 text-3xl font-bold text-gray-600">$</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-transparent border-none py-2 pl-8 text-4xl font-black focus:ring-0 outline-none placeholder-gray-800"
                                placeholder="0"
                            />
                        </div>
                        {/* Beautiful Currency Converter Display */}
                        <div className="mt-4 pt-4 border-t border-[#222] flex justify-between items-center">
                            <span className="text-gray-400 text-xs font-medium">Local Equivalent:</span>
                            <span className="text-[#0102FD] font-bold text-lg">
                                {localCurrency.symbol} {(Number(amount) * localCurrency.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Method Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setMethod('mpesa')}
                            className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 ${method === 'mpesa' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-[#222] bg-black/40 hover:border-[#444]'}`}
                        >
                            <span className={`text-2xl transition-transform duration-300 ${method === 'mpesa' ? 'scale-110' : ''}`}>📲</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">M-Pesa</span>
                            {method === 'mpesa' && <div className="absolute top-2 right-2 w-2 h-2 bg-[#0102FD] rounded-full animate-pulse"></div>}
                        </button>
                        
                        <button 
                            onClick={() => setMethod('crypto')}
                            className={`group relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 ${method === 'crypto' ? 'border-[#0102FD] bg-[#0102FD]/10' : 'border-[#222] bg-black/40 hover:border-[#444]'}`}
                        >
                            <span className={`text-2xl transition-transform duration-300 ${method === 'crypto' ? 'scale-110' : ''}`}>₿</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Crypto</span>
                            {method === 'crypto' && <div className="absolute top-2 right-2 w-2 h-2 bg-[#0102FD] rounded-full animate-pulse"></div>}
                        </button>
                    </div>

                    {/* Conditional M-Pesa Phone Input */}
                    {method === 'mpesa' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <input 
                                type="tel"
                                placeholder="Phone Number (e.g., 2547...)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-black border border-[#222] rounded-xl py-4 px-5 focus:border-[#0102FD] outline-none transition-all placeholder-gray-700"
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        disabled={loading || !method || Number(amount) <= 0}
                        onClick={handleTip}
                        className="w-full relative group h-16 bg-[#0102FD] disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(1,2,253,0.4)] transition-all active:scale-[0.98]"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative text-sm font-black uppercase tracking-widest">
                            {loading ? '🚀 Processing...' : `Confirm $${amount} Tip`}
                        </span>
                    </button>

                    <div className="flex items-center justify-center gap-2 pt-2">
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">Secure Checkout</span>
                        <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">Anonymous Tip</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

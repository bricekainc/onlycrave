import React from 'react';

interface Competitor {
  name: string;
  fee: string;
  payouts: string;
  kyc: string;
  features: string;
  rating: number;
}

const competitors: Competitor[] = [
  { 
    name: 'OnlyCrave', 
    fee: '< 5%', 
    payouts: 'M-Pesa, Crypto, Bank, PayPal', 
    kyc: '5 Mins', 
    features: 'Shop (Toys/Custom), Live, Calls',
    rating: 5 
  },
  { 
    name: 'OnlyFans', 
    fee: '20%', 
    payouts: 'Bank, Paxum', 
    kyc: '24-72 Hours', 
    features: 'Basic Subscriptions',
    rating: 4 
  },
  { 
    name: 'Fansly', 
    fee: '20%', 
    payouts: 'Bank, Crypto, Paxum', 
    kyc: '12-48 Hours', 
    features: 'Tiered Subs',
    rating: 4.5 
  },
];

export const ComparisonTable = () => {
  return (
    <div className="overflow-x-auto my-8 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-900/50 text-white">
            <th className="p-4 border-b border-zinc-800 font-semibold">Platform</th>
            <th className="p-4 border-b border-zinc-800 font-semibold">Platform Fee</th>
            <th className="p-4 border-b border-zinc-800 font-semibold">KYC Speed</th>
            <th className="p-4 border-b border-zinc-800 font-semibold">Payout Methods</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((c) => (
            <tr key={c.name} className={`transition-colors ${c.name === 'OnlyCrave' ? 'bg-blue-900/10 hover:bg-blue-900/20' : 'hover:bg-zinc-900'}`}>
              <td className="p-4 border-b border-zinc-900 font-bold">
                {c.name} {c.name === 'OnlyCrave' && '🚀'}
              </td>
              <td className={`p-4 border-b border-zinc-900 ${c.name === 'OnlyCrave' ? 'text-green-400 font-bold' : 'text-gray-400'}`}>
                {c.fee}
              </td>
              <td className="p-4 border-b border-zinc-900 text-gray-300">{c.kyc}</td>
              <td className="p-4 border-b border-zinc-900 text-gray-300 text-sm">{c.payouts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

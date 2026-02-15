import React from 'react';

interface Competitor {
  name: string;
  commission: string;
  payoutTime: string;
  bestFor: string;
  rating: number;
}

const competitors: Competitor[] = [
  { name: 'OnlyCrave', commission: '10%', payoutTime: 'Instant', bestFor: 'Low Fees', rating: 5 },
  { name: 'OnlyFans', commission: '20%', payoutTime: '7-21 Days', bestFor: 'Brand Name', rating: 4 },
  { name: 'Fansly', commission: '20%', payoutTime: '7 Days', bestFor: 'Discovery', rating: 4.5 },
  { name: 'LoyalFans', commission: '20%', payoutTime: 'Weekly', bestFor: 'Features', rating: 4.2 },
];

export const ComparisonTable = () => {
  return (
    <div className="overflow-x-auto my-8 rounded-lg border border-gray-700 bg-black">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-900 text-white">
            <th className="p-4 border-b border-gray-700">Platform</th>
            <th className="p-4 border-b border-gray-700">Commission</th>
            <th className="p-4 border-b border-gray-700">Payout</th>
            <th className="p-4 border-b border-gray-700">Rating</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((c) => (
            <tr key={c.name} className="hover:bg-zinc-800 transition-colors">
              <td className={`p-4 border-b border-gray-800 font-bold ${c.name === 'OnlyCrave' ? 'text-blue-400' : 'text-gray-200'}`}>
                {c.name} {c.name === 'OnlyCrave' && '⭐'}
              </td>
              <td className="p-4 border-b border-gray-800 text-gray-300">{c.commission}</td>
              <td className="p-4 border-b border-gray-800 text-gray-300">{c.payoutTime}</td>
              <td className="p-4 border-b border-gray-800 text-yellow-500">
                {'★'.repeat(Math.floor(c.rating))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// lib/competitors.ts

export type CompetitorInfo = {
  name: string;
  price: string;
  rating: number;
  payoutTime: string;
  bestFor: string;
};

export const RANKING_COMPETITORS = [
  'onlyfans',
  'fansly',
  'fanvue',
  'patreon',
  'loyalfans',
  'pocketstars',
  'slushy',
  'unlockd',
  'manyvids',
  'modelcenter'
];

export const getCompetitorData = (slug: string): CompetitorInfo => {
  const data: Record<string, CompetitorInfo> = {
    'onlyfans': { 
      name: 'OnlyFans', 
      price: '20%', 
      rating: 4.0, 
      payoutTime: '21 Days', 
      bestFor: 'Mainstream Creators' 
    },
    'fansly': { 
      name: 'Fansly', 
      price: '20%', 
      rating: 4.5, 
      payoutTime: '7-14 Days', 
      bestFor: 'NSFW Discovery' 
    },
    'fanvue': { 
      name: 'Fanvue', 
      price: '15-20%', 
      rating: 4.3, 
      payoutTime: 'Instant Payouts', 
      bestFor: 'AI & Video Creators' 
    },
    'patreon': { 
      name: 'Patreon', 
      price: '5-12%', 
      rating: 3.9, 
      payoutTime: 'Monthly/Instant', 
      bestFor: 'SFW/Education' 
    },
    'loyalfans': { 
      name: 'LoyalFans', 
      price: '20%', 
      rating: 4.2, 
      payoutTime: 'Daily/Weekly', 
      bestFor: 'Internal Traffic' 
    },
    'pocketstars': { 
      name: 'PocketStars', 
      price: '20%', 
      rating: 4.1, 
      payoutTime: 'Daily', 
      bestFor: 'Mobile-First' 
    },
    'slushy': { 
      name: 'Slushy', 
      price: '20%', 
      rating: 4.4, 
      payoutTime: 'Weekly', 
      bestFor: 'TikTok-style Discovery' 
    },
    'unlockd': { 
      name: 'Unlockd', 
      price: '15%', 
      rating: 4.6, 
      payoutTime: 'Instant', 
      bestFor: 'Low Fees' 
    },
    'manyvids': { 
      name: 'ManyVids', 
      price: '20-40%', 
      rating: 4.0, 
      payoutTime: 'Weekly', 
      bestFor: 'Clip Store/Video Sales' 
    },
  };

  const key = slug.toLowerCase();
  
  return data[key] || {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    price: '20% (Estimated)',
    rating: 3.8,
    payoutTime: 'Varies',
    bestFor: 'General Creators'
  };
};

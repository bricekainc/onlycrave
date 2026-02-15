// lib/competitors.ts
export const RANKING_COMPETITORS = [
  'onlyfans',
  'fansly',
  'fanvue',
  'patreon',
  'exclu',
  'loyalfans',
  'pocketstars',
  'slushy'
];

export const getCompetitorData = (slug: string) => {
  const data: Record<string, any> = {
    'onlyfans': { name: 'OnlyFans', price: '20%', rating: 4.0 },
    'fansly': { name: 'Fansly', price: '20%', rating: 4.4 },
    // Add more specific data here as needed
  };
  
  return data[slug.toLowerCase()] || {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    price: '20% (Estimated)',
    rating: 3.8
  };
};

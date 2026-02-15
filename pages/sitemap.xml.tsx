import { GetServerSideProps } from 'next';
import { fetchCreators } from '../lib/fetchCreators';

const Sitemap = () => null;

// List of competitors you want Google to index specifically
const RANKING_COMPETITORS = [
  'onlyfans',
  'fansly',
  'fanvue',
  'patreon',
  'exclu',
  'loyalfans'
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const creators = await fetchCreators();
  const baseUrl = 'https://onlycrave.vercel.app';
  const currentDate = new Date().toISOString();

  // 1. Static Pages
  const staticPages = [
    { url: `${baseUrl}`, priority: '1.0', changefreq: 'daily' },
    { url: `${baseUrl}/alternatives`, priority: '0.9', changefreq: 'weekly' },
  ];

  // 2. Creator Pages
  const creatorPages = creators.map((creator: any) => ({
    url: `${baseUrl}/${creator.username}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  // 3. Comparison Pages (SEO Powerhouse)
  const comparisonPages = RANKING_COMPETITORS.map((slug) => ({
    url: `${baseUrl}/alternatives/${slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

  // Combine all pages
  const allPages = [...staticPages, ...creatorPages, ...comparisonPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages
        .map((page) => {
          return `
            <url>
              <loc>${page.url}</loc>
              <lastmod>${currentDate}</lastmod>
              <changefreq>${page.changefreq}</changefreq>
              <priority>${page.priority}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;

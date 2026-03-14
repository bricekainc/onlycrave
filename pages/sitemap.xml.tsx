import { GetServerSideProps } from 'next';
import { getCreators } from '../lib/getCreators';
import { RANKING_COMPETITORS } from '../lib/competitors';

const Sitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {

  // Detect domain dynamically
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = req.headers.host || 'onlycrave.com';
  const baseUrl = `${protocol}://${host}`;

  const currentDate = new Date().toISOString();

  let creators = [];
  try {
    creators = await getCreators();
  } catch (e) {
    console.error("Sitemap Creator Fetch Error:", e);
  }

  // Static URLs
  const staticUrls = [
    { loc: `${baseUrl}`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/alternatives`, priority: '0.9', changefreq: 'weekly' },
  ];

  // Creator profile URLs
  const creatorUrls = creators.map((c: any) => ({
    loc: `${baseUrl}/${c.username}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  // Competitor comparison pages
  const comparisonUrls = RANKING_COMPETITORS.map((slug) => ({
    loc: `${baseUrl}/alternatives/${slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  const allUrls = [...staticUrls, ...creatorUrls, ...comparisonUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls.map(url => `
      <url>
        <loc>${url.loc}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
      </url>
    `).join('')}
  </urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default Sitemap;

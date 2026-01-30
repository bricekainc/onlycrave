import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:thumbnail', 'thumbnail']]
  }
});

export async function getCreators() {
  const feed = await parser.parseURL('https://onlycrave.com/rss/creators/feed/');
  return feed.items.map(item => ({
    name: item.title?.split(' (@')[0] || 'Creator',
    username: item.title?.match(/@(\w+)/)?.[1] || '',
    link: item.link,
    description: item.contentSnippet?.split('Click here')[0].replace(/\n/g, ' ').trim() || '',
    avatar: (item as any).thumbnail?.$?.url || ''
  }));
}

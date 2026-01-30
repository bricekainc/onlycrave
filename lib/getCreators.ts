import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:thumbnail', 'thumbnail'], ['media:content', 'content']]
  }
});

export async function getCreators() {
  try {
    const feed = await parser.parseURL('https://onlycrave.com/rss/creators/feed/');
    return feed.items.map(item => {
      const usernameMatch = item.title?.match(/@(\w+)/);
      return {
        name: item.title?.split(' (@')[0] || 'Unknown Creator',
        username: usernameMatch ? usernameMatch[1] : '',
        link: item.link || '',
        description: item.contentSnippet?.split('Click here')[0].trim() || '',
        avatar: (item as any).thumbnail?.$?.url || 'https://onlycrave.com/public/uploads/settings/logo.png'
      };
    });
  } catch (error) {
    console.error("RSS Fetch Error:", error);
    return [];
  }
}

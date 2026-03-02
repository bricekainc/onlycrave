import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:thumbnail', 'thumbnail'], ['media:content', 'content']]
  }
});

export async function getCreators() {
  try {
    const feed = await parser.parseURL('https://onlycrave.com/rss/creators/feed/');
    
    // Explicitly typing 'item' as 'any' prevents TypeScript build failures on Vercel
    return (feed.items || []).map((item: any) => {
      const title = item.title || '';
      const usernameMatch = title.match(/@(\w+)/);
      
      return {
        name: title.split(' (@')[0] || 'Unknown Creator',
        username: usernameMatch ? usernameMatch[1] : '',
        link: item.link || '',
        description: item.contentSnippet?.split('Click here')[0].trim() || '',
        // Safe navigation for the thumbnail object
        avatar: item.thumbnail?.$?.url || 'https://onlycrave.com/public/img/home_index.svg'
      };
    });
  } catch (error) {
    // Return empty array so the build/page doesn't crash if the feed is momentarily unreachable
    console.error("RSS Fetch Error:", error);
    return [];
  }
}

import { NewsArticle } from '@/utils/utils';

// RSS feed configurations
export interface RssFeedConfig {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  maxArticles?: number;
}

// Default RSS feeds
export const DEFAULT_RSS_FEEDS: RssFeedConfig[] = [
  {
    id: 'sciencedaily-health',
    name: 'ScienceDaily Health',
    url: 'https://www.sciencedaily.com/rss/top/health.xml',
    enabled: true,
    maxArticles: 20
  },
  {
    id: 'who-news',
    name: 'WHO News',
    url: 'https://www.who.int/news/rss.xml',
    enabled: false,
    maxArticles: 15
  },
  {
    id: 'cdc-news',
    name: 'CDC News',
    url: 'https://tools.cdc.gov/api/v2/resources/media/132059.rss',
    enabled: false,
    maxArticles: 15
  }
];

// Use a working CORS proxy
const RSS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

/**
 * Generate a unique ID for RSS articles using URL hash
 */
const generateRssId = (url: string, feedId: string): string => {
  // Simple hash function to generate unique ID from URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `rss_${feedId}_${Math.abs(hash).toString(36)}`;
};

/**
 * Format RSS pubDate to match our date format
 */
const formatRssDate = (pubDate: string): string => {
  try {
    const date = new Date(pubDate);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting RSS date:', error);
    return new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

/**
 * Clean HTML entities from text
 */
const cleanHtmlEntities = (text: string): string => {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&trade;/g, '™');
};

/**
 * Parse RSS XML using regex (more robust for malformed XML)
 */
const parseRssXml = (xmlText: string, feedId: string): NewsArticle[] => {
  try {
    const articles: NewsArticle[] = [];
    
    // First, let's check if we have any items at all
    const itemCount = (xmlText.match(/<item>/gi) || []).length;
    console.log(`Found ${itemCount} <item> tags in ${feedId}`);
    
    if (itemCount === 0) {
      console.warn(`No <item> tags found in ${feedId}`);
      return [];
    }
    
    // Use regex to extract items from RSS feed
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;
    let itemIndex = 0;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      try {
        itemIndex++;
        const itemContent = match[1];
        
        console.log(`Processing item ${itemIndex} from ${feedId}`);
        
        // Extract title - handle both CDATA and regular content
        const titleMatch = itemContent.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i);
        const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';
        
        // Extract link - handle both CDATA and regular content
        const linkMatch = itemContent.match(/<link[^>]*><!\[CDATA\[(.*?)\]\]><\/link>|<link[^>]*>(.*?)<\/link>/i);
        const link = linkMatch ? (linkMatch[1] || linkMatch[2] || '').trim() : '';
        
        // Extract pubDate - handle both CDATA and regular content
        const pubDateMatch = itemContent.match(/<pubDate[^>]*><!\[CDATA\[(.*?)\]\]><\/pubDate>|<pubDate[^>]*>(.*?)<\/pubDate>/i);
        const pubDate = pubDateMatch ? (pubDateMatch[1] || pubDateMatch[2] || '').trim() : '';
        
        // Extract description - handle both CDATA and regular content
        const descMatch = itemContent.match(/<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i);
        const description = descMatch ? (descMatch[1] || descMatch[2] || '').trim() : '';
        
        // Debug logging
        console.log(`Item ${itemIndex} from ${feedId}:`, {
          title: title.substring(0, 50) + '...',
          link: link.substring(0, 50) + '...',
          pubDate: pubDate.substring(0, 30) + '...',
          description: description.substring(0, 50) + '...'
        });
        
        if (title && link) {
          articles.push({
            id: generateRssId(link, feedId),
            title: cleanHtmlEntities(title),
            date: formatRssDate(pubDate),
            url: link,
            description: cleanHtmlEntities(description) || 'No description available',
          });
        } else {
          console.warn(`Skipping item ${itemIndex} from ${feedId} - missing title or link:`, {
            hasTitle: !!title,
            hasLink: !!link,
            title: title.substring(0, 30),
            link: link.substring(0, 30)
          });
        }
      } catch (itemError) {
        console.warn(`Error parsing RSS item ${itemIndex} from ${feedId}:`, itemError);
      }
    }
    
    console.log(`Successfully parsed ${articles.length} articles from ${feedId}`);
    return articles;
  } catch (error) {
    console.error(`Error parsing RSS XML from ${feedId}:`, error);
    return [];
  }
};

/**
 * Fetch and parse a single RSS feed
 */
export const fetchSingleRssFeed = async (feedConfig: RssFeedConfig): Promise<{
  success: boolean;
  articles: NewsArticle[];
  error?: string;
  feedName: string;
}> => {
  try {
    console.log(`Fetching RSS feed: ${feedConfig.name} (${feedConfig.url})`);
    
    // Use our local proxy to fetch the RSS feed
    const proxyUrl = `${RSS_PROXY_URL}${encodeURIComponent(feedConfig.url)}`;
    
    // Fetch the RSS feed
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    
    if (!xmlText || xmlText.trim().length === 0) {
      return {
        success: false,
        articles: [],
        error: 'Empty RSS feed received',
        feedName: feedConfig.name
      };
    }
    
    // Parse the RSS XML
    const articles = parseRssXml(xmlText, feedConfig.id);
    
    if (articles.length === 0) {
      return {
        success: false,
        articles: [],
        error: 'No articles found in RSS feed',
        feedName: feedConfig.name
      };
    }
    
    // Limit articles if specified
    const limitedArticles = feedConfig.maxArticles 
      ? articles.slice(0, feedConfig.maxArticles)
      : articles;
    
    console.log(`Successfully fetched ${limitedArticles.length} articles from ${feedConfig.name}`);
    
    return {
      success: true,
      articles: limitedArticles,
      feedName: feedConfig.name
    };
    
  } catch (error) {
    console.error(`Failed to fetch RSS feed ${feedConfig.name}:`, error);
    return {
      success: false,
      articles: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      feedName: feedConfig.name
    };
  }
};

/**
 * Fetch multiple RSS feeds
 */
export const fetchMultipleRssFeeds = async (feedConfigs: RssFeedConfig[]): Promise<{
  articles: NewsArticle[];
  results: Array<{
    feedName: string;
    success: boolean;
    articleCount: number;
    error?: string;
  }>;
}> => {
  const enabledFeeds = feedConfigs.filter(feed => feed.enabled);
  
  if (enabledFeeds.length === 0) {
    return {
      articles: [],
      results: []
    };
  }
  
  // Fetch all feeds in parallel
  const results = await Promise.all(
    enabledFeeds.map(feed => fetchSingleRssFeed(feed))
  );
  
  // Combine all articles
  const allArticles = results
    .filter(result => result.success)
    .flatMap(result => result.articles);
  
  // Sort by date (newest first)
  allArticles.sort((a, b) => {
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    } catch {
      return 0;
    }
  });
  
  return {
    articles: allArticles,
    results: results.map(result => ({
      feedName: result.feedName,
      success: result.success,
      articleCount: result.articles.length,
      error: result.error
    }))
  };
};

/**
 * Legacy function for backward compatibility
 */
export const fetchRssNews = async (): Promise<NewsArticle[]> => {
  const scienceDailyFeed = DEFAULT_RSS_FEEDS.find(feed => feed.id === 'sciencedaily-health');
  if (!scienceDailyFeed) return [];
  
  const result = await fetchSingleRssFeed(scienceDailyFeed);
  return result.articles;
};

/**
 * Fetch both RSS and Contentful news and merge them
 */
export const fetchAllNews = async (
  contentfulNews: NewsArticle[],
  rssFeeds: RssFeedConfig[] = DEFAULT_RSS_FEEDS
): Promise<NewsArticle[]> => {
  try {
    // Fetch RSS articles
    const rssResult = await fetchMultipleRssFeeds(rssFeeds);
    
    // Combine both sources
    const allNews = [...contentfulNews, ...rssResult.articles];
    
    // Sort by date (newest first)
    allNews.sort((a, b) => {
      try {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      } catch {
        return 0;
      }
    });
    
    return allNews;
    
  } catch (error) {
    console.error('Error combining news sources:', error);
    // Return only Contentful news if RSS fails
    return contentfulNews;
  }
};
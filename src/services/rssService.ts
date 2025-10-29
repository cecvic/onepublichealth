import { NewsArticle } from '@/utils/utils';

// Cache configuration
const CACHE_KEY = 'rss_news_cache';
const CACHE_TIMESTAMP_KEY = 'rss_news_cache_timestamp';
const CACHE_EXPIRATION_MS = 30 * 60 * 1000; // 30 minutes

// RSS feed configurations
export interface RssFeedConfig {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  maxArticles?: number;
}

// Cache interface
interface CachedRssData {
  articles: NewsArticle[];
  timestamp: number;
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
    id: 'nih-healthit-news',
    name: 'NIH Health IT News',
    url: 'https://www.nlm.nih.gov/rss/healthitnews.rss',
    enabled: true,
    maxArticles: 15
  },
  {
    id: 'circulating-now',
    name: 'Circulating Now (NIH)',
    url: 'https://circulatingnow.nlm.nih.gov/feed/?_gl=1*oe5qky*_ga*MTMyMzk4MjI1OC4xNzYxNjc0NzA0*_ga_7147EPK006*czE3NjE2NzQ3MDQkbzEkZzEkdDE3NjE2NzUwNjYkajUyJGwwJGgw*_ga_P1FPTH9PL4*czE3NjE2NzQ3MDQkbzEkZzEkdDE3NjE2NzUwNjYkajUyJGwwJGgw',
    enabled: true,
    maxArticles: 15
  },
  {
    id: 'pmc-new-articles',
    name: 'PMC New Articles',
    url: 'https://pmc.ncbi.nlm.nih.gov/about/new-in-pmc.rss',
    enabled: true,
    maxArticles: 15
  },
  {
    id: 'medlineplus-news',
    name: 'MedlinePlus News',
    url: 'https://medlineplus.gov/xml/rss/news.xml',
    enabled: true,
    maxArticles: 15
  },
  {
    id: 'nlm-news',
    name: 'NLM News',
    url: 'https://www.nlm.nih.gov/rss/news.rss',
    enabled: true,
    maxArticles: 15
  }
];

// Use a working CORS proxy
const RSS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

/**
 * Generate a unique ID for RSS articles using URL hash
 */
const generateRssId = (url: string, feedId: string): string => {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
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
        
        console.log(`Item ${itemIndex}: title="${title}", link="${link}", pubDate="${pubDate}"`);
        
        if (title && link) {
          articles.push({
            id: generateRssId(link, feedId),
            title: cleanHtmlEntities(title),
            date: formatRssDate(pubDate),
            url: link,
            description: cleanHtmlEntities(description) || 'No description available',
          });
        } else {
          console.warn(`Item ${itemIndex} missing required fields: title="${title}", link="${link}"`);
        }
      } catch (itemError) {
        console.warn(`Error parsing RSS item ${itemIndex} from ${feedId}:`, itemError);
      }
    }
    
    console.log(`Successfully parsed ${articles.length} articles from ${feedId}`);
    return articles;
  } catch (error) {
    console.error(`Error parsing RSS XML for ${feedId}:`, error);
    return [];
  }
};

/**
 * Fetch RSS news from a single feed with retry logic
 */
export const fetchSingleRssFeed = async (feedConfig: RssFeedConfig): Promise<NewsArticle[]> => {
  try {
    console.log(`Fetching RSS feed: ${feedConfig.name} (${feedConfig.id})`);

    const proxyUrl = `${RSS_PROXY_URL}${encodeURIComponent(feedConfig.url)}`;

    // Use retry logic
    const response = await fetchWithRetry(proxyUrl, 2, 1000);

    const xmlText = await response.text();

    if (!xmlText || xmlText.trim().length === 0) {
      console.warn(`Empty RSS feed received for ${feedConfig.name}`);
      return [];
    }

    const articles = parseRssXml(xmlText, feedConfig.id);

    if (articles.length === 0) {
      console.warn(`No articles found in RSS feed for ${feedConfig.name}`);
      return [];
    }

    const limitedArticles = articles.slice(0, feedConfig.maxArticles || 20);

    console.log(`Successfully fetched ${limitedArticles.length} RSS articles from ${feedConfig.name}`);
    return limitedArticles;

  } catch (error) {
    console.error(`Failed to fetch RSS feed ${feedConfig.name}:`, error);
    return [];
  }
};

/**
 * Fetch RSS news from multiple feeds with caching
 */
export const fetchMultipleRssFeeds = async (
  feedConfigs: RssFeedConfig[],
  options: { useCache?: boolean; forceRefresh?: boolean } = {}
): Promise<NewsArticle[]> => {
  const { useCache = true, forceRefresh = false } = options;

  try {
    // If force refresh, clear cache
    if (forceRefresh) {
      clearRssCache();
    }

    // Try to get cached data first if caching is enabled
    if (useCache && !forceRefresh) {
      const cachedData = getCachedRssData();
      if (cachedData && cachedData.length > 0) {
        console.log(`Using cached RSS data (${cachedData.length} articles)`);
        return cachedData;
      }
    }

    console.log(`Fetching RSS feeds from ${feedConfigs.length} sources`);

    const enabledFeeds = feedConfigs.filter(feed => feed.enabled);
    console.log(`Enabled feeds: ${enabledFeeds.map(f => f.name).join(', ')}`);

    const fetchPromises = enabledFeeds.map(feed => fetchSingleRssFeed(feed));
    const results = await Promise.all(fetchPromises);

    const allArticles = results.flat();

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

    console.log(`Total RSS articles fetched: ${allArticles.length}`);

    // Cache the results if caching is enabled
    if (useCache && allArticles.length > 0) {
      setCachedRssData(allArticles);
    }

    return allArticles;

  } catch (error) {
    console.error('Error fetching multiple RSS feeds:', error);

    // On error, try to return cached data as fallback
    if (useCache) {
      const cachedData = getCachedRssData();
      if (cachedData) {
        console.log('Returning cached data as fallback');
        return cachedData;
      }
    }

    return [];
  }
};

/**
 * Check if cached data is still valid
 */
const isCacheValid = (): boolean => {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;

    const cacheAge = Date.now() - parseInt(timestamp, 10);
    return cacheAge < CACHE_EXPIRATION_MS;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

/**
 * Get cached RSS data
 */
export const getCachedRssData = (): NewsArticle[] | null => {
  try {
    if (!isCacheValid()) {
      return null;
    }

    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;

    const parsed: CachedRssData = JSON.parse(cachedData);
    console.log(`Loaded ${parsed.articles.length} articles from cache`);
    return parsed.articles;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Save RSS data to cache
 */
const setCachedRssData = (articles: NewsArticle[]): void => {
  try {
    const cacheData: CachedRssData = {
      articles,
      timestamp: Date.now()
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    console.log(`Cached ${articles.length} articles`);
  } catch (error) {
    console.error('Error writing cache:', error);
    // If cache is full, clear it and try again
    try {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ articles, timestamp: Date.now() }));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    } catch (retryError) {
      console.error('Failed to cache data after retry:', retryError);
    }
  }
};

/**
 * Clear RSS cache (useful for manual refresh)
 */
export const clearRssCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    console.log('RSS cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Get cache age in minutes
 */
export const getCacheAge = (): number | null => {
  try {
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (!timestamp) return null;

    const ageMs = Date.now() - parseInt(timestamp, 10);
    return Math.floor(ageMs / 60000); // Convert to minutes
  } catch (error) {
    console.error('Error getting cache age:', error);
    return null;
  }
};

/**
 * Fetch RSS news with retry logic
 */
const fetchWithRetry = async (
  url: string,
  maxRetries: number = 2,
  delayMs: number = 1000
): Promise<Response> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`Fetch attempt ${attempt + 1} failed:`, lastError.message);

      // Wait before retrying (except on last attempt)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error('Fetch failed after retries');
};

/**
 * Fetch RSS news (legacy function for backward compatibility)
 */
export const fetchRssNews = async (): Promise<NewsArticle[]> => {
  return fetchMultipleRssFeeds(DEFAULT_RSS_FEEDS);
};

/**
 * Fetch all news (Contentful + RSS) with caching
 */
export const fetchAllNews = async (
  contentfulNews: NewsArticle[],
  options: { useCache?: boolean; forceRefresh?: boolean } = {}
): Promise<NewsArticle[]> => {
  try {
    const rssNews = await fetchMultipleRssFeeds(DEFAULT_RSS_FEEDS, options);

    const allNews = [...contentfulNews, ...rssNews];

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
    return contentfulNews;
  }
};
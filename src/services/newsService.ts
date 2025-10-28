// src/services/newsService.ts
import client from "@/lib/contentful";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
  tags: string[];
  content?: string; // Rich text content from Contentful
}

export interface ContentfulNewsEntry {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    description: string;
    source: string;
    externalUrl?: string;
    coverImage?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    publishedDate: string;
    category: string;
    tags?: string[];
    content?: any; // Rich text content
  };
}

class NewsService {
  /**
   * Fetch all news articles from Contentful
   */
  async fetchNewsArticles(): Promise<NewsArticle[]> {
    try {
      const response = await client.getEntries({
        content_type: "newsArticle",
        order: "-fields.publishedDate",
        limit: 100, // Adjust based on your needs
      });

      return this.transformContentfulEntries(response.items as ContentfulNewsEntry[]);
    } catch (error) {
      console.error("Error fetching news articles from Contentful:", error);
      throw new Error("Failed to fetch news articles");
    }
  }

  /**
   * Fetch news articles by category
   */
  async fetchNewsByCategory(category: string): Promise<NewsArticle[]> {
    try {
      const response = await client.getEntries({
        content_type: "newsArticle",
        "fields.category": category,
        order: "-fields.publishedDate",
        limit: 100,
      });

      return this.transformContentfulEntries(response.items as ContentfulNewsEntry[]);
    } catch (error) {
      console.error(`Error fetching news articles for category ${category}:`, error);
      throw new Error(`Failed to fetch news articles for category: ${category}`);
    }
  }

  /**
   * Fetch a single news article by ID
   */
  async fetchNewsArticleById(id: string): Promise<NewsArticle | null> {
    try {
      const response = await client.getEntry(id);
      const entry = response as ContentfulNewsEntry;
      
      if (entry.fields) {
        return this.transformContentfulEntry(entry);
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching news article with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Search news articles by query
   */
  async searchNewsArticles(query: string): Promise<NewsArticle[]> {
    try {
      const response = await client.getEntries({
        content_type: "newsArticle",
        query: query,
        order: "-fields.publishedDate",
        limit: 50,
      });

      return this.transformContentfulEntries(response.items as ContentfulNewsEntry[]);
    } catch (error) {
      console.error(`Error searching news articles with query "${query}":`, error);
      throw new Error("Failed to search news articles");
    }
  }

  /**
   * Get all available categories from news articles
   */
  async getNewsCategories(): Promise<string[]> {
    try {
      const response = await client.getEntries({
        content_type: "newsArticle",
        select: "fields.category",
        limit: 1000,
      });

      const categories = new Set<string>();
      response.items.forEach((item: any) => {
        if (item.fields?.category) {
          categories.add(item.fields.category);
        }
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error("Error fetching news categories:", error);
      return [];
    }
  }

  /**
   * Transform Contentful entries to our NewsArticle interface
   */
  private transformContentfulEntries(entries: ContentfulNewsEntry[]): NewsArticle[] {
    return entries.map(entry => this.transformContentfulEntry(entry));
  }

  /**
   * Transform a single Contentful entry to our NewsArticle interface
   */
  private transformContentfulEntry(entry: ContentfulNewsEntry): NewsArticle {
    const imageUrl = entry.fields.coverImage?.fields?.file?.url 
      ? `https:${entry.fields.coverImage.fields.file.url}`
      : "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"; // Fallback image

    return {
      id: entry.sys.id,
      title: entry.fields.title,
      description: entry.fields.description,
      source: entry.fields.source,
      url: entry.fields.externalUrl || "#",
      imageUrl,
      publishedAt: entry.fields.publishedDate,
      category: entry.fields.category,
      tags: entry.fields.tags || [],
      content: entry.fields.content,
    };
  }
}

// Export a singleton instance
export const newsService = new NewsService();
export default newsService;




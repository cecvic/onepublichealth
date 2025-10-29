import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ExternalLink, Search, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { NewsArticle, mapNewsEntry } from "@/utils/utils";
import { createClient } from 'contentful';
import { fetchAllNews, getCacheAge, getFeedNameFromArticleId } from "@/services/rssService";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheAge, setCacheAge] = useState<number | null>(null);

  // Initialize Contentful client
  const client = createClient({
    space: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '',
    accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN || '',
  });

  // Load news articles with smart caching
  const loadNewsData = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch news articles from Contentful
      const response = await client.getEntries({
        content_type: 'news',
        order: ['-sys.createdAt'],
      });

      const contentfulArticles = response.items.map(mapNewsEntry);

      // Fetch and combine with RSS news (uses cache by default)
      const allArticles = await fetchAllNews(contentfulArticles, {
        useCache: true,
        forceRefresh
      });

      setNewsArticles(allArticles);
      setFilteredArticles(allArticles);

      // Update cache age
      const age = getCacheAge();
      setCacheAge(age);
    } catch (err) {
      console.error("Error loading news data:", err);
      setError("Failed to load news articles. Please try again later.");
      // Fallback to empty state
      setNewsArticles([]);
      setFilteredArticles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load - uses cache for instant display
  useEffect(() => {
    loadNewsData(false);

    // Background refresh if cache is old (> 5 minutes)
    const age = getCacheAge();
    if (age && age > 5) {
      console.log('Cache is old, refreshing in background');
      setTimeout(() => loadNewsData(true), 1000);
    }
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    loadNewsData(true);
  };

  useEffect(() => {
    let filtered = newsArticles;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  }, [searchQuery, newsArticles]);

  const formatDate = (dateString: string) => {
    // If it's already formatted (e.g., "22 October 2025"), return as is
    if (dateString && !dateString.includes('T') && !dateString.includes('-')) {
      return dateString;
    }
    // Otherwise parse and format
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Get article distribution by source
  const getArticleDistribution = () => {
    const distribution: { [key: string]: number } = {};

    newsArticles.forEach(article => {
      if (article.id.startsWith('rss_')) {
        const feedName = getFeedNameFromArticleId(article.id);
        distribution[feedName] = (distribution[feedName] || 0) + 1;
      } else {
        distribution['Contentful'] = (distribution['Contentful'] || 0) + 1;
      }
    });

    return distribution;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-blue to-brand-green">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
                Public Health <span className="text-brand-charcoal-dark">News</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Stay updated with the latest public health news, policies, and developments from across India
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white"
                disabled={loading}
              />
            </div>

            {/* Info Bar - Source Distribution & Refresh */}
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {!loading && newsArticles.length > 0 && (
                  <>
                    {Object.entries(getArticleDistribution()).map(([source, count]) => (
                      <Badge key={source} variant="outline" className="text-xs">
                        {source}: {count}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                {cacheAge !== null && !loading && (
                  <span className="text-xs text-muted-foreground">
                    Updated {cacheAge === 0 ? 'now' : `${cacheAge}m ago`}
                  </span>
                )}
                <Button
                  onClick={handleRefresh}
                  disabled={loading || refreshing}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">Loading news feed...</p>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Unable to Load News</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* News Feed - All Articles */}
        {!loading && !error && filteredArticles.length > 0 && (
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-foreground">News Feed</h2>
                <span className="text-sm text-muted-foreground ml-auto">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* News Feed List */}
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-brand-blue hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    {/* Header with date and source */}
                    <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(article.date)}</span>
                      </div>
                      {article.id.startsWith('rss_') && (
                        <>
                          <span className="text-gray-300">•</span>
                          <Badge variant="secondary" className="text-xs">
                            {getFeedNameFromArticleId(article.id)}
                          </Badge>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-brand-blue transition-colors leading-tight">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base text-gray-700 leading-relaxed mb-4 line-clamp-3">
                      {article.description}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center text-brand-blue text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Read full article</span>
                      <ExternalLink className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && filteredArticles.length === 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center py-12">
              <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No news found matching your criteria.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search or refresh to load new articles.
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default News;
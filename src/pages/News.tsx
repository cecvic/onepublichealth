import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ExternalLink, Search, Filter, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { NewsArticle, mapNewsEntry } from "@/utils/utils";
import { createClient } from 'contentful';
import { fetchAllNews, getCacheAge } from "@/services/rssService";

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

        {/* Search Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-b">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>

              {/* Refresh Button & Cache Info */}
              <div className="flex items-center gap-3">
                {cacheAge !== null && !loading && (
                  <span className="text-sm text-muted-foreground">
                    Updated {cacheAge === 0 ? 'just now' : `${cacheAge} min ago`}
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
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
                <p className="text-lg text-muted-foreground">Loading news articles...</p>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
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

        {/* Featured/Latest News - 2 Rows Grid Layout */}
        {!loading && !error && filteredArticles.length > 0 && (
          <section className="py-8 px-4 sm:px-6 lg:px-8 bg-brand-green-light">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-foreground">Latest Headlines</h2>
              </div>
              
              {/* Grid Layout - 2 rows with equal width and height */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.slice(0, 6).map((article) => (
                  <Card 
                    key={article.id}
                    className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <CardHeader className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(article.date)}
                        </span>
                        {article.id.startsWith('rss_') && (
                          <Badge variant="secondary" className="text-xs">
                            ScienceDaily
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg md:text-xl mb-3 hover:text-brand-blue transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-base mb-4 text-black line-clamp-3 flex-grow">
                        {article.description}
                      </CardDescription>
                      <div className="flex items-center justify-end mt-auto">
                        <Button variant="ghost" size="sm" className="gap-1">
                          Read Full News <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* News Grid - Remaining Articles */}
        {!loading && !error && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No news found matching your criteria.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search.
                  </p>
                </div>
              ) : filteredArticles.length > 6 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">More News</h2>
                    <span className="text-sm text-muted-foreground">
                      {filteredArticles.length - 6} more article{filteredArticles.length - 6 !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.slice(6).map((article) => (
                      <Card 
                        key={article.id} 
                        className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(article.date)}
                            {article.id.startsWith('rss_') && (
                              <Badge variant="secondary" className="text-xs ml-2">
                                ScienceDaily
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg hover:text-brand-blue transition-colors line-clamp-2">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3 text-black mt-2">
                            {article.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-end">
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                              Read Full News <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default News;
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ExternalLink, Search, Filter, TrendingUp, AlertCircle } from "lucide-react";
import { newsService, NewsArticle } from "@/services/newsService";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Load news articles from Contentful
  useEffect(() => {
    const loadNewsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch news articles and categories in parallel
        const [articles, categories] = await Promise.all([
          newsService.fetchNewsArticles(),
          newsService.getNewsCategories()
        ]);
        
        setNewsArticles(articles);
        setFilteredArticles(articles);
        setAvailableCategories(["All", ...categories]);
      } catch (err) {
        console.error("Error loading news data:", err);
        setError("Failed to load news articles. Please try again later.");
        // Fallback to empty state
        setNewsArticles([]);
        setFilteredArticles([]);
        setAvailableCategories(["All"]);
      } finally {
        setLoading(false);
      }
    };

    loadNewsData();
  }, []);

  useEffect(() => {
    let filtered = newsArticles;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, searchQuery, newsArticles]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
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

        {/* Search and Filter Section */}
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
                />
              </div>

              {/* Category Filter Buttons */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground hidden sm:block" />
                <div className="flex flex-wrap gap-2">
                  {availableCategories.slice(0, 5).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs sm:text-sm"
                      disabled={loading}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* All Categories */}
            <div className="mt-4 flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-brand-green hover:text-white transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
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

        {/* Featured/Latest News */}
        {!loading && !error && filteredArticles.length > 0 && (
          <section className="py-8 px-4 sm:px-6 lg:px-8 bg-brand-green-light">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-brand-green" />
                <h2 className="text-2xl font-bold text-foreground">Latest Headlines</h2>
              </div>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={filteredArticles[0].imageUrl}
                      alt={filteredArticles[0].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-brand-blue text-white">{filteredArticles[0].category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(filteredArticles[0].publishedAt)}
                      </span>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl mb-3 hover:text-brand-blue transition-colors">
                      {filteredArticles[0].title}
                    </CardTitle>
                    <CardDescription className="text-base mb-4 text-black">
                      {filteredArticles[0].description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {filteredArticles[0].tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Source: {filteredArticles[0].source}
                      </span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Read More <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </div>
              </Card>
            </div>
          </section>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory === "All" ? "All News" : `${selectedCategory} News`}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No articles found matching your criteria.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.slice(1).map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <Badge className="absolute top-3 right-3 bg-white/90 text-brand-blue">
                        {article.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(article.publishedAt)}
                      </div>
                      <CardTitle className="text-lg hover:text-brand-blue transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-black">
                        {article.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate">
                          {article.source}
                        </span>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          Read <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              )}
            </div>
          </section>
        )}

        {/* Contentful Setup Guide */}
        {!loading && !error && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted">
            <div className="max-w-4xl mx-auto">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-brand-charcoal">📰 Contentful News Setup</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">✅ Contentful Integration Complete</h4>
                    <p className="text-muted-foreground">
                      The news page is now connected to Contentful! You can add news articles manually through the Contentful dashboard.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📝 Content Model Required</h4>
                    <p className="text-muted-foreground mb-2">Create a content type called "newsArticle" with these fields:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                      <li><strong>title</strong> (Short text) - Article headline</li>
                      <li><strong>description</strong> (Long text) - Article summary</li>
                      <li><strong>source</strong> (Short text) - News source name</li>
                      <li><strong>externalUrl</strong> (Short text) - Link to full article</li>
                      <li><strong>coverImage</strong> (Media) - Article featured image</li>
                      <li><strong>publishedDate</strong> (Date & time) - Publication date</li>
                      <li><strong>category</strong> (Short text) - Article category</li>
                      <li><strong>tags</strong> (Short text, multiple) - Article tags</li>
                      <li><strong>content</strong> (Rich text, optional) - Full article content</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-brand-green-light rounded-lg mt-4">
                    <p className="text-sm">
                      <strong>Next Steps:</strong> 
                      <br />1. Create the "newsArticle" content type in Contentful
                      <br />2. Add your first news articles
                      <br />3. Publish them to see them appear on the news page
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default News;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Calendar, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Trash2,
  Settings,
  Rss
} from "lucide-react";
import { NewsArticle } from "@/utils/utils";
import { 
  RssFeedConfig, 
  DEFAULT_RSS_FEEDS, 
  fetchSingleRssFeed, 
  fetchMultipleRssFeeds 
} from "@/services/rssService";

const RssDebugPage = () => {
  const [rssFeeds, setRssFeeds] = useState<RssFeedConfig[]>(DEFAULT_RSS_FEEDS);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Array<{
    feedName: string;
    success: boolean;
    articleCount: number;
    error?: string;
  }>>([]);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedName, setNewFeedName] = useState('');
  const [rawXml, setRawXml] = useState<string>('');

  // Test all RSS feeds
  const testAllFeeds = async () => {
    setLoading(true);
    setResults([]);
    setArticles([]);
    
    try {
      const result = await fetchMultipleRssFeeds(rssFeeds);
      setArticles(result.articles);
      setResults(result.results);
    } catch (error) {
      console.error('Error testing RSS feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test a single RSS feed
  const testSingleFeed = async (feedConfig: RssFeedConfig) => {
    setLoading(true);
    
    try {
      const result = await fetchSingleRssFeed(feedConfig);
      
      // Update results for this specific feed
      setResults(prev => {
        const filtered = prev.filter(r => r.feedName !== feedConfig.name);
        return [...filtered, {
          feedName: result.feedName,
          success: result.success,
          articleCount: result.articles.length,
          error: result.error
        }];
      });
      
      if (result.success) {
        setArticles(prev => {
          // Remove existing articles from this feed
          const filtered = prev.filter(article => !article.id.startsWith(`rss_${feedConfig.id}_`));
          return [...filtered, ...result.articles].sort((a, b) => {
            try {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateB.getTime() - dateA.getTime();
            } catch {
              return 0;
            }
          });
        });
      }
    } catch (error) {
      console.error('Error testing single RSS feed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new RSS feed
  const addNewFeed = () => {
    if (!newFeedUrl.trim() || !newFeedName.trim()) return;
    
    const newFeed: RssFeedConfig = {
      id: `custom_${Date.now()}`,
      name: newFeedName.trim(),
      url: newFeedUrl.trim(),
      enabled: true,
      maxArticles: 20
    };
    
    setRssFeeds(prev => [...prev, newFeed]);
    setNewFeedUrl('');
    setNewFeedName('');
  };

  // Remove RSS feed
  const removeFeed = (feedId: string) => {
    setRssFeeds(prev => prev.filter(feed => feed.id !== feedId));
    setArticles(prev => prev.filter(article => !article.id.startsWith(`rss_${feedId}_`)));
    setResults(prev => prev.filter(result => {
      const feed = rssFeeds.find(f => f.id === feedId);
      return feed ? result.feedName !== feed.name : true;
    }));
  };

  // Toggle feed enabled status
  const toggleFeedEnabled = (feedId: string) => {
    setRssFeeds(prev => prev.map(feed => 
      feed.id === feedId ? { ...feed, enabled: !feed.enabled } : feed
    ));
  };

  // Fetch raw XML for debugging
  const fetchRawXml = async (feedConfig: RssFeedConfig) => {
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedConfig.url)}`;
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        const xmlText = await response.text();
        setRawXml(xmlText);
      } else {
        setRawXml(`Error: HTTP ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setRawXml(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
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
                RSS Feed <span className="text-brand-charcoal-dark">Debugger</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Test and debug RSS feed integrations for your news section
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* RSS Feed Configuration */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    RSS Feed Configuration
                  </CardTitle>
                  <CardDescription>
                    Manage and test your RSS feeds
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Add New Feed */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Add New Feed</h4>
                    <Input
                      placeholder="Feed Name (e.g., BBC Health)"
                      value={newFeedName}
                      onChange={(e) => setNewFeedName(e.target.value)}
                    />
                    <Input
                      placeholder="RSS URL (e.g., https://feeds.bbci.co.uk/news/health/rss.xml)"
                      value={newFeedUrl}
                      onChange={(e) => setNewFeedUrl(e.target.value)}
                    />
                    <Button onClick={addNewFeed} className="w-full" disabled={!newFeedName.trim() || !newFeedUrl.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feed
                    </Button>
                  </div>

                  {/* Feed List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Configured Feeds</h4>
                    {rssFeeds.map((feed) => (
                      <div key={feed.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Rss className="h-4 w-4" />
                            <span className="font-medium text-sm">{feed.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFeedEnabled(feed.id)}
                              className={feed.enabled ? "text-green-600" : "text-gray-400"}
                            >
                              {feed.enabled ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFeed(feed.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{feed.url}</p>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testSingleFeed(feed)}
                            disabled={loading}
                            className="flex-1"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Test
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fetchRawXml(feed)}
                            className="flex-1"
                          >
                            Raw XML
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Test All Button */}
                  <Button 
                    onClick={testAllFeeds} 
                    disabled={loading}
                    className="w-full"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Test All Feeds
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results and Articles */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Feed Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Feed Test Results</CardTitle>
                  <CardDescription>
                    Status of RSS feed tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No tests run yet. Click "Test All Feeds" to start.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {results.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {result.success ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-600" />
                            )}
                            <div>
                              <p className="font-medium">{result.feedName}</p>
                              {result.error && (
                                <p className="text-sm text-red-600">{result.error}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? `${result.articleCount} articles` : 'Failed'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Articles */}
              <Card>
                <CardHeader>
                  <CardTitle>Fetched Articles ({articles.length})</CardTitle>
                  <CardDescription>
                    Articles successfully parsed from RSS feeds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {articles.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No articles fetched yet. Test some RSS feeds to see articles here.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {articles.map((article) => (
                        <div key={article.id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                {article.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {article.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(article.date)}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {article.id.split('_')[1]}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(article.url, '_blank')}
                              className="ml-4"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Raw XML Viewer */}
              {rawXml && (
                <Card>
                  <CardHeader>
                    <CardTitle>Raw XML Response</CardTitle>
                    <CardDescription>
                      Raw XML from the RSS feed for debugging
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={rawXml}
                      readOnly
                      className="min-h-[300px] font-mono text-xs"
                      placeholder="Raw XML will appear here..."
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RssDebugPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import client from "@/lib/contentful";
import { mapNewsEntry, NewsArticle } from "@/utils/utils";

const LatestNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await client.getEntries({
          content_type: "news",
          limit: 3,
          order: ["-sys.createdAt"]
        });
        
        const mapped = res.items.map(mapNewsEntry);
        setNews(mapped);
      } catch (err) {
        console.error("Error fetching latest news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

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

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Latest News</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // Don't render the section if there are no news articles
  if (!news || news.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Latest News</h2>
        <Link to="/news">
          <Button variant="link" className="p-0 text-brand-primary flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {news.map((article, index) => (
          <Card key={article.id} className="group relative p-6 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 transform hover:-translate-y-1">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="block">
            

              {/* Title with enhanced styling */}
              <h3 className="font-bold text-lg text-foreground transition-colors duration-200 line-clamp-2 leading-tight mb-3">
                {article.title}
              </h3>

              {/* Description with better typography */}
              <p className="mb-4 line-clamp-3 text-sm text-foreground leading-relaxed">
                {article.description}
              </p>

              {/* Enhanced News Meta with better layout */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {/* Date Display */}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">{formatDate(article.date)}</span>
                  </div>
                </div>

                {/* Read Full Article Button */}
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1">
                    Read Article
                    <ExternalLink className="w-3 h-3" />
                  </Badge>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LatestNews;
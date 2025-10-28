import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import client from "@/lib/contentful";
import { mapResourceEntry, Resource } from "@/utils/utils";

const LatestResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestResources = async () => {
      try {
        const res = await client.getEntries({
          content_type: "resources",
          limit: 3,
          order: ["-sys.createdAt"]
        });
        
        const mapped = res.items.map(mapResourceEntry);
        setResources(mapped);
      } catch (err) {
        console.error("Error fetching latest resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResources();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Latest Resources</h2>
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

  // Don't render the section if there are no resources
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Latest Resources</h2>
        <Link to="/resources">
          <Button variant="link" className="p-0 text-brand-primary flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {resources.map((resource, index) => (
          <Card key={resource.id} className="group relative p-6 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-green-100 transition-all duration-300 transform hover:-translate-y-1">
            <Link to={`/resources/${resource.id}`} className="block">
              {/* NEW Badge - only for the first (latest) resource */}
              {index === 0 && (
                <div className="absolute -top-0 -right-0 z-10">
                  <div className="relative">
                    {/* Red triangle background */}
                    <div className="w-0 h-0 border-l-[0px] border-r-[60px] border-b-[60px] border-r-red-500 border-b-transparent"></div>
                    {/* NEW text */}
                    <span className="absolute top-3 right-2 text-white text-xs font-bold transform rotate-45 origin-center">
                      NEW
                    </span>
                  </div>
                </div>
              )}

              {/* Title with enhanced styling */}
              <h3 className="font-bold text-lg text-foreground transition-colors duration-200 line-clamp-2 leading-tight">
                {resource.title}
              </h3>

              {/* Description with better typography */}
              <p className="mb-4 line-clamp-3 text-sm text-foreground leading-relaxed">
                {resource.description}
              </p>

              {/* Enhanced Tags Section */}
              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge
                    key={tag}
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-200 hover:scale-105 ${tagIndex === 0
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                      }`}
                  >
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 3 && (
                  <Badge className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-full">
                    +{resource.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Enhanced Resource Meta with better layout */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {/* Read Time Display */}
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{resource.readTime}</span>
                  </div>
                </div>

                {/* Author section with avatar placeholder */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {resource.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="font-semibold text-green-800 text-sm m-3">{resource.author}</p>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LatestResources;
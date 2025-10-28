import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronUp, MessageCircle, Clock, Star } from "lucide-react";
import client from "@/lib/contentful";
import { mapResourceEntry, Resource } from "@/utils/utils";

// Extend Resource type to match the UI expectations
type ResourceWithMeta = Resource & {
  comments: number;
  rating: number;
  ratingCount: number;
};

const Resources = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [posts, setPosts] = useState<ResourceWithMeta[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ResourceWithMeta[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await client.getEntries({ content_type: "resources" });
        const mapped: ResourceWithMeta[] = res.items.map((item: any) => {
          const resource = mapResourceEntry(item);
          
          // Add placeholder values for UI compatibility (resources don't have comments/ratings)
          return {
            ...resource,
            comments: 0,
            rating: 0,
            ratingCount: 0
          };
        });

        setPosts(mapped);
        setFilteredPosts(mapped);

        // Collect categories dynamically from tags
        const allCats = Array.from(new Set(mapped.flatMap((p) => p.tags)));
        setCategories(["All Categories", ...allCats]);
      } catch (err) {
        console.error("Error fetching Contentful data:", err);
      }
    };

    fetchData();
  }, []);

  // Handle tag filtering from URL parameters
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam && posts.length > 0) {
      setSelectedCategory(tagParam);
      setFilteredPosts(posts.filter((post) => post.tags.includes(tagParam)));
    }
  }, [searchParams, posts]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All Categories") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.tags.includes(category)));
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
                Resources & <span className="text-brand-charcoal-dark">Insights</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Stay informed with evidence-based research and best practices in public health
              </p>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredPosts.map((post) => {
                return (
                  <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
                    <Link to={`/resources/${post.id}`} className="block">
                      <h2 className="text-xl font-semibold text-foreground mb-3 hover:text-brand-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {post.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-secondary text-secondary-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Post Meta */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          {post.rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span>{post.rating}</span>
                              <span className="text-xs">({post.ratingCount})</span>
                            </div>
                          )}
                          {post.comments > 0 && (
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments} comments</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">{post.author}</p>
                          <p>{post.publishedAt}</p>
                        </div>
                      </div>
                    </Link>
                  </Card>
                );
              })}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No articles found for the selected category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Resources;
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { ChevronUp, MessageCircle, Clock, ArrowLeft, Share2, Bookmark, Star } from "lucide-react";
import client from "@/lib/contentful";
import { mapResourceEntry, Resource } from "@/utils/utils";
import StarRating from "@/components/ui/star-rating-props";
import CommentSystem, { Comment as CommentType } from "@/components/CommentSystem";
import commentService from "@/services/commentService";

// Extended Resource type to match UI expectations
type ResourceWithMeta = Resource & {
  excerpt: string;
  category?: string;
  content: string;
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ResourceWithMeta | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<ResourceWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Enhanced comment-related state
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [blogRating, setBlogRating] = useState<number>(0);

  // Enhanced helper functions using the comment service
  const getCommentStats = () => commentService.getCommentStats(comments);
  const getOverallRating = () => getCommentStats().averageRating;
  const getTotalRatings = () => getCommentStats().totalRatings;
  const getTotalCommentCount = () => getCommentStats().totalComments + getCommentStats().totalReplies;

  // Enhanced comment fetching using the service
  const fetchComments = async (postId: string) => {
    try {
      const { comments: commentsData, blogRating: rating } = await commentService.fetchComments(postId);
      setComments(commentsData);
      setBlogRating(rating);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Enhanced comment submission using the service
  const handleCommentSubmit = async (comment: Omit<CommentType, 'id' | 'updatedTime' | 'replies'>) => {
    setIsSubmittingComment(true);
    try {
      const updatedComments = await commentService.addComment(id!, comment);
      setComments(updatedComments);
      
      // Update blog rating based on new comments
      const stats = commentService.getCommentStats(updatedComments);
      setBlogRating(stats.averageRating);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Enhanced reply submission using the service
  const handleReplySubmit = async (
    commentIndex: number,
    replyPath: number[],
    name: string,
    content: string
  ) => {
    try {
      const reply = { name, content };
      const updatedComments = await commentService.addReply(id!, commentIndex, replyPath, reply);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  // Enhanced like handler using the service
  const handleLike = async (commentIndex: number, replyPath?: number[]) => {
    try {
      const updatedComments = await commentService.toggleLike(id!, commentIndex, replyPath);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  // Enhanced report handler using the service
  const handleReport = async (commentIndex: number, replyPath?: number[]) => {
    try {
      const updatedComments = await commentService.reportComment(id!, commentIndex, replyPath);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error reporting comment:', error);
      throw error;
    }
  };

  // Toggle comment section
  const handleCommentClick = () => {
    if (!showComments) {
      setShowComments(true);
      if (comments.length === 0) {
        fetchComments(id!);
      }
    } else {
      setShowComments(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await client.getEntries({ content_type: "resources" });
        const allPosts: ResourceWithMeta[] = res.items.map((item: any) => {
          const resource = mapResourceEntry(item);
          
          // Map resource fields to match UI expectations
          return {
            ...resource,
            excerpt: resource.description,
            category: resource.tags[0] || "General", // Use first tag as category
            content: resource.detailDescription,
          };
        });

        const currentPost = allPosts.find(p => p.id === id);

        if (currentPost) {
          setPost(currentPost);
          await fetchComments(id!);

          // Find related posts based on tags
          const related = allPosts
            .filter(p => p.id !== currentPost.id && 
              p.tags.some(tag => currentPost.tags.includes(tag))
            )
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching Contentful data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Link to="/resources">
              <Button variant="primary">Back to Resources</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Back Navigation */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/resources"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Link>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div>
              {post.category && (
                <Badge
                  variant="secondary"
                  className="mb-4 bg-brand-primary text-white hover:bg-brand-primary/90"
                >
                  {post.category}
                </Badge>
              )}
              <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>
              
              {getOverallRating() > 0 && (
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center space-x-1">
                    <StarRating rating={getOverallRating()} readonly={true} size="md" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Based on {getTotalRatings()} rating{getTotalRatings() !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {post.excerpt}
              </p>
              
              {blogRating > 0 && (
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-sm font-medium text-foreground">Article Rating:</span>
                  <StarRating rating={blogRating} readonly={true} size="md" />
                  <span className="text-sm text-muted-foreground">
                    Based on {comments.filter(c => c.rating && c.rating > 0).length} reviews
                  </span>
                </div>
              )}
            </div>

            {/* Article Meta */}
            <div className="pb-8 border-b border-border">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="font-semibold text-foreground">{post.author}</p>
                  <p className="text-sm text-muted-foreground">{post.publishedAt}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                  {getOverallRating() > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{getOverallRating()}</span>
                      <span className="text-xs">({getTotalRatings()})</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{getTotalCommentCount()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground leading-relaxed space-y-6">
                <div className="prose prose-lg prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground [&_p]:mb-6 [&_p]:leading-relaxed">
                  {/* Format plain text content with proper paragraphs */}
                  {post.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 leading-relaxed">{paragraph}</p>
                  ))}
                </div>

                {post.keyConsiderations && (
                  <>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Key Considerations</h2>
                    <div className="prose prose-lg prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:text-foreground [&_li]:text-foreground [&_li]:leading-relaxed [&_li_p]:inline [&_li_p]:m-0">
                      {/* Format key considerations */}
                      {post.keyConsiderations.split('\n').map((line, index) => {
                        if (line.trim().startsWith('-')) {
                          return <li key={index} className="text-foreground leading-relaxed">{line.trim().substring(1).trim()}</li>;
                        } else if (line.trim()) {
                          return <p key={index} className="mb-4">{line}</p>;
                        }
                        return null;
                      })}
                    </div>
                  </>
                )}

                {post.futureDirections && (
                  <>
                    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Future Directions</h2>
                    <div className="prose prose-lg prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                      {/* Format future directions */}
                      {post.futureDirections.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
              <span className="text-sm font-medium text-foreground mr-3">Tags:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/resources?tag=${encodeURIComponent(tag)}`}
                  className="inline-block"
                >
                  <Badge
                    variant="secondary"
                    className="bg-secondary text-secondary-foreground hover:bg-brand-primary hover:text-white cursor-pointer transition-colors"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Engagement Actions */}
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
              <div className="flex items-center space-x-4">
                {getOverallRating() > 0 && (
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
                    {getOverallRating()} ({getTotalRatings()})
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCommentClick}
                  className={showComments ? "bg-brand-primary text-white" : ""}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comment ({getTotalCommentCount()})
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Enhanced Comments Section */}
            {showComments && (
              <CommentSystem
                comments={comments}
                onCommentSubmit={handleCommentSubmit}
                onReplySubmit={handleReplySubmit}
                onLike={handleLike}
                onReport={handleReport}
                isSubmitting={isSubmittingComment}
                showRating={true}
                maxDepth={5}
              />
            )}
          </div>
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="p-4 hover:shadow-md transition-shadow">
                    <Link to={`/resources/${relatedPost.id}`}>
                      <h3 className="font-semibold text-foreground mb-2 hover:text-brand-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{relatedPost.author}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default BlogPost;
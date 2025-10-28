import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Building2,
  ArrowLeft,
  Globe,
  Briefcase,
  ExternalLink,
  Star,
  Users
} from "lucide-react";
import StarRating from "@/components/ui/star-rating-props";
import CommentSystem, { Comment as CommentType } from "@/components/CommentSystem";
import organizationReviewService from "@/services/organizationReviewService";

interface Organization {
  id: string;
  name: string;
  category: string;
  description: string;
  careersUrl: string;
  extraInfo: Record<string, string>;
}

const OrganizationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Review-related state
  const [reviews, setReviews] = useState<CommentType[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [organizationRating, setOrganizationRating] = useState<number>(0);

  // Helper functions
  const getReviewStats = () => organizationReviewService.getReviewStats(reviews);
  const getOverallRating = () => getReviewStats().averageRating;
  const getTotalRatings = () => getReviewStats().totalRatings;
  const getTotalReviews = () => getReviewStats().totalReviews;

  // Fetch reviews
  const fetchReviews = async (organizationId: string) => {
    try {
      const { reviews: reviewsData, averageRating: rating } = await organizationReviewService.fetchReviews(organizationId);
      setReviews(reviewsData);
      setOrganizationRating(rating);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (comment: Omit<CommentType, 'id' | 'updatedTime' | 'replies'>) => {
    setIsSubmittingReview(true);
    try {
      const updatedReviews = await organizationReviewService.addReview(id!, comment);
      setReviews(updatedReviews);

      const stats = organizationReviewService.getReviewStats(updatedReviews);
      setOrganizationRating(stats.averageRating);
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (
    reviewIndex: number,
    replyPath: number[],
    name: string,
    content: string
  ) => {
    try {
      const reply = { name, content };
      const updatedReviews = await organizationReviewService.addReply(id!, reviewIndex, replyPath, reply);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  // Handle like
  const handleLike = async (commentIndex: number, replyPath?: number[]) => {
    try {
      const updatedReviews = await organizationReviewService.toggleLike(id!, commentIndex, replyPath);
      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  // Fetch organization data
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/organizations.json');
        const data = await response.json();
        const foundOrg = data.find((org: Organization) => org.id === id);
        
        if (!foundOrg) {
          setError(true);
          return;
        }
        
        setOrganization(foundOrg);
        
        // Fetch reviews for this organization
        await fetchReviews(id!);
      } catch (err) {
        console.error('Error fetching organization:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrganization();
    }
  }, [id]);

  // Render stars helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-lg text-black ml-2 font-bold">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
              <p className="text-black">Loading organization details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !organization) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black mb-4">Organization Not Found</h1>
              <p className="text-black mb-6">The organization you're looking for doesn't exist.</p>
              <Link to="/organizations">
                <Button variant="primary">Back to Organizations</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <section className="px-4 sm:px-6 lg:px-8 py-4 border-b bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/organizations"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Organizations
            </Link>
          </div>
        </section>

        {/* Organization Header */}
        <section className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Organization Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-brand-blue to-brand-green rounded-xl">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {organization.name}
                    </h1>
                    <Badge variant="outline" className="text-sm">
                      {organization.category}
                    </Badge>
                  </div>
                </div>

                {/* Rating Display */}
                {organizationRating > 0 && (
                  <div className="mb-6">
                    {renderStars(organizationRating)}
                    <span className="text-sm text-black">
                      Based on {getTotalRatings()} rating{getTotalRatings() !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Description */}
                <Card className="p-6 mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3">About</h3>
                  <p className="text-black leading-relaxed">
                    {organization.description}
                  </p>
                </Card>

                {/* Extra Information */}
                {Object.keys(organization.extraInfo).length > 0 && (
                  <Card className="p-6 mb-6">
                    <h3 className="text-lg font-semibold text-black mb-3">Additional Information</h3>
                    <div className="space-y-3">
                      {Object.entries(organization.extraInfo).map(([key, value]) => (
                        <div key={key} className="border-b pb-3 last:border-b-0">
                          <span className="font-semibold text-black">{key}:</span>
                          <p className="text-black mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {organization.careersUrl && (
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => window.open(organization.careersUrl, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <Briefcase className="w-5 h-5" />
                      View Career Opportunities
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowReviews(!showReviews)}
                    className="flex items-center gap-2"
                  >
                    <Star className="w-5 h-5" />
                    {showReviews ? 'Hide Reviews' : 'View Reviews'}
                    <span className="ml-1">({getTotalReviews()})</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        {showReviews && (
          <section className="px-4 sm:px-6 lg:px-8 py-12 border-t">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-black mb-6">Reviews</h2>
              <CommentSystem
                comments={reviews}
                onSubmit={handleReviewSubmit}
                onReply={handleReplySubmit}
                onLike={handleLike}
                isSubmitting={isSubmittingReview}
                allowRating={true}
                entityName={organization.name}
              />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default OrganizationDetail;


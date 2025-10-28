import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building2, Search, ExternalLink, Globe, Users, MapPin, Briefcase, Star, MessageCircle, X } from "lucide-react";
import organizationReviewService from "@/services/organizationReviewService";

interface Organization {
  id: string;
  name: string;
  category: string;
  description: string;
  careersUrl: string;
  extraInfo: Record<string, string>;
}

const Organizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All Categories");
  const [sortBy, setSortBy] = useState("name"); // name, category
  const [organizationStats, setOrganizationStats] = useState<Record<string, { averageRating: number; totalRatings: number; totalReviews: number }>>({});
  
  // Review form state
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 0,
    content: ""
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const categories = [
    "All Categories",
    "Corporate Consulting",
    "Implementation Organizations", 
    "Research & Academic",
    "International Organizations"
  ];

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "category", label: "Category" }
  ];

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/data/organizations.json');
        const data = await response.json();
        setOrganizations(data);
        setFilteredOrganizations(data);
        
        // Load organization stats
        const stats = organizationReviewService.getAllOrganizationsStats();
        setOrganizationStats(stats);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setOrganizations([]);
        setFilteredOrganizations([]);
      }
    };

    fetchOrganizations();
  }, []);

  // Filter and sort organizations
  useEffect(() => {
    let filtered = organizations.filter((org) => {
      // Search filter
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      let matchesCategory = true;
      if (selectedCategoryFilter !== "All Categories") {
        matchesCategory = org.category === selectedCategoryFilter;
      }
      
      return matchesSearch && matchesCategory;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredOrganizations(filtered);
  }, [organizations, searchTerm, selectedCategoryFilter, sortBy]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategoryFilter(category);
  };

  // Review form handlers
  const openReviewForm = (orgId: string) => {
    setShowReviewForm(orgId);
    setReviewForm({ name: "", rating: 0, content: "" });
  };

  const closeReviewForm = () => {
    setShowReviewForm(null);
    setReviewForm({ name: "", rating: 0, content: "" });
  };

  const handleReviewSubmit = async (orgId: string) => {
    if (!reviewForm.name.trim() || !reviewForm.content.trim() || reviewForm.rating === 0) {
      alert("Please fill in all fields and select a rating");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await organizationReviewService.addReview(orgId, {
        name: reviewForm.name.trim(),
        content: reviewForm.content.trim(),
        rating: reviewForm.rating
      });

      // Refresh stats
      const stats = organizationReviewService.getAllOrganizationsStats();
      setOrganizationStats(stats);
      
      closeReviewForm();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error('Error submitting review:', error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Corporate Consulting":
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case "Implementation Organizations":
        return <Building2 className="w-5 h-5 text-green-600" />;
      case "Research & Academic":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "International Organizations":
        return <Globe className="w-5 h-5 text-orange-600" />;
      default:
        return <Building2 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Corporate Consulting":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Implementation Organizations":
        return "bg-green-50 text-green-700 border-green-200";
      case "Research & Academic":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "International Organizations":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-black ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
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
                Public Health <span className="text-brand-charcoal-dark">Organizations</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Explore employment opportunities at leading public health organizations, consulting firms, research institutes, and international agencies across India
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Controls */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filter Controls */}
            <div className="space-y-4 mb-8">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Category Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategoryFilter === category ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryFilter(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-brand-primary focus:border-transparent text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredOrganizations.length}</span> of <span className="font-semibold text-foreground">{organizations.length}</span> organizations
                </p>
                {(searchTerm || selectedCategoryFilter !== "All Categories") && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchTerm && `Search: "${searchTerm}"`}
                    {searchTerm && selectedCategoryFilter !== "All Categories" && " • "}
                    {selectedCategoryFilter !== "All Categories" && `Filter: ${selectedCategoryFilter}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Organizations Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredOrganizations.map((org) => (
                <Card key={org.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    {/* Header with name and category */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getCategoryIcon(org.category)}
                        </div>
                        <div className="flex-1">
                          <Link to={`/organizations/${org.id}`}>
                            <h2 className="text-xl font-semibold text-foreground hover:text-brand-primary transition-colors">
                              {org.name}
                            </h2>
                          </Link>
                          <Badge 
                            variant="outline" 
                            className={`mt-1 ${getCategoryColor(org.category)}`}
                          >
                            {org.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Rating Display */}
                      {organizationStats[org.id]?.averageRating > 0 && (
                        <div className="flex flex-col items-center bg-yellow-50 px-3 py-2 rounded-lg">
                          {renderStars(organizationStats[org.id].averageRating)}
                          <span className="text-xs text-black">
                            {organizationStats[org.id].totalRatings} reviews
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-black leading-relaxed">
                      {org.description}
                    </p>

                    {/* Extra Information */}
                    {Object.keys(org.extraInfo).length > 0 && (
                      <div className="space-y-2">
                        {Object.entries(org.extraInfo).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium text-black">{key}:</span>
                            <span className="text-black ml-2">{value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {/* Add Review Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewForm(org.id)}
                        className="flex items-center space-x-1"
                      >
                        <Star className="w-4 h-4" />
                        <span>Rate & Review</span>
                      </Button>

                      {/* View Details Button */}
                      <Link to={`/organizations/${org.id}`}>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>View Reviews</span>
                        </Button>
                      </Link>

                      {/* Careers Link */}
                      {org.careersUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(org.careersUrl, '_blank')}
                          className="flex items-center space-x-1"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>View Careers</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm === org.id && (
                      <Card className="p-4 bg-gray-50 border-2 border-brand-primary">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-black">Add Your Review</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={closeReviewForm}
                              className="p-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-black mb-2 block">Your Name</label>
                            <Input
                              value={reviewForm.name}
                              onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                              placeholder="Enter your name"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-black mb-2 block">Rating</label>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-6 h-6 cursor-pointer ${
                                    star <= reviewForm.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300 hover:text-yellow-300"
                                  }`}
                                  onClick={() => setReviewForm({...reviewForm, rating: star})}
                                />
                              ))}
                              <span className="text-sm text-black ml-2">
                                {reviewForm.rating > 0 ? `${reviewForm.rating} star${reviewForm.rating !== 1 ? 's' : ''}` : 'Select rating'}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-black mb-2 block">Your Review</label>
                            <Textarea
                              value={reviewForm.content}
                              onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}
                              placeholder="Share your experience with this organization..."
                              className="w-full min-h-[80px]"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleReviewSubmit(org.id)}
                              disabled={isSubmittingReview}
                              className="flex-1"
                            >
                              {isSubmittingReview ? "Submitting..." : "Submit Review"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={closeReviewForm}
                              disabled={isSubmittingReview}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* No Results State */}
            {filteredOrganizations.length === 0 && organizations.length > 0 && (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-50 rounded-full inline-block mb-4">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-black text-lg mb-2">
                  No organizations found
                </p>
                <p className="text-sm text-black mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategoryFilter("All Categories");
                    setSortBy("name");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Loading State */}
            {organizations.length === 0 && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
                <p className="text-black">Loading organizations...</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Organizations;

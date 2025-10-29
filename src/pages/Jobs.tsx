import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Clock, 
  MapPin, 
  Building2, 
  Users, 
  ExternalLink, 
  Calendar, 
  Briefcase, 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  Star,
  DollarSign,
  Award,
  Filter
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RawJobService, UnifiedJob } from '@/services/rawJobService';

const RawJobs = () => {
  const [jobs, setJobs] = useState<UnifiedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<UnifiedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.function?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.industries?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by location
    if (selectedLocation !== "all") {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Filter by job type
    if (selectedJobType !== "all") {
      filtered = filtered.filter(job =>
        job.jobType?.toLowerCase().includes(selectedJobType.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedLocation, selectedJobType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allJobs = await RawJobService.loadAllJobs();
      setJobs(allJobs);
      setFilteredJobs(allJobs);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load job listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchJobs();
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'indeed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'linkedin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'glassdoor':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'icmr':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'whatjobs':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'devnet':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'sams':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'unjobs':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'indeed':
        return '🔍';
      case 'linkedin':
        return '💼';
      case 'glassdoor':
        return '🏢';
      case 'icmr':
        return '🏛️';
      case 'whatjobs':
        return '🌐';
      case 'devnet':
        return '🤝';
      case 'sams':
        return '⭐';
      case 'unjobs':
        return '🌍';
      default:
        return '📋';
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
                Public Health <span className="text-brand-charcoal-dark">Jobs</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Discover public health job opportunities from top employers across India
              </p>

            </div>
          </div>
        </section>

        {/* Job Stats */}
        {lastUpdated && (
          <section className="px-4 sm:px-6 lg:px-8 py-6 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Last updated: {lastUpdated.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-blue" />
                  <p className="text-sm text-foreground font-medium">
                    {jobs.length} jobs from {RawJobService.getUniqueSources(jobs).length} sources
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filters */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div>
                <Input
                  placeholder="Search jobs, companies, functions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/90 backdrop-blur-sm border-gray-200"
                />
              </div>
              <div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-200">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl">
                    <SelectItem value="all">All Locations</SelectItem>
                    {RawJobService.getUniqueLocations(jobs).map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-200">
                    <SelectValue placeholder="Filter by job type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl">
                    <SelectItem value="all">All Job Types</SelectItem>
                    {RawJobService.getUniqueJobTypes(jobs).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <section className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-7xl mx-auto">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          </section>
        )}

        {/* Jobs Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Loading job listings...</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        {job.companyLogo && (
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h2 className="text-xl font-semibold text-foreground line-clamp-2">
                              {job.title}
                            </h2>
                            <div className="flex gap-2 shrink-0">
                              <Badge className={getSourceBadgeColor(job.source)}>
                                {getSourceIcon(job.source)} {job.source.charAt(0).toUpperCase() + job.source.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            {job.jobType && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{job.jobType}</span>
                              </div>
                            )}
                            {job.applicantsCount && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{job.applicantsCount} applicants</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-black text-sm line-clamp-3">
                        {RawJobService.stripHtml(job.description).substring(0, 200)}
                        {RawJobService.stripHtml(job.description).length > 200 && '...'}
                      </p>

                      {/* Salary and Benefits */}
                      {(job.salary || job.benefits?.length) && (
                        <div className="space-y-2">
                          {job.salary && (
                            <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          {job.benefits && job.benefits.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {job.benefits.slice(0, 3).map((benefit, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                              {job.benefits.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.benefits.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {job.function && (
                          <Badge variant="outline" className="text-xs">
                            {job.function}
                          </Badge>
                        )}
                        {job.seniorityLevel && (
                          <Badge variant="outline" className="text-xs">
                            {job.seniorityLevel}
                          </Badge>
                        )}
                        {job.industries && (
                          <Badge variant="outline" className="text-xs">
                            {job.industries}
                          </Badge>
                        )}
                      </div>

                      {/* Company Rating */}
                      {job.companyRating && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{job.companyRating.toFixed(1)}</span>
                          {job.companyReviewsCount && (
                            <span>({job.companyReviewsCount} reviews)</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-2">
                          {job.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                            >
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Job
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {job.applyLink && (
                            <Button
                              size="sm"
                              asChild
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <a
                                href={job.applyLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Apply Now
                              </a>
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {RawJobService.formatDate(job.postedDate)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No jobs found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedLocation !== "all" || selectedJobType !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No jobs are currently available. Check back later for new opportunities."}
                </p>
              </div>
            )}

            {/* Results count */}
            {filteredJobs.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} from multiple sources
                </p>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default RawJobs;

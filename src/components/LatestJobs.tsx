import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Building2, Calendar, ArrowRight } from "lucide-react";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query, limit } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnlWQpbJdjUaFdBH4XTo_bcvesCrSVJmk",
    authDomain: "scraper-46e27.firebaseapp.com",
    projectId: "scraper-46e27",
    storageBucket: "scraper-46e27.firebasestorage.app",
    messagingSenderId: "380666576081",
    appId: "1:380666576081:web:10a8eea3b4ba89fe1059f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface BrightDataJob {
    job_posting_id?: string;
    job_title: string;
    company_name: string;
    company_logo?: string;
    job_location: string;
    job_employment_type: string;
    job_num_applicants?: string;
    job_posted_time?: string;
    job_summary?: string;
    job_description_formatted?: string;
    job_function?: string;
    job_seniority_level?: string;
    job_industries?: string;
    url?: string;
    apply_link?: string;
}

interface NaukriJob {
  id: string;
  title: string;
  company: string;
  companyRating: number | null;
  companyReviews: string;
  salary: string;
  experience: string;
  experienceRange?: {
    min?: number;
    max?: number;
    original: string;
  };
  location: string;
  description: string;
  skills: string[];
  postedDate: string;
  jobUrl: string;
  salaryRange: any;
  scrapedAt: string;
}

interface JobPost {
  id: string;
  title: string;
  organization: string;
  location: string;
  link: string;
  publishedDate: string;
  description: string;
  source: string;
  company_logo?: string;
  employment_type?: string;
  apply_link?: string;
}

const LatestJobs = () => {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'brightdata' | 'naukri' | 'fallback'>('brightdata');

  const stripHtml = (html: string) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Function to fetch from BrightData Firebase (Limited to latest 2 documents)
  const fetchBrightDataJobs = async (): Promise<JobPost[]> => {
    try {
      // Get only the latest 2 documents ordered by createdAt
      const q = query(
        collection(db, 'linkedin_jobs'), 
        orderBy('createdAt', 'desc'),
        limit(2) // Limit to only 2 documents
      );
      const querySnapshot = await getDocs(q);

      const allJobs: JobPost[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const jobsData = data.data || data.webhookPayload || [];
        
        // Add jobs from each document (limited to latest 2 documents)
        jobsData.forEach((job: BrightDataJob, index: number) => {
          allJobs.push({
            id: job.job_posting_id || `${doc.id}-${index}`,
            title: job.job_title || 'No Title',
            organization: job.company_name || 'Unknown Company',
            location: job.job_location || 'Not Specified',
            link: job.url || '#',
            publishedDate: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            description: stripHtml(job.job_summary || job.job_description_formatted || 'No description available'),
            source: "BrightData",
            company_logo: job.company_logo,
            employment_type: job.job_employment_type,
            apply_link: job.apply_link
          });
        });
      });

      // Return up to 3 most recent jobs from the latest 2 documents
      return allJobs.slice(0, 3);
    } catch (error) {
      console.error("Error fetching BrightData jobs:", error);
      throw error;
    }
  };

  // Function to get the latest job data file path from Naukri
  const getLatestJobFile = async (): Promise<string> => {
    try {
      const latestResponse = await fetch('/api/data/jobs/latest.json');
      if (!latestResponse.ok) {
        throw new Error(`Failed to fetch latest data info: ${latestResponse.statusText}`);
      }
      const latestData = await latestResponse.json();
      const timestamp = latestData.latest;
      return `/api/data/jobs/naukri_public_health_jobs_${timestamp}.json`;
    } catch (error) {
      console.error("Error fetching latest timestamp:", error);
      return '/api/data/jobs/naukri_public_health_jobs_2025-09-11_10-48-29.json';
    }
  };

  // Function to fetch from Naukri JSON files
  const fetchNaukriJobs = async (): Promise<JobPost[]> => {
    try {
      const latestFilePath = await getLatestJobFile();
      const response = await fetch(latestFilePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch job data: ${response.statusText}`);
      }
      const naukriJobs: NaukriJob[] = await response.json();

      const sortedJobs = naukriJobs.sort((a, b) =>
        new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime()
      );

      return sortedJobs
        .slice(0, 3)
        .map(job => ({
          id: job.id,
          title: job.title,
          organization: job.company,
          location: job.location,
          link: job.jobUrl,
          publishedDate: job.scrapedAt,
          description: job.description,
          source: "Naukri.com"
        }));
    } catch (error) {
      console.error("Error fetching Naukri jobs:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        
        // Try BrightData first (now limited to latest 2 documents)
        try {
          const brightDataJobs = await fetchBrightDataJobs();
          if (brightDataJobs.length > 0) {
            setJobs(brightDataJobs);
            setDataSource('brightdata');
            return;
          }
        } catch (brightDataError) {
          console.log("BrightData failed, trying Naukri...", brightDataError);
        }

        // Fallback to Naukri if BrightData fails or has no jobs
        try {
          const naukriJobs = await fetchNaukriJobs();
          if (naukriJobs.length > 0) {
            setJobs(naukriJobs);
            setDataSource('naukri');
            return;
          }
        } catch (naukriError) {
          console.log("Naukri also failed...", naukriError);
        }

        // If both sources fail or have no data, show empty state
        setJobs([]);
        setDataSource('fallback');
        
      } catch (err) {
        console.error("All data sources failed:", err);
        setJobs([]);
        setDataSource('fallback');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Recent";
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'BrightData':
        return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200';
      case 'Naukri.com':
        return 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200';
    }
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Latest Jobs</h2>
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

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <Link to="/jobs">
          <Button variant="link" className="p-0 text-brand-primary flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {jobs.map((job) => (
          <Card key={job.id} className="group relative p-4 border-gray-200 hover:border-gray-300 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 transform hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {/* Company Logo for BrightData jobs */}
                {job.company_logo && (
                  <img
                    src={job.company_logo}
                    alt={job.organization}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    {/* Title with enhanced styling */}
                    <h3 className="font-bold text-lg transition-colors duration-200 line-clamp-2 leading-tight">
                      {job.title}
                    </h3>
                    
                    {/* Latest indicator for BrightData jobs */}
                    {job.source === 'BrightData' && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300 shrink-0">
                        Latest
                      </Badge>
                    )}
                  </div>

                  {/* Job meta information */}
                  <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap mt-2">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{job.organization}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(job.publishedDate)}</span>
                    </div>
                    {job.employment_type && (
                      <Badge variant="outline" className="text-xs">
                        {job.employment_type}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Description with better typography */}
              <p className="mb-4 line-clamp-3 text-sm leading-relaxed">
                {job.description.replace(/<[^>]*>/g, '')}
              </p>

              {/* Enhanced bottom section with better layout */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
                <div className="flex gap-2">
                  {job.link && job.link !== '#' && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex items-center gap-1 transition-all duration-200 hover:bg-blue-50 hover:border-green-300"
                    >
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Job
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                  {job.apply_link && (
                    <Button
                      size="sm"
                      asChild
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      <a
                        href={job.apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply Now
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative element - different colors based on source */}
            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300 ${
              job.source === 'BrightData' ? 'bg-green-400' : 
              job.source === 'Naukri.com' ? 'bg-green-400' : 'bg-gray-400'
            }`}></div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default LatestJobs;
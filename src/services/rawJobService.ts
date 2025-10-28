// Raw job data service for loading scraped data from JSON files

export interface IndeedJob {
  jobid: string;
  company_name: string;
  date_posted_parsed: string;
  job_title: string;
  description_text: string;
  benefits: string[];
  job_type: string;
  location: string;
  salary_formatted: string;
  company_rating: number;
  company_reviews_count: number;
  country: string;
  date_posted: string;
  description: string;
  url?: string;
}

export interface GlassdoorJob {
  jobid: string;
  company_name: string;
  job_title: string;
  location: string;
  description: string;
  date_posted: string;
  date_posted_parsed: string;
  salary_formatted: string;
  company_rating: number;
  company_reviews_count: number;
  job_type: string;
  benefits: string[];
  url: string;
  source: string;
}

export interface ICMRJob {
  jobid: string;
  company_name: string;
  job_title: string;
  location: string;
  description: string;
  date_posted: string;
  date_posted_parsed: string;
  salary_formatted: string;
  company_rating: number;
  company_reviews_count: number;
  job_type: string;
  benefits: string[];
  url: string;
  source: string;
  qualifications?: string;
  experience?: string;
  desirable?: string;
  age_limit?: string;
  application_fee?: string;
  last_date?: string;
  language?: string;
}

export interface WhatJobsJob {
  jobid: string;
  company_name: string;
  job_title: string;
  location: string;
  description: string;
  date_posted: string;
  date_posted_parsed: string;
  salary_formatted: string;
  company_rating: number;
  company_reviews_count: number;
  job_type: string;
  benefits: string[];
  url: string;
  source: string;
  qualifications?: string;
  experience?: string;
  key_skills?: string[];
  last_date?: string;
}

export interface DevNetJob {
  jobid: string;
  company_name: string;
  job_title: string;
  location: string;
  description: string;
  date_posted: string;
  date_posted_parsed: string;
  salary_formatted: string;
  company_rating: number;
  company_reviews_count: number;
  job_type: string;
  benefits: string[];
  url: string;
  source: string;
  last_date?: string;
}

export interface SAMSJob {
  jobid: string;
  company_name: string;
  job_title: string;
  location: string;
  description: string;
  date_posted: string;
  date_posted_parsed: string;
  salary_formatted: string;
  company_rating: number;
  company_reviews_count: number;
  job_type: string;
  benefits: string[];
  url: string;
  source: string;
  client_name?: string;
  level?: string;
  function?: string;
  experience?: string;
  sector?: string;
  vacancies?: number;
  last_date?: string;
}

export interface UNJobsJob {
  jobid: string;
  company_name: string;
  job_title: string;
  location: string;
  description: string;
  date_posted: string;
  date_posted_parsed: string;
  salary_formatted: string;
  company_rating: number;
  company_reviews_count: number;
  job_type: string;
  benefits: string[];
  url: string;
  source: string;
  closing_date?: string;
  experience_required?: string;
}

export interface LinkedInJob {
  url: string;
  job_posting_id: string;
  job_title: string;
  company_name: string;
  company_id: string;
  job_location: string;
  job_summary: string;
  job_seniority_level: string;
  job_function: string;
  job_employment_type: string;
  job_industries: string;
  company_url: string;
  job_posted_time: string;
  job_num_applicants: number;
  apply_link: string;
  company_logo: string;
  job_posted_date: string;
  application_availability: boolean;
  job_description_formatted: string;
}

export interface UnifiedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: string;
  jobType: string;
  source: 'indeed' | 'linkedin' | 'glassdoor' | 'icmr' | 'whatjobs' | 'devnet' | 'sams' | 'unjobs';
  url?: string;
  applyLink?: string;
  companyLogo?: string;
  salary?: string;
  benefits?: string[];
  companyRating?: number;
  companyReviewsCount?: number;
  seniorityLevel?: string;
  function?: string;
  industries?: string;
  applicantsCount?: number;
}

export class RawJobService {
  private static indeedData: IndeedJob[] | null = null;
  private static linkedinData: LinkedInJob[] | null = null;
  private static glassdoorData: GlassdoorJob[] | null = null;
  private static icmrData: ICMRJob[] | null = null;
  private static whatjobsData: WhatJobsJob[] | null = null;
  private static devnetData: DevNetJob[] | null = null;
  private static samsData: SAMSJob[] | null = null;
  private static unjobsData: UNJobsJob[] | null = null;

  static async loadIndeedJobs(): Promise<IndeedJob[]> {
    if (this.indeedData) {
      return this.indeedData;
    }

    try {
      // Load September 2025 Indeed data (most recent)
      const response = await fetch('/data/indeed_public_health_jobs_september_2025.json');
      if (!response.ok) {
        // Fallback to original indeed.json if September data not available
        const fallbackResponse = await fetch('/data/indeed.json');
        if (!fallbackResponse.ok) {
          throw new Error(`Failed to load Indeed data: ${fallbackResponse.statusText}`);
        }
        this.indeedData = await fallbackResponse.json();
        return this.indeedData;
      }
      this.indeedData = await response.json();
      return this.indeedData;
    } catch (error) {
      console.error('Error loading Indeed jobs:', error);
      throw error;
    }
  }

  static async loadLinkedInJobs(): Promise<LinkedInJob[]> {
    if (this.linkedinData) {
      return this.linkedinData;
    }

    try {
      const response = await fetch('/data/linkedin.json');
      if (!response.ok) {
        throw new Error(`Failed to load LinkedIn data: ${response.statusText}`);
      }
      this.linkedinData = await response.json();
      return this.linkedinData;
    } catch (error) {
      console.error('Error loading LinkedIn jobs:', error);
      throw error;
    }
  }

  static async loadGlassdoorJobs(): Promise<GlassdoorJob[]> {
    if (this.glassdoorData) {
      return this.glassdoorData;
    }

    try {
      const response = await fetch('/data/glassdoor_public_health_jobs_october_2025.json');
      if (!response.ok) {
        throw new Error(`Failed to load Glassdoor data: ${response.statusText}`);
      }
      this.glassdoorData = await response.json();
      return this.glassdoorData;
    } catch (error) {
      console.error('Error loading Glassdoor jobs:', error);
      throw error;
    }
  }

  static async loadICMRJobs(): Promise<ICMRJob[]> {
    if (this.icmrData) {
      return this.icmrData;
    }

    try {
      const response = await fetch('/data/icmr_public_health_jobs_october_2025.json');
      if (!response.ok) {
        throw new Error(`Failed to load ICMR data: ${response.statusText}`);
      }
      this.icmrData = await response.json();
      return this.icmrData;
    } catch (error) {
      console.error('Error loading ICMR jobs:', error);
      throw error;
    }
  }

  static async loadWhatJobsJobs(): Promise<WhatJobsJob[]> {
    if (this.whatjobsData) {
      return this.whatjobsData;
    }

    try {
      const response = await fetch('/data/whatjobs_public_health_jobs_october_2025.json');
      if (!response.ok) {
        throw new Error(`Failed to load WhatJobs data: ${response.statusText}`);
      }
      this.whatjobsData = await response.json();
      return this.whatjobsData;
    } catch (error) {
      console.error('Error loading WhatJobs jobs:', error);
      throw error;
    }
  }

  static async loadDevNetJobs(): Promise<DevNetJob[]> {
    if (this.devnetData) {
      return this.devnetData;
    }

    try {
      const response = await fetch('/data/devnet_public_health_jobs_october_2025.json');
      if (!response.ok) {
        throw new Error(`Failed to load DevNet data: ${response.statusText}`);
      }
      this.devnetData = await response.json();
      return this.devnetData;
    } catch (error) {
      console.error('Error loading DevNet jobs:', error);
      throw error;
    }
  }

  static async loadSAMSJobs(): Promise<SAMSJob[]> {
    if (this.samsData) {
      return this.samsData;
    }

    try {
      const response = await fetch('/data/sams_public_health_jobs_2025.json');
      if (!response.ok) {
        throw new Error(`Failed to load SAMS data: ${response.statusText}`);
      }
      this.samsData = await response.json();
      return this.samsData;
    } catch (error) {
      console.error('Error loading SAMS jobs:', error);
      throw error;
    }
  }

  static async loadUNJobs(): Promise<UNJobsJob[]> {
    if (this.unjobsData) {
      return this.unjobsData;
    }

    try {
      const response = await fetch('/data/unjobs_public_health_jobs_2025.json');
      if (!response.ok) {
        throw new Error(`Failed to load UNJobs data: ${response.statusText}`);
      }
      this.unjobsData = await response.json();
      return this.unjobsData;
    } catch (error) {
      console.error('Error loading UNJobs:', error);
      throw error;
    }
  }

  static isIndiaLocation(location: string): boolean {
    if (!location) return false;
    const locationLower = location.toLowerCase();
    
    // Check for India-specific indicators
    const indiaIndicators = [
      'india',
      'tamil nadu',
      'chennai',
      'bangalore',
      'mumbai',
      'delhi',
      'hyderabad',
      'pune',
      'kolkata',
      'ahmedabad',
      'jaipur',
      'lucknow',
      'kanpur',
      'nagpur',
      'indore',
      'thane',
      'bhopal',
      'visakhapatnam',
      'pimpri',
      'patna',
      'vadodara',
      'ludhiana',
      'agra',
      'nashik',
      'faridabad',
      'meerut',
      'rajkot',
      'kalyan',
      'vasai',
      'varanasi',
      'srinagar',
      'aurangabad',
      'noida',
      'howrah',
      'ranchi',
      'gwalior',
      'jabalpur',
      'coimbatore',
      'vijayawada',
      'jodhpur',
      'madurai',
      'raipur',
      'kota',
      'chandigarh',
      'guwahati',
      'solapur',
      'hubli',
      'tiruchirappalli',
      'bareilly',
      'mysore',
      'tiruppur',
      'gurgaon',
      'aligarh',
      'moradabad',
      'jalandhar',
      'bhubaneswar',
      'salem',
      'warangal',
      'guntur',
      'bhiwandi',
      'saharanpur',
      'gorakhpur',
      'bikaner',
      'amravati',
      'noida',
      'jamshedpur',
      'bhilai',
      'cuttack',
      'firozabad',
      'kochi',
      'bhavnagar',
      'dehradun',
      'durgapur',
      'asansol',
      'rourkela',
      'nanded',
      'kolhapur',
      'ajmer',
      'akola',
      'gulbarga',
      'jamnagar',
      'ujjain',
      'loni',
      'siliguri',
      'jhansi',
      'ulhasnagar',
      'jammu',
      'sangli',
      'mangalore',
      'erode',
      'belgaum',
      'ambattur',
      'tirunelveli',
      'malegaon',
      'gaya',
      'jalgaon',
      'udaipur',
      'maheshtala'
    ];
    
    return indiaIndicators.some(indicator => locationLower.includes(indicator));
  }

  static async loadAllJobs(): Promise<UnifiedJob[]> {
    try {
      const [indeedJobs, linkedinJobs, glassdoorJobs, icmrJobs, whatjobsJobs, devnetJobs, samsJobs, unjobs] = await Promise.all([
        this.loadIndeedJobs(),
        this.loadLinkedInJobs(),
        this.loadGlassdoorJobs(),
        this.loadICMRJobs(),
        this.loadWhatJobsJobs(),
        this.loadDevNetJobs(),
        this.loadSAMSJobs(),
        this.loadUNJobs()
      ]);

      const unifiedJobs: UnifiedJob[] = [];

      // Convert Indeed jobs - filter for India only
      indeedJobs.forEach(job => {
        if (this.isIndiaLocation(job.location)) {
          unifiedJobs.push({
            id: `indeed-${job.jobid}`,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            description: job.description_text || job.description,
            postedDate: job.date_posted_parsed || job.date_posted,
            jobType: job.job_type,
            source: 'indeed',
            url: job.url || `https://in.indeed.com/viewjob?jk=${job.jobid}`,
            salary: job.salary_formatted,
            benefits: job.benefits,
            companyRating: job.company_rating,
            companyReviewsCount: job.company_reviews_count
          });
        }
      });

      // Convert LinkedIn jobs - no filtering, keep all
      linkedinJobs.forEach(job => {
        unifiedJobs.push({
          id: `linkedin-${job.job_posting_id}`,
          title: job.job_title,
          company: job.company_name,
          location: job.job_location,
          description: job.job_summary || job.job_description_formatted,
          postedDate: job.job_posted_date || job.job_posted_time,
          jobType: job.job_employment_type,
          source: 'linkedin',
          url: job.url,
          applyLink: job.apply_link,
          companyLogo: job.company_logo,
          seniorityLevel: job.job_seniority_level,
          function: job.job_function,
          industries: job.job_industries,
          applicantsCount: job.job_num_applicants
        });
      });

      // Convert Glassdoor jobs - filter for India only
      glassdoorJobs.forEach(job => {
        if (this.isIndiaLocation(job.location)) {
          unifiedJobs.push({
            id: `glassdoor-${job.jobid}`,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            description: job.description,
            postedDate: job.date_posted_parsed || job.date_posted,
            jobType: job.job_type,
            source: 'glassdoor',
            url: job.url,
            salary: job.salary_formatted,
            benefits: job.benefits,
            companyRating: job.company_rating,
            companyReviewsCount: job.company_reviews_count
          });
        }
      });

      // Convert ICMR jobs - filter for India only
      icmrJobs.forEach(job => {
        if (this.isIndiaLocation(job.location)) {
          unifiedJobs.push({
            id: `icmr-${job.jobid}`,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            description: job.description,
            postedDate: job.date_posted_parsed || job.date_posted,
            jobType: job.job_type,
            source: 'icmr',
            url: job.url,
            salary: job.salary_formatted,
            benefits: job.benefits,
            companyRating: job.company_rating,
            companyReviewsCount: job.company_reviews_count
          });
        }
      });

      // Convert WhatJobs jobs - filter for India only
      whatjobsJobs.forEach(job => {
        if (this.isIndiaLocation(job.location)) {
          unifiedJobs.push({
            id: `whatjobs-${job.jobid}`,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            description: job.description,
            postedDate: job.date_posted_parsed || job.date_posted,
            jobType: job.job_type,
            source: 'whatjobs',
            url: job.url,
            salary: job.salary_formatted,
            benefits: job.benefits,
            companyRating: job.company_rating,
            companyReviewsCount: job.company_reviews_count
          });
        }
      });

      // Convert DevNet jobs - filter for India only
      devnetJobs.forEach(job => {
        if (this.isIndiaLocation(job.location)) {
          unifiedJobs.push({
            id: `devnet-${job.jobid}`,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            description: job.description,
            postedDate: job.date_posted_parsed || job.date_posted,
            jobType: job.job_type,
            source: 'devnet',
            url: job.url,
            salary: job.salary_formatted,
            benefits: job.benefits,
            companyRating: job.company_rating,
            companyReviewsCount: job.company_reviews_count
          });
        }
      });

      // Convert SAMS jobs
      samsJobs.forEach(job => {
        unifiedJobs.push({
          id: `sams-${job.jobid}`,
          title: job.job_title,
          company: job.company_name,
          location: job.location,
          description: job.description,
          postedDate: job.date_posted_parsed || job.date_posted,
          jobType: job.job_type,
          source: 'sams',
          url: job.url,
          salary: job.salary_formatted,
          benefits: job.benefits,
          companyRating: job.company_rating,
          companyReviewsCount: job.company_reviews_count,
          seniorityLevel: job.level,
          function: job.function
        });
      });

      // Convert UNJobs jobs
      unjobs.forEach(job => {
        unifiedJobs.push({
          id: `unjobs-${job.jobid}`,
          title: job.job_title,
          company: job.company_name,
          location: job.location,
          description: job.description,
          postedDate: job.date_posted_parsed || job.date_posted,
          jobType: job.job_type,
          source: 'unjobs',
          url: job.url,
          salary: job.salary_formatted,
          benefits: job.benefits,
          companyRating: job.company_rating,
          companyReviewsCount: job.company_reviews_count
        });
      });

      // Sort by posted date (newest first)
      return unifiedJobs.sort((a, b) => {
        const dateA = new Date(a.postedDate).getTime();
        const dateB = new Date(b.postedDate).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error loading all jobs:', error);
      throw error;
    }
  }

  static stripHtml(html: string): string {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  static formatDate(dateString: string): string {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  static getUniqueLocations(jobs: UnifiedJob[]): string[] {
    const locations = jobs.map(job => job.location);
    return Array.from(new Set(locations)).sort();
  }

  static getUniqueJobTypes(jobs: UnifiedJob[]): string[] {
    const types = jobs.map(job => job.jobType).filter(Boolean);
    return Array.from(new Set(types)).sort();
  }

  static getUniqueSources(jobs: UnifiedJob[]): string[] {
    const sources = jobs.map(job => job.source);
    return Array.from(new Set(sources)).sort();
  }
}

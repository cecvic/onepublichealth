import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { Clock, MapPin, Building2, Users, ExternalLink, Calendar, Briefcase, RefreshCw, AlertCircle, TrendingUp, Star } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface JobPost {
    id: string;
    title: string;
    organization: string;
    location: string;
    link: string;
    publishedDate: string;
    description: string;
    source: string;
    employment_type?: string;
    applicants?: string;
    function?: string;
    seniority?: string;
    industries?: string;
    apply_link?: string;
    company_logo?: string;
    documentCreatedAt?: string; // Added to track document creation date
}

const Jobs = () => {
    const [jobs, setJobs] = useState<JobPost[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<JobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("all");
    const [selectedEmploymentType, setSelectedEmploymentType] = useState("all");
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [documentsInfo, setDocumentsInfo] = useState<string>("");

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        let filtered = jobs;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

        // Filter by employment type
        if (selectedEmploymentType !== "all") {
            filtered = filtered.filter(job =>
                job.employment_type?.toLowerCase().includes(selectedEmploymentType.toLowerCase())
            );
        }

        setFilteredJobs(filtered);
    }, [jobs, searchTerm, selectedLocation, selectedEmploymentType]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Create query to get only the latest 2 documents ordered by createdAt (latest first)
            const q = query(
                collection(db, 'indeed_jobs'), 
                orderBy('createdAt', 'desc'),
                limit(4) // Limit to only 2 documents
            );
            const b = query(
                collection(db, 'linkedin_jobs'),
                orderBy('createdAt', 'desc'),
                limit(4) // Limit to only 2 documents
            );
            const querySnapshot = await getDocs(q);
            const linkedinSnapshot = await getDocs(b);

            const allJobs: JobPost[] = [];
            const docDates: string[] = [];
            
            // Process Indeed jobs
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const jobsData = data.data || data.webhookPayload || [];

                // Get document creation date for display
                let docCreatedAt = '';
                if (data.createdAt && data.createdAt.toDate) {
                    docCreatedAt = data.createdAt.toDate().toLocaleString('en-IN');
                    docDates.push(docCreatedAt);
                }

                jobsData.forEach((job: BrightDataJob, index: number) => {
                    allJobs.push({
                        id: job.job_posting_id || `${doc.id}-${index}`,
                        title: job.job_title || 'No Title',
                        organization: job.company_name || 'Unknown Company',
                        location: job.job_location || 'Not Specified',
                        link: job.url || '#',
                        publishedDate: job.job_posted_time || 'Recently',
                        description: stripHtml(job.job_summary || job.job_description_formatted || 'No description available'),
                        source: "BrightData",
                        employment_type: job.job_employment_type,
                        applicants: job.job_num_applicants,
                        function: job.job_function,
                        seniority: job.job_seniority_level,
                        industries: job.job_industries,
                        apply_link: job.apply_link,
                        company_logo: job.company_logo,
                        documentCreatedAt: docCreatedAt
                    });
                });
            });

            // Process LinkedIn jobs
            linkedinSnapshot.forEach((doc) => {
                const data = doc.data();
                const jobsData = data.data || data.webhookPayload || [];

                // Get document creation date for display
                let docCreatedAt = '';
                if (data.createdAt && data.createdAt.toDate) {
                    docCreatedAt = data.createdAt.toDate().toLocaleString('en-IN');
                    docDates.push(docCreatedAt);
                }

                jobsData.forEach((job: BrightDataJob, index: number) => {
                    allJobs.push({
                        id: job.job_posting_id || `linkedin-${doc.id}-${index}`,
                        title: job.job_title || 'No Title',
                        organization: job.company_name || 'Unknown Company',
                        location: job.job_location || 'Not Specified',
                        link: job.url || '#',
                        publishedDate: job.job_posted_time || 'Recently',
                        description: stripHtml(job.job_summary || job.job_description_formatted || 'No description available'),
                        source: "LinkedIn",
                        employment_type: job.job_employment_type,
                        applicants: job.job_num_applicants,
                        function: job.job_function,
                        seniority: job.job_seniority_level,
                        industries: job.job_industries,
                        apply_link: job.apply_link,
                        company_logo: job.company_logo,
                        documentCreatedAt: docCreatedAt
                    });
                });
            });

            setJobs(allJobs);
            setFilteredJobs(allJobs);
            setLastUpdated(new Date());
            
            // Set documents info for display
            if (docDates.length > 0) {
                setDocumentsInfo(`Showing jobs from ${docDates.length} latest document${docDates.length > 1 ? 's' : ''}`);
            }
            
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to fetch jobs. Please check your Firebase configuration and permissions.');
        } finally {
            setLoading(false);
        }
    };

    const stripHtml = (html: string) => {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === 'Recently') return dateString;
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
    };

    const getUniqueLocations = () => {
        const locations = jobs.map(job => job.location);
        return Array.from(new Set(locations)).sort();
    };

    const getUniqueEmploymentTypes = () => {
        const types = jobs.map(job => job.employment_type).filter(Boolean);
        return Array.from(new Set(types)).sort();
    };

    const handleRefresh = () => {
        fetchJobs();
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background">
                {/* Page Header */}
                <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-50"></div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-100 to-blue-100 rounded-full opacity-20 -translate-y-48 translate-x-48"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full opacity-20 translate-y-40 -translate-x-40"></div>

                    <div className="max-w-7xl mx-auto relative">
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-green-500 rounded-full shadow-lg">
                                    <Briefcase className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                    <span className="text-sm font-medium text-green-600 bg-purple-50 px-3 py-1 rounded-full">
                                        One Public Health
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-green-600 to-green-800 bg-clip-text text-transparent mb-6 leading-tight">
                               One Public Health
                                <br />
                                <span className="text-3xl md:text-4xl font-semibold text-gray-700">Live Feed</span>
                            </h1>

                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                                Discover the latest job opportunities in public health from top organizations.
                                Real-time job listings updated continuously.
                            </p>

                            {lastUpdated && (
                                <div className="flex flex-col items-center gap-2 mb-8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <p className="text-sm text-gray-500 font-medium">
                                            Last updated: {lastUpdated.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    {documentsInfo && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                                                {documentsInfo}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                                        {getUniqueLocations().map((location) => (
                                            <SelectItem key={location} value={location}>
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Select value={selectedEmploymentType} onValueChange={setSelectedEmploymentType}>
                                    <SelectTrigger className="bg-white/90 backdrop-blur-sm border-gray-200">
                                        <SelectValue placeholder="Filter by employment type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl">
                                        <SelectItem value="all">All Employment Types</SelectItem>
                                        {getUniqueEmploymentTypes().map((type) => (
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
                                <p className="text-muted-foreground">Loading latest job listings from BrightData...</p>
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {filteredJobs.map((job) => (
                                    <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                {/* Company Logo */}
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
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <h2 className="text-xl font-semibold text-foreground line-clamp-2">
                                                            {job.title}
                                                        </h2>
                                                        {job.documentCreatedAt && (
                                                            <Badge variant="outline" className="text-xs shrink-0">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                Latest
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                                                        <div className="flex items-center gap-1">
                                                            <Building2 className="w-4 h-4" />
                                                            <span>{job.organization}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{job.location}</span>
                                                        </div>
                                                        {job.employment_type && (
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                <span>{job.employment_type}</span>
                                                            </div>
                                                        )}
                                                        {job.applicants && (
                                                            <div className="flex items-center gap-1">
                                                                <Users className="w-4 h-4" />
                                                                <span>{job.applicants} applicants</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-muted-foreground text-sm line-clamp-3">
                                                {job.description.substring(0, 200)}
                                                {job.description.length > 200 && '...'}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2">
                                                {job.function && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {job.function}
                                                    </Badge>
                                                )}
                                                {job.seniority && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {job.seniority}
                                                    </Badge>
                                                )}
                                                {job.industries && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {job.industries}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <div className="flex gap-2">
                                                    {job.link && job.link !== '#' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                            className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-300"
                                                        >
                                                            <a
                                                                href={job.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                View Job
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                    {job.apply_link && (
                                                        <Button
                                                            size="sm"
                                                            asChild
                                                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
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
                                    {searchTerm || selectedLocation !== "all" || selectedEmploymentType !== "all"
                                        ? "Try adjusting your filters to see more results."
                                        : "No jobs are currently available from the latest documents. Check back later for new opportunities."}
                                </p>
                            </div>
                        )}

                        {/* Results count */}
                        {filteredJobs.length > 0 && (
                            <div className="mt-8 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} from the latest 2 BrightData documents
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Jobs;
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  GraduationCap,
  MapPin,
  Calendar,
  Mail,
  ExternalLink,
  Search,
  Award,
  BookOpen,
  RefreshCw,
} from 'lucide-react';

interface Course {
  id: string;
  institute: string;
  location: string;
  startYear: string;
  nirfRank: string;
  contactEmail: string;
  admissionCycle: string;
  specializations: string[];
  courseUrl: string;
  instituteUrl: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [courseTypeFilter, setCourseTypeFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, locationFilter, specializationFilter, courseTypeFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/data/courses.json');
      if (!response.ok) {
        throw new Error('Failed to load courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.institute.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.specializations.some((spec) =>
            spec.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter((course) =>
        course.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Specialization filter
    if (specializationFilter !== 'all') {
      filtered = filtered.filter((course) =>
        course.specializations.some((spec) =>
          spec.toLowerCase().includes(specializationFilter.toLowerCase())
        )
      );
    }

    // Course type filter
    if (courseTypeFilter !== 'all') {
      filtered = filtered.filter((course) => {
        // Get the course name from specializations field
        const courseName = course.specializations.join(' ').toLowerCase();
        const instituteName = course.institute.toLowerCase();
        
        // Check for different course types
        switch (courseTypeFilter) {
          case 'MPH':
            return courseName.includes('mph') || instituteName.includes('mph');
          case 'MD':
            return courseName.includes(' md ') || courseName.includes('(md)') || courseName.includes('doctor');
          case 'PhD':
            return courseName.includes('phd') || courseName.includes('doctorate');
          case 'MSc':
            return courseName.includes('msc') || courseName.includes('m.sc') || instituteName.includes('msc');
          case 'Other':
            return !courseName.includes('mph') && !courseName.includes(' phd') && 
                   !courseName.includes(' msc') && !courseName.includes(' md ');
          default:
            return true;
        }
      });
    }

    setFilteredCourses(filtered);
  };

  const getUniqueLocations = () => {
    const locations = courses.map((course) => {
      // Extract state from location (after comma)
      const parts = course.location.split(',');
      return parts.length > 1 ? parts[parts.length - 1].trim() : course.location;
    });
    return [...new Set(locations)].sort();
  };

  const getAllSpecializations = () => {
    const specs = courses.flatMap((course) => course.specializations);
    return [...new Set(specs)].sort();
  };

  const handleRefresh = () => {
    fetchCourses();
  };

  const getRankBadgeColor = (rank: string) => {
    if (rank === '—' || rank === 'Not Mentioned') return 'bg-gray-100 text-gray-600';
    const rankNum = parseInt(rank);
    if (rankNum <= 5) return 'bg-green-100 text-green-700';
    if (rankNum <= 20) return 'bg-blue-100 text-blue-700';
    return 'bg-purple-100 text-purple-700';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-blue to-brand-green">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
                Public Health <span className="text-brand-charcoal-dark">Courses</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Explore Master of Public Health (MPH) and epidemiology programs from India's top institutions
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="border-b bg-white sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4 relative">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search institutes, locations, specializations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent position="item-aligned" side="bottom" align="start" sideOffset={4}>
                  <SelectItem value="all">All States</SelectItem>
                  {getUniqueLocations().map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Specialization Filter */}
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {getAllSpecializations().map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Course Type Filter */}
              <Select value={courseTypeFilter} onValueChange={setCourseTypeFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Course Type" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start" sideOffset={4}>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="MPH">MPH</SelectItem>
                  <SelectItem value="MD">MD</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                  <SelectItem value="MSc">MSc</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Results count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}{' '}
                  from {courses.length} institutions
                </p>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg leading-tight flex-1">
                          {course.institute}
                        </CardTitle>
                        {course.nirfRank && course.nirfRank !== '—' && course.nirfRank !== 'Not Mentioned' && (
                          <Badge className={getRankBadgeColor(course.nirfRank)} variant="outline">
                            <Award className="w-3 h-3 mr-1" />
                            NIRF {course.nirfRank}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3" />
                        {course.location}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-3 mb-4 flex-1">
                        {/* Admission Cycle */}
                        <div className="flex items-start gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Admission Cycle</p>
                            <p className="text-gray-600">{course.admissionCycle}</p>
                          </div>
                        </div>

                        {/* Start Year */}
                        <div className="flex items-start gap-2 text-sm">
                          <GraduationCap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Program Since</p>
                            <p className="text-gray-600">{course.startYear}</p>
                          </div>
                        </div>

                        {/* Specializations */}
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            Specializations
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {course.specializations.slice(0, 4).map((spec, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                            {course.specializations.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{course.specializations.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="flex items-start gap-2 text-sm">
                          <Mail className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div className="break-all">
                            <p className="font-medium text-gray-700">Contact</p>
                            <a
                              href={`mailto:${course.contactEmail}`}
                              className="text-blue-600 hover:underline text-xs"
                            >
                              {course.contactEmail}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-4 border-t">
                        <Button
                          asChild
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <a
                            href={course.instituteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Visit Institute Website
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No results */}
              {filteredCourses.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setLocationFilter('all');
                      setSpecializationFilter('all');
                      setCourseTypeFilter('all');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Results summary */}
              {filteredCourses.length > 0 && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredCourses.length} institution{filteredCourses.length !== 1 ? 's' : ''} offering MPH programs
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Info Section */}
        <section className="bg-gradient-to-b from-white to-green-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">About MPH Programs in India</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <GraduationCap className="w-8 h-8 text-green-600 mb-2" />
                    <CardTitle className="text-lg">What is MPH?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Master of Public Health (MPH) is a professional degree focusing on
                      population health, disease prevention, and health policy.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                    <CardTitle className="text-lg">Core Subjects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Typical subjects include Epidemiology, Biostatistics, Health Policy,
                      Environmental Health, and Health Systems Management.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Award className="w-8 h-8 text-purple-600 mb-2" />
                    <CardTitle className="text-lg">Career Prospects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Graduates work in government health departments, NGOs, research
                      institutions, international organizations like WHO, and healthcare consulting.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


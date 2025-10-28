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

// Base course interface with common fields
interface BaseCourse {
  id: string;
  courseType: 'MPH' | 'MD' | 'MSC' | 'Online' | 'Others';
  institution: string;
  location: string;
  website: string;
  specializations: string[];
}

// Type-specific interfaces
interface MPHCourse extends BaseCourse {
  courseType: 'MPH';
  parentUniversity?: string;
  nirfRank?: string;
}

interface MDCourse extends BaseCourse {
  courseType: 'MD';
  mdFocus?: string;
}

interface MSCCourse extends BaseCourse {
  courseType: 'MSC';
  programName?: string;
  parentUniversity?: string;
}

interface OnlineCourse extends BaseCourse {
  courseType: 'Online';
  programName?: string;
  modeDuration?: string;
  targetAudience?: string;
}

interface OthersCourse extends BaseCourse {
  courseType: 'Others';
  programName?: string;
  parentUniversity?: string;
  targetProfile?: string;
}

// Union type for all course types
type Course = MPHCourse | MDCourse | MSCCourse | OnlineCourse | OthersCourse;

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
          course.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.specializations.some((spec) =>
            spec.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          (course.courseType === 'MSC' && course.programName && 
           course.programName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (course.courseType === 'Online' && course.programName && 
           course.programName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (course.courseType === 'Others' && course.programName && 
           course.programName.toLowerCase().includes(searchQuery.toLowerCase()))
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
      filtered = filtered.filter((course) => course.courseType === courseTypeFilter);
    }

    setFilteredCourses(filtered);
  };

  const getUniqueLocations = () => {
    const locations = courses.map((course) => {
      // Extract state from location (after comma)
      const parts = course.location.split(',');
      return parts.length > 1 ? parts[parts.length - 1].trim() : course.location;
    });
    return [...new Set(locations)].filter(loc => loc && loc.trim() !== '').sort();
  };

  const getAllSpecializations = () => {
    const specs = courses.flatMap((course) => course.specializations);
    return [...new Set(specs)].filter(spec => spec && spec.trim() !== '').sort();
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
                Explore MPH, MD, MSc, online programs, and other public health courses from India's top institutions
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
                  <SelectItem value="MSC">MSC</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
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
                    {course.courseType === 'MPH' && (
                      <>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg leading-tight flex-1">
                              {course.institution}
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
                          {course.parentUniversity && (
                            <CardDescription className="text-xs text-gray-500">
                              {course.parentUniversity}
                            </CardDescription>
                          )}
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-3 mb-4 flex-1">
                        {/* Specializations */}
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <BookOpen className="w-4 h-4 text-purple-600" />
                            Specializations
                          </p>
                          <div className="flex flex-wrap gap-1">
                                {course.specializations.slice(0, 3).map((spec, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                                {course.specializations.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                    +{course.specializations.length - 3} more
                              </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex flex-col gap-2 pt-4 border-t">
                            <Button
                              asChild
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <a
                                href={course.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit Course Website
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    )}

                    {course.courseType === 'MD' && (
                      <>
                        <CardHeader>
                          <CardTitle className="text-lg leading-tight">
                            {course.institution}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {course.location}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col">
                          <div className="space-y-3 mb-4 flex-1">
                            {/* MD Focus */}
                            {course.mdFocus && (
                              <div className="text-sm">
                                <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                                  <GraduationCap className="w-4 h-4 text-blue-600" />
                                  MD Focus
                                </p>
                                <p className="text-gray-600">{course.mdFocus}</p>
                              </div>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="flex flex-col gap-2 pt-4 border-t">
                            <Button
                              asChild
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              <a
                                href={course.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit Official Website
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    )}

                    {course.courseType === 'MSC' && (
                      <>
                        <CardHeader>
                          <CardTitle className="text-lg leading-tight">
                            {course.programName || course.institution}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {course.location}
                          </CardDescription>
                          {course.parentUniversity && (
                            <CardDescription className="text-xs text-gray-500">
                              {course.parentUniversity}
                            </CardDescription>
                          )}
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col">
                          <div className="space-y-3 mb-4 flex-1">
                            {/* Specializations */}
                            <div className="text-sm">
                              <p className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <BookOpen className="w-4 h-4 text-purple-600" />
                                Focus Areas
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {course.specializations.slice(0, 3).map((spec, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {course.specializations.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{course.specializations.length - 3} more
                                  </Badge>
                                )}
                              </div>
                          </div>
                        </div>

                          {/* Action Button */}
                          <div className="flex flex-col gap-2 pt-4 border-t">
                            <Button
                              asChild
                              className="w-full bg-purple-600 hover:bg-purple-700"
                            >
                              <a
                                href={course.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit Course Website
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    )}

                    {course.courseType === 'Online' && (
                      <>
                        <CardHeader>
                          <CardTitle className="text-lg leading-tight">
                            {course.programName || course.institution}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {course.location}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col">
                          <div className="space-y-3 mb-4 flex-1">
                            {/* Mode/Duration */}
                            {course.modeDuration && (
                              <div className="text-sm">
                                <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                                  <Calendar className="w-4 h-4 text-green-600" />
                                  Mode/Duration
                                </p>
                                <p className="text-gray-600">{course.modeDuration}</p>
                              </div>
                            )}

                            {/* Target Audience */}
                            {course.targetAudience && (
                              <div className="text-sm">
                                <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                                  <GraduationCap className="w-4 h-4 text-blue-600" />
                                  Target Audience
                                </p>
                                <p className="text-gray-600">{course.targetAudience}</p>
                              </div>
                            )}

                            {/* Specializations */}
                            <div className="text-sm">
                              <p className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <BookOpen className="w-4 h-4 text-purple-600" />
                                Focus
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {course.specializations.slice(0, 2).map((spec, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {course.specializations.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{course.specializations.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex flex-col gap-2 pt-4 border-t">
                            <Button
                              asChild
                              className="w-full bg-orange-600 hover:bg-orange-700"
                            >
                              <a
                                href={course.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit Website
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </>
                    )}

                    {course.courseType === 'Others' && (
                      <>
                        <CardHeader>
                          <CardTitle className="text-lg leading-tight">
                            {course.programName || course.institution}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3" />
                            {course.location}
                          </CardDescription>
                          {course.parentUniversity && (
                            <CardDescription className="text-xs text-gray-500">
                              {course.parentUniversity}
                            </CardDescription>
                          )}
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col">
                          <div className="space-y-3 mb-4 flex-1">
                            {/* Target Profile */}
                            {course.targetProfile && (
                              <div className="text-sm">
                                <p className="font-medium text-gray-700 mb-1 flex items-center gap-1">
                                  <GraduationCap className="w-4 h-4 text-blue-600" />
                                  Target Profile
                                </p>
                                <p className="text-gray-600">{course.targetProfile}</p>
                              </div>
                            )}

                            {/* Specializations */}
                            <div className="text-sm">
                              <p className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                                <BookOpen className="w-4 h-4 text-purple-600" />
                                Focus Areas
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {course.specializations.slice(0, 3).map((spec, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {course.specializations.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{course.specializations.length - 3} more
                                  </Badge>
                                )}
                          </div>
                        </div>
                      </div>

                          {/* Action Button */}
                      <div className="flex flex-col gap-2 pt-4 border-t">
                        <Button
                          asChild
                              className="w-full bg-gray-600 hover:bg-gray-700"
                        >
                          <a
                                href={course.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Visit Course Website
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                      </>
                    )}
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
                    Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} from {courses.length} institutions
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Info Section */}
        <section className="bg-gradient-to-b from-white to-green-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">About Public Health Education in India</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <GraduationCap className="w-8 h-8 text-green-600 mb-2" />
                    <CardTitle className="text-lg">MPH Programs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Master of Public Health (MPH) focuses on population health, disease prevention, 
                      epidemiology, and health policy. Ideal for healthcare professionals seeking 
                      leadership roles in public health.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                    <CardTitle className="text-lg">MD Community Medicine</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Doctor of Medicine in Community Medicine combines clinical medicine with 
                      public health practice. Focuses on community-based healthcare delivery 
                      and preventive medicine.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Award className="w-8 h-8 text-purple-600 mb-2" />
                    <CardTitle className="text-lg">MSc Programs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Master of Science programs offer specialized training in epidemiology, 
                      biostatistics, health systems, and research methodologies for public 
                      health practice and research.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Calendar className="w-8 h-8 text-orange-600 mb-2" />
                    <CardTitle className="text-lg">Online Programs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Flexible online and distance learning programs designed for working 
                      professionals. Offer part-time and full-time options with various 
                      specializations and durations.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <BookOpen className="w-8 h-8 text-gray-600 mb-2" />
                    <CardTitle className="text-lg">Other Programs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Diploma courses, certificate programs, and specialized training 
                      in public health areas like health management, nutrition, and 
                      community health.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Award className="w-8 h-8 text-green-600 mb-2" />
                    <CardTitle className="text-lg">Career Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Graduates work in government health departments, NGOs, research 
                      institutions, international organizations like WHO, healthcare 
                      consulting, and academic institutions.
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


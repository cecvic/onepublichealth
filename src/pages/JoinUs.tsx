import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, BookOpen, ExternalLink, Heart } from "lucide-react";

const JoinUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main role="main">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-blue to-brand-green">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
                Join <span className="text-brand-charcoal-dark">Us</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Be part of a growing community that connects, collaborates, and celebrates everything public health! 🌍
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Connect With Our Community
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Together, let's build a space where public health professionals and aspirants can learn, grow, and make an impact one connection at a time.
              </p>
            </div>

            {/* Community Platforms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* WhatsApp Community */}
              <Card className="border-l-4 border-green-500 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">WhatsApp Community</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    Join our WhatsApp community to network, share opportunities, and stay updated with real-time discussions.
                  </p>
                  <Button 
                    asChild 
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto"
                  >
                    <a 
                      href="https://chat.whatsapp.com/L5FQMHbn1mdGmauqtZBCd3?mode=wwc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="hidden sm:inline">Join our WhatsApp group</span>
                      <span className="inline sm:hidden">Join Group</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* LinkedIn Group */}
              <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">LinkedIn Group</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    Connect with peers, discover jobs, and exchange ideas that move public health forward.
                  </p>
                  <Button 
                    asChild 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto"
                  >
                    <a 
                      href="https://www.linkedin.com/groups/9380018" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="hidden sm:inline">Join LinkedIn Group</span>
                      <span className="inline sm:hidden">Join Group</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Voices Magazine */}
              <Card className="border-l-4 border-brand-green hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-brand-green-light rounded-lg flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-brand-green" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Voices Magazine</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                    Follow our magazine on LinkedIn for stories, insights, and thought pieces from professionals across the field.
                  </p>
                  <Button 
                    asChild 
                    className="w-full bg-brand-green hover:bg-brand-green-dark text-white mt-auto"
                  >
                    <a 
                      href="https://www.linkedin.com/company/voicesbyonepublichealth/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <span className="hidden sm:inline">Visit Voices Magazine</span>
                      <span className="inline sm:hidden">Visit Magazine</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Community Benefits */}
            <div className="bg-brand-green-light rounded-lg p-8 mb-12">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-brand-green rounded-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Why Join Our Community?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">🌐 Real-time Networking</h4>
                    <p className="text-muted-foreground">
                      Connect with public health professionals worldwide through our active WhatsApp community and LinkedIn group.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">📰 Latest Insights</h4>
                    <p className="text-muted-foreground">
                      Stay updated with Voices magazine featuring stories and insights from professionals across the field.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">💼 Career Opportunities</h4>
                    <p className="text-muted-foreground">
                      Discover job opportunities, internships, and career development resources shared by community members.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">🤝 Collaborative Learning</h4>
                    <p className="text-muted-foreground">
                      Exchange ideas, share experiences, and learn from peers working in various public health sectors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-6">Ready to Get Started?</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Join our community today and be part of the movement to make public health more connected and accessible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-brand-green hover:bg-brand-green-dark text-white px-6 sm:px-8 py-3"
                >
                  <a 
                    href="https://chat.whatsapp.com/L5FQMHbn1mdGmauqtZBCd3?mode=wwc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="hidden sm:inline">Join our WhatsApp group</span>
                    <span className="inline sm:hidden">Join Group</span>
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </Button>
                <Button 
                  asChild 
                  size="lg"
                  variant="outline"
                  className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-6 sm:px-8 py-3"
                >
                  <a 
                    href="https://www.linkedin.com/groups/9380018" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <span className="hidden sm:inline">Join LinkedIn Group</span>
                    <span className="inline sm:hidden">Join Group</span>
                    <Users className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Resources Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Explore More</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover additional resources and opportunities on our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-blue-light rounded-full">
                      <BookOpen className="h-8 w-8 text-brand-blue" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Browse Jobs</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Find your next career opportunity in public health
                  </p>
                  <Button asChild variant="outline">
                    <a href="/jobs">View Jobs</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-green-light rounded-full">
                      <Users className="h-8 w-8 text-brand-green" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Find Organizations</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Connect with public health organizations and institutions
                  </p>
                  <Button asChild variant="outline">
                    <a href="/organizations">Explore Organizations</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-green-light rounded-full">
                      <BookOpen className="h-8 w-8 text-brand-green" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Browse Courses</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Discover courses and educational opportunities
                  </p>
                  <Button asChild variant="outline">
                    <a href="/courses">View Courses</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JoinUs;

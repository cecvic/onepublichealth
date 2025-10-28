import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Globe, Users, BookOpen, Star, MessageCircle } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main role="main">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-blue to-brand-green">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
                About <span className="text-brand-charcoal-dark">Us</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                One stop for everything public health.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  One Public Health was created by a group of passionate public health professionals who wanted to bring everything this field has to offer into one simple, accessible space. Whether you're a student exploring opportunities or a professional looking for your next step, we know how scattered the information can be and how much time that takes away from what truly matters.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="border-l-4 border-brand-green hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-green-light rounded-lg">
                        <BookOpen className="h-6 w-6 text-brand-green" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Comprehensive Resources</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Find jobs, explore courses, stay updated on the latest news, and connect with others in public health all in one place.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-brand-blue hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-brand-blue-light rounded-lg">
                        <Star className="h-6 w-6 text-brand-blue" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Community Reviews</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Rate and review your institutes or workplaces, helping others make better choices and creating a culture of transparency and shared growth.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Voices Magazine Section */}
              <div className="bg-brand-green-light rounded-lg p-8 mb-12">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-green rounded-lg">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">Voices Magazine</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    We have a Monthly Digital magazine called <strong>Voices</strong>, that promotes and celebrates the work of public health professionals across sectors, and provides information on various specializations and branches, through engaging and interactive content.
                  </p>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-6">Our Mission</h3>
                <div className="bg-white rounded-lg p-8 shadow-lg border border-border">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    At One Public Health, we're building more than a platform—we're building a community that supports, informs, and inspires everyone working to make the world a healthier place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-green-light rounded-full">
                      <Heart className="h-8 w-8 text-brand-green" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Accessibility</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Making public health information and opportunities accessible to everyone, regardless of background or location.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-blue-light rounded-full">
                      <Globe className="h-8 w-8 text-brand-blue" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Global Community</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connecting public health professionals worldwide to share knowledge, experiences, and opportunities.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-brand-green-light rounded-full">
                      <Users className="h-8 w-8 text-brand-green" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Collaboration</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Fostering partnerships and collaboration between individuals, institutions, and organizations in public health.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-green to-brand-blue">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Be part of the movement to make public health information more accessible and connected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/jobs"
                className="bg-white text-brand-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Explore Opportunities
              </a>
              <a
                href="/resources"
                className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-brand-green transition-colors"
              >
                Browse Resources
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

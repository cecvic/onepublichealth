import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Users, Target, Mail, Briefcase, GraduationCap, Calendar, Globe } from "lucide-react";

const Advertise = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main role="main">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-blue to-brand-green">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
                Advertise <span className="text-brand-charcoal-dark">With Us</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Have a job opening, course, or webinar you want to promote to the public health community?<br />
                We'd love to help you reach the right audience.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                One Public Health connects thousands of public health professionals, students, and organizations across India and beyond. By advertising with us, you can showcase your opportunities directly to people who care about making an impact in this field.
              </p>
            </div>

            {/* What You Can Advertise */}
            <div className="mb-16">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-brand-green-light rounded-lg">
                    <Megaphone className="h-8 w-8 text-brand-green" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">You can advertise:</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border-l-4 border-brand-green hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-brand-green-light rounded-lg">
                        <Briefcase className="h-8 w-8 text-brand-green" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Job Opportunities</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Job vacancies and fellowship openings to connect with qualified public health professionals.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-brand-blue hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-brand-blue-light rounded-lg">
                        <Calendar className="h-8 w-8 text-brand-blue" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Events & Webinars</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Upcoming webinars, workshops, and conferences to engage the public health community.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-brand-green hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-brand-green-light rounded-lg">
                        <GraduationCap className="h-8 w-8 text-brand-green" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">Training Programs</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Training programs and academic courses to help professionals advance their skills.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-brand-blue-light rounded-lg p-8 mb-12">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-brand-blue rounded-lg">
                    <Mail className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Get In Touch</h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  To collaborate or advertise with us, just drop us an email at
                </p>
                <div className="bg-white rounded-lg p-6 shadow-lg border border-border">
                  <a 
                    href="mailto:publichealthvoicesindia@gmail.com"
                    className="text-2xl font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors break-all"
                  >
                    📩 publichealthvoicesindia@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Why Advertise With Us */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground text-center mb-8">Why Choose One Public Health?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-brand-green-light rounded-lg">
                        <Users className="h-6 w-6 text-brand-green" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Targeted Audience</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Reach thousands of public health professionals, students, and organizations who are actively seeking opportunities in the field.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-brand-blue-light rounded-lg">
                        <Target className="h-6 w-6 text-brand-blue" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">High Engagement</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Our community is highly engaged and actively looking for opportunities to advance their careers and knowledge in public health.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-brand-green-light rounded-lg">
                        <Globe className="h-6 w-6 text-brand-green" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Wide Reach</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Connect with professionals across India and beyond, expanding your reach to a global public health community.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-brand-blue-light rounded-lg">
                        <Megaphone className="h-6 w-6 text-brand-blue" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">Multiple Channels</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Promote through our website, monthly Voices magazine, and social media channels for maximum visibility.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="text-center">
              <div className="bg-white rounded-lg p-8 shadow-lg border border-border">
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Commitment</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Together, let's make valuable opportunities more visible and accessible for everyone in public health.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-green to-brand-blue">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Reach the Public Health Community?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Start your advertising journey with us today and connect with the right audience.
            </p>
            <Button 
              size="lg"
              className="bg-white text-brand-green hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = 'mailto:publichealthvoicesindia@gmail.com'}
            >
              <Mail className="h-5 w-5 mr-2" />
              Contact Us Now
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Advertise;

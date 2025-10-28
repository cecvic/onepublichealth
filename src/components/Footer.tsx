import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Heart,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  const footerLinks = {
    explore: [
      { label: "Resources", href: "/resources" },
      { label: "News", href: "/news" },
      { label: "Magazines", href: "/magazines" },
      { label: "Jobs", href: "/jobs" },
      { label: "Courses", href: "/courses" },
      { label: "Organizations", href: "/organizations" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],

    connect: [
      { label: "Community Forum", href: "/community" },
      { label: "Events", href: "/events" },
      { label: "Newsletter", href: "#newsletter" },
      { label: "Partner With Us", href: "/partnership" },
      { label: "Support", href: "/support" },
    ],
  };

  return (
    <footer className="bg-brand-charcoal-dark text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/logo.png"
                alt="ONE PUBLIC HEALTH"
                className="h-16 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/80 mb-6 leading-relaxed">
              Your one-stop source for Public Health learning, careers, and community.
              Empowering health professionals across India with knowledge, opportunities, and connections.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-brand-blue rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-brand-blue rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-brand-blue rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:bg-brand-blue rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-brand-green transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-brand-green transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-white/70 mb-4 text-sm">
              Subscribe to our newsletter for the latest public health news and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-brand-green"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green-hover text-white"
              >
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Information */}
        <Separator className="my-8 bg-white/20" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-green/20 rounded-lg">
              <MapPin className="h-5 w-5 text-brand-green" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Address</h4>
              <p className="text-white/70 text-sm">
                123 Health Street, Medical District<br />
                New Delhi, India 110001
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-blue/20 rounded-lg">
              <Phone className="h-5 w-5 text-brand-blue" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Phone</h4>
              <p className="text-white/70 text-sm">
                +91 (11) 1234-5678<br />
                Mon-Fri, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-brand-green/20 rounded-lg">
              <Mail className="h-5 w-5 text-brand-green" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Email</h4>
              <p className="text-white/70 text-sm">
                info@onepublichealth.com<br />
                support@onepublichealth.com
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm text-center md:text-left">
            © {currentYear} One Public Health. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>for Public Health Professionals</span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/privacy"
              className="text-white/60 hover:text-brand-green transition-colors"
            >
              Privacy
            </Link>
            <span className="text-white/30">•</span>
            <Link
              to="/terms"
              className="text-white/60 hover:text-brand-green transition-colors"
            >
              Terms
            </Link>
            <span className="text-white/30">•</span>
            <Link
              to="/sitemap"
              className="text-white/60 hover:text-brand-green transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Accessibility Statement */}
      <div className="bg-brand-charcoal py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-white/50">
            We are committed to ensuring digital accessibility for people with disabilities.
            We are continually improving the user experience for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

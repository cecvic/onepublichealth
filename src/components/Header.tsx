import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";
import SignupModal from "./SignupModal";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.png" 
                alt="ONE PUBLIC HEALTH" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation">
            <Link
              to="/"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/resources"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              Resources
            </Link>
            <Link
              to="/news"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              News
            </Link>
            <Link
              to="/magazines"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              Magazines
            </Link>
            <Link
              to="/jobs"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              Jobs
            </Link>
            <Link
              to="/courses"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              Courses
            </Link>
            <Link
              to="/organizations"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              Organizations
            </Link>
            <Link
              to="/advertise"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              Advertise
            </Link>
            <Link
              to="/join-us"
              className="text-foreground hover:text-brand-primary transition-colors font-medium"
            >
              Join Us
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center">
            <Button 
              variant="primary" 
              size="default"
              className="focus-visible:ring-offset-2"
              onClick={() => setIsSignupModalOpen(true)}
            >
              Subscribe
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Signup Modal */}
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
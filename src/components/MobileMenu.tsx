import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Resources", href: "/resources" },
    { label: "News", href: "/news" },
    { label: "Magazines", href: "/magazines" },
    { label: "Jobs", href: "/jobs" },
    { label: "Courses", href: "/courses" },
    { label: "Organizations", href: "/organizations" },
    { label: "Advertise", href: "/advertise" },
    { label: "Join Us", href: "/join-us" },
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 z-[60] h-full w-64 bg-background border-l border-border shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-semibold">Menu</span>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        
        <nav className="p-4 space-y-2" role="navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block py-3 px-4 text-foreground hover:text-brand-primary hover:bg-muted rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={onClose}
              role="menuitem"
            >
              {item.label}
            </Link>
          ))}
          
          <div className="pt-4">
            <Button variant="primary" className="w-full" onClick={onClose}>
              Subscribe
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
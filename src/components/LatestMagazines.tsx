import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PDFViewer from "@/components/PDFViewer";
import { Download, Calendar, FileText, ArrowRight, Eye } from "lucide-react";
import client from "@/lib/contentful";
import { mapMagazineEntry, Magazine } from "@/utils/utils";

const LatestMagazines = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);

  useEffect(() => {
    const fetchLatestMagazines = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch from Contentful with content type "magazine" and include assets
        const res = await client.getEntries({
          content_type: "magazine",
          limit: 3, // Show only 3 latest magazines on homepage
          order: ["-sys.createdAt"],
          include: 2  // Include linked assets (depth of 2 to get referenced assets)
        });

        console.log("Contentful response:", res); // For debugging

        if (res.items.length > 0) {
          // Pass the assets from includes to the mapping function
          const mappedMagazines = res.items.map(item =>
            mapMagazineEntry(item, res.includes?.Asset)
          );

          setMagazines(mappedMagazines);
          setError(null);
        } else {
          // Show message when no magazines are found
          setMagazines([]);
          setError("No magazines found.");
        }
      } catch (err) {
        console.error("Error fetching magazines:", err);
        setMagazines([]);
        setError("Unable to fetch magazines. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMagazines();
  }, []);

  const handleDownload = async (magazine: Magazine) => {
    if (!magazine.pdfUrl) {
      console.error('No PDF URL available for this magazine');
      return;
    }

    try {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = magazine.pdfUrl;
      link.download = `${magazine.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloaded: ${magazine.title}`);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(magazine.pdfUrl, '_blank');
    }
  };

  const handleView = (magazine: Magazine) => {
    if (!magazine.pdfUrl) {
      console.error('No PDF URL available for this magazine');
      return;
    }
    setSelectedMagazine(magazine);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedMagazine(null);
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6">Latest Magazines</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  // Don't render the section if there are no magazines
  if (!magazines || magazines.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Latest Magazines</h2>
        <Link to="/magazines">
          <Button variant="link" className="p-0 text-brand-primary flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {magazines.map((magazine, index) => (
          <Card key={magazine.id} className="group relative p-4 hover:shadow-md hover:shadow-purple-100 transition-all duration-300 transform hover:-translate-y-1">
            {/* NEW Badge - only for the first (latest) magazine */}
            {index === 0 && (
              <div className="absolute -top-0 -right-0 z-10">
                <div className="relative">
                  {/* Red triangle background */}
                  <div className="w-0 h-0 border-l-[0px] border-r-[60px] border-b-[60px] border-r-red-500 border-b-transparent"></div>
                  {/* NEW text */}
                  <span className="absolute top-3 right-2 text-white text-xs font-bold transform rotate-45 origin-center">
                    NEW
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {/* Cover Image */}
              <div className="w-40 h-28 bg-muted rounded-md flex-shrink-0 relative overflow-hidden">
                {magazine.coverImage ? (
                  <img
                    src={magazine.coverImage}
                    alt={magazine.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-1 right-1">
                  <Badge variant="secondary" className="text-xs bg-background/80">
                    {magazine.issueNumber}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  {magazine.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {magazine.description}
                </p>

                {/* Meta Information */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{magazine.publishedDate}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  <Button
                    onClick={() => handleView(magazine)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
                    disabled={!magazine.pdfUrl}
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </Button>
                  <Button
                    onClick={() => handleDownload(magazine)}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1 transition-all duration-200 hover:bg-purple-50 hover:border-purple-300"
                    disabled={!magazine.pdfUrl}
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {selectedMagazine && (
        <PDFViewer
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
          pdfUrl={selectedMagazine.pdfUrl}
          title={selectedMagazine.title}
        />
      )}
    </section>
  );
};

export default LatestMagazines;
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PDFViewer from "@/components/PDFViewer";
import { Download, Calendar, FileText, Search, Filter, Eye } from "lucide-react";
import client from "@/lib/contentful";
import { mapMagazineEntry, Magazine } from "@/utils/utils";

const Magazines = () => {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [filteredMagazines, setFilteredMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);

  const fetchMagazines = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch from Contentful with content type "magazine" and include assets
      const res = await client.getEntries({
        content_type: "magazine",
        include: 2  // Include linked assets (depth of 2 to get referenced assets)
      });

      console.log("Contentful response:", res); // For debugging

      if (res.items.length > 0) {
        // Pass the assets from includes to the mapping function
        const mappedMagazines = res.items.map(item =>
          mapMagazineEntry(item, res.includes?.Asset)
        );

        setMagazines(mappedMagazines);
        setFilteredMagazines(mappedMagazines);
        setError(null);
      } else {
        // Show message when no magazines are found
        setMagazines([]);
        setFilteredMagazines([]);
        setError("No magazines found in Contentful.");
      }
    } catch (err) {
      console.error("Error fetching magazines:", err);
      setMagazines([]);
      setFilteredMagazines([]);
      setError("Unable to fetch magazines from Contentful. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMagazines();
  }, []);

  useEffect(() => {
    let filtered = magazines;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(magazine =>
        magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        magazine.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter(magazine => {
        // Extract year from date string like "September 4, 2025"
        const dateYear = magazine.publishedDate.split(', ').pop();
        return dateYear === selectedYear;
      });
    }

    setFilteredMagazines(filtered);
  }, [magazines, searchTerm, selectedYear]);

  const handleDownload = async (magazine: Magazine) => {
    try {
      if (!magazine.pdfUrl) {
        alert('PDF file is not available for download.');
        return;
      }

      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = magazine.pdfUrl;
      link.download = `${magazine.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`Downloaded: ${magazine.title}`);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      if (magazine.pdfUrl) {
        window.open(magazine.pdfUrl, '_blank');
      } else {
        alert('Unable to download the file. Please try again later.');
      }
    }
  };

  const handleView = (magazine: Magazine) => {
    if (!magazine.pdfUrl) {
      alert('PDF file is not available for viewing.');
      return;
    }
    setSelectedMagazine(magazine);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setSelectedMagazine(null);
  };

  const getUniqueYears = () => {
    const years = magazines.map(magazine => {
      // Extract year from date string like "September 4, 2025"
      const parts = magazine.publishedDate.split(', ');
      return parts[parts.length - 1]; // Get the last part which should be the year
    }).filter(Boolean);

    return Array.from(new Set(years)).sort().reverse();
  };

  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Page Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-blue to-brand-green">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
                Public Health <span className="text-brand-charcoal-dark">Magazines</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Download our monthly magazines featuring the latest research, insights, and developments in public health
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search magazines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="all">All Years</option>
                  {getUniqueYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <section className="px-4 sm:px-6 lg:px-8 mb-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Magazines Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading magazines...</p>
              </div>
            ) : filteredMagazines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMagazines.map((magazine) => (
                  <Card key={magazine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Cover Image */}
                    <div className="aspect-[3/4] bg-muted relative">
                      {magazine.coverImage ? (
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`fallback-icon w-full h-full flex items-center justify-center ${magazine.coverImage ? 'hidden' : ''}`}>
                        <FileText className="w-16 h-16 text-muted-foreground" />
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-background/80">
                          {magazine.issueNumber}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                        {magazine.title}
                      </h2>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {magazine.description}
                      </p>

                      {/* Meta Information */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{magazine.publishedDate}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleView(magazine)}
                          className="w-full flex items-center justify-center gap-2"
                          variant="outline"
                          disabled={!magazine.pdfUrl}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          onClick={() => handleDownload(magazine)}
                          className="w-full flex items-center justify-center gap-2"
                          variant="primary"
                          disabled={!magazine.pdfUrl}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No magazines found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedYear !== "all"
                    ? "Try adjusting your search or filters to see more results."
                    : "No magazines are currently available. Check back later for new issues."}
                </p>
              </div>
            )}

            {/* Results count */}
            {filteredMagazines.length > 0 && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredMagazines.length} of {magazines.length} magazine{filteredMagazines.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* PDF Viewer Modal */}
      {selectedMagazine && (
        <PDFViewer
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
          pdfUrl={selectedMagazine.pdfUrl}
          title={selectedMagazine.title}
        />
      )}
      <Footer />
    </>
  );
};

export default Magazines;
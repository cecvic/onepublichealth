import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ isOpen, onClose, pdfUrl, title }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullWidth, setIsFullWidth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
    setError('Failed to load PDF. Please try downloading the file instead.');
  };

  const handlePreviousPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const toggleFullWidth = () => {
    setIsFullWidth(prev => !prev);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setPageNumber(1);
    setScale(1.0);
    setIsFullWidth(false);
    setLoading(true);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`${isFullWidth ? 'max-w-[95vw]' : 'max-w-4xl'} w-full h-[95vh] p-0 flex flex-col`}>
        {/* Header with controls */}
        <DialogHeader className="p-4 border-b bg-muted/30 shrink-0">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-semibold truncate flex-1">
              {title}
            </DialogTitle>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Page Navigation */}
              {numPages > 0 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[5rem] text-center">
                    Page {pageNumber} of {numPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={pageNumber >= numPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Zoom Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[3.5rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={scale >= 2.5}
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {/* Full Width Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullWidth}
                title={isFullWidth ? "Normal Width" : "Full Width"}
              >
                {isFullWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>

              {/* Download Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </Button>

              {/* Close Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-4 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading PDF...</p>
              </div>
            </div>
          )}

          {error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-background p-8 rounded-lg shadow-lg">
                <p className="text-destructive mb-4 text-lg">{error}</p>
                <Button onClick={handleDownload} variant="default">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Instead
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Preparing document...</p>
                  </div>
                }
                error={
                  <div className="text-center py-12">
                    <p className="text-destructive">Failed to load PDF document.</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="shadow-lg"
                  loading={
                    <div className="bg-white dark:bg-gray-800 animate-pulse" style={{ width: '595px', height: '842px' }} />
                  }
                />
              </Document>
            </div>
          )}
        </div>

        {/* Footer with keyboard shortcuts hint */}
        <div className="p-2 border-t bg-muted/30 text-center shrink-0">
          <p className="text-xs text-muted-foreground">
            Use arrow buttons or keyboard ← → to navigate pages
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;

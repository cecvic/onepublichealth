import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Resources from "./pages/Resources";
import Jobs from "./pages/Jobs";
import JobsOld from "./pages/JobsOld";
import Magazines from "./pages/Magazines";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import Organizations from "./pages/Organizations";
import OrganizationDetail from "./pages/OrganizationDetail";
import Courses from "./pages/Courses";
import News from "./pages/News";
import About from "./pages/About";
import Advertise from "./pages/Advertise";
import JoinUs from "./pages/JoinUs";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:id" element={<BlogPost />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs-old" element={<JobsOld />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/organizations/:id" element={<OrganizationDetail />} />
          <Route path="/magazines" element={<Magazines />} />
          <Route path="/news" element={<News />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import LatestResources from "./LatestResources";
import LatestMagazines from "./LatestMagazines";
import LatestJobs from "./LatestJobs";
import LatestNews from "./LatestNews";

const ContentGrid = () => {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            {/* Latest Resources */}
            <LatestResources />

            {/* Latest Magazines */}
            <LatestMagazines />
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Latest Jobs */}
            <LatestJobs />
            <LatestNews />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGrid;
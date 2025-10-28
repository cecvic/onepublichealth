import { Link } from "react-router-dom";
import { WarpBackground } from "@/components/ui/warp-background";

const HeroSection = () => {
  return (
    <>
      <style>
        {`
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
        }

        .hero-gradient-modern {
            background: linear-gradient(165deg,
                #1a5f7a 0%,
                #1b8ebf 40%,
                #2db67d 100%
            );
            position: relative;
        }

        .hero-gradient-modern::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(165deg,
                rgba(29, 182, 125, 0.1) 0%,
                rgba(27, 142, 191, 0.1) 50%,
                rgba(26, 95, 122, 0.1) 100%
            );
            opacity: 0.5;
        }
        `}
      </style>

      <section className="relative w-full flex items-center justify-center min-h-screen overflow-hidden hero-gradient-modern">
        {/* Content with WarpBackground effect */}
        <div className="relative z-10 container mx-auto px-6 md:px-8 text-center w-full">
          <WarpBackground
            className="animate-fadeInUp max-w-5xl mx-auto border-0 p-10 sm:p-16 md:p-20 bg-transparent"
            perspective={400}
            beamsPerSide={4}
            beamSize={8}
            beamDelayMax={4}
            beamDelayMin={1}
            beamDuration={4}
            gridColor="rgba(255, 255, 255, 0.15)"
          >
            <h1
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ lineHeight: 1.15, color: '#2C3740' }}
            >
              Your one-stop source for{" "}
              <span className="block mt-2 font-extrabold" style={{ color: '#3D4B52' }}>
                Public Health
              </span>
              <span className="block mt-2 font-bold" style={{ color: '#2C3740' }}>
                learning, careers, community
              </span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#3D4B52' }}>
              Explore programs, jobs, research resources, and insights—all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
              <Link
                to="/resources"
                className="group relative bg-brand-charcoal-dark text-white px-8 py-4 rounded-lg font-semibold text-base hover:bg-brand-charcoal hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Explore Resources
              </Link>
              <Link
                to="/jobs"
                className="group relative bg-white text-brand-charcoal-dark border-2 border-brand-charcoal px-8 py-4 rounded-lg font-semibold text-base hover:bg-brand-charcoal-dark hover:text-white hover:border-brand-charcoal-dark transition-all duration-200"
              >
                Browse Jobs
              </Link>
            </div>
          </WarpBackground>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium" style={{ color: '#3D4B52' }}>Scroll</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="#3D4B52"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
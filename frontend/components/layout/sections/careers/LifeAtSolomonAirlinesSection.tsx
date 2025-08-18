"use client";
import React from "react";
import parse from "html-react-parser";

interface ImageBlock {
  url: string;
}

interface CompanyCultureHighlightBlock {
  title: string;
  description: string;
  image: ImageBlock;
}

interface LifeAtSolomonAirlinesSectionProps {
  cultureHighlights?: CompanyCultureHighlightBlock[];
}

const LifeAtSolomonAirlinesSection = ({
  cultureHighlights = [],
}: LifeAtSolomonAirlinesSectionProps) => {
  // Fallback data if no culture highlights are provided
  const defaultHighlights = [
    {
      title: "Professional Growth",
      description:
        "Opportunities for development and career advancement in the aviation industry",
      image: { url: "/hero.jpg" },
    },
  ];

  const highlights =
    cultureHighlights.length > 0 ? cultureHighlights : defaultHighlights;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-edmondsans text-blue-500 mb-4">
            Life at Solomon Airlines
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mx-auto px-4">
            Experience the unique culture of working in paradise while
            connecting the Pacific
          </p>
        </div>

        {highlights.map((highlight, index) => (
          <div key={index} className="mb-12 sm:mb-16">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-center">
              {/* Image always comes first on mobile, alternates on desktop */}
              <div
                className={`order-1 ${
                  index % 2 === 0 ? "lg:order-last" : "lg:order-first"
                }`}
              >
                <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={highlight.image.url || "/hero.jpg"}
                    alt={highlight.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Text comes second on mobile, alternates on desktop */}
              <div
                className={`order-2 ${
                  index === highlights.length - 1 ? "mb-0" : "mb-6 sm:mb-8"
                } lg:mb-0 ${
                  index % 2 === 0 ? "lg:order-first" : "lg:order-last"
                }`}
              >
                <h3 className="text-xl sm:text-2xl font-edmondsans text-blue-500 mb-4 sm:mb-6">
                  {highlight.title}
                </h3>
                <div className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {parse(highlight.description)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LifeAtSolomonAirlinesSection;

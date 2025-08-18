"use client";
import React from "react";

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

const LifeAtSolomonAirlinesSection = ({ cultureHighlights = [] }: LifeAtSolomonAirlinesSectionProps) => {
  // Fallback data if no culture highlights are provided
  const defaultHighlights = [
    {
      title: "Island Paradise Workplace",
      description: "Experience the unique culture of working in paradise while connecting the Pacific",
      image: { url: "/hero.jpg" }
    },
    {
      title: "Family-First Culture", 
      description: "We prioritize work-life balance and foster a supportive, family-oriented environment",
      image: { url: "/hero.jpg" }
    },
    {
      title: "Professional Growth",
      description: "Opportunities for development and career advancement in the aviation industry",
      image: { url: "/hero.jpg" }
    }
  ];

  const highlights = cultureHighlights.length > 0 ? cultureHighlights : defaultHighlights;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-500 mb-4">
            Life at Solomon Airlines
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the unique culture of working in paradise while
            connecting the Pacific
          </p>
        </div>

        {highlights.map((highlight, index) => (
          <div key={index} className="mb-16">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Alternate layout: odd index = image on right, even index = image on left */}
              <div className={`mb-8 lg:mb-0 ${index % 2 === 0 ? 'lg:order-first' : 'lg:order-last'}`}>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  {highlight.title}
                </h3>
                <div 
                  className="text-lg text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlight.description }}
                />
              </div>
              <div className={`${index % 2 === 0 ? 'lg:order-last' : 'lg:order-first'}`}>
                <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={highlight.image.url || "/hero.jpg"}
                    alt={highlight.title}
                    className="w-full h-full object-cover"
                  />
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
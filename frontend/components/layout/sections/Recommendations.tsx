"use client";
import DestinationCard from "@/components/ui/cards/DestinationCard";
import RecommendationCarousel from "@/components/layout/carousel/RecommendationCarousel";
import {
  fetchAllDestinations,
  Destination,
} from "@/graphql/DestinationIndexPageQuery";
import { useEffect, useState } from "react";

interface RecommendationsProps {
  heading?: string;
  excludeCountry?: string;
}

function Recommendations({
  heading = "You might also like...",
  excludeCountry,
}: RecommendationsProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchAllDestinations().then((data) => {
      setDestinations(data);
    });
  }, []);

  // Filter out the excluded country if provided
  const filtered = excludeCountry
    ? destinations.filter((d) => d.country !== excludeCountry)
    : destinations;

  // Shuffle the filtered destinations for random order and limit to 5
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  const randomized = shuffleArray(filtered).slice(0, 5);

  // Always render the structure, but only show cards if data exists
  return (
    <div className="space-y-8">
      <h2 className="text-xl sm:text-xl lg:text-2xl font-semibold text-blue-500 text-center">
        {heading}
      </h2>

      {/* Mobile: Carousel */}
      <div className="lg:hidden">
        <RecommendationCarousel
          slides={randomized.map((dest) => ({
            image: dest.heroImage.url,
            title: dest.country,
            label: dest.heroTitle,
            url: dest.url,
          }))}
          options={{ align: "start", loop: false }}
        />
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid grid-cols-3 gap-4 h-auto">
        {/* Left column: two stacked cards */}
        <div className="space-y-4 h-full flex flex-col">
          <div className="h-[12rem] sm:h-[12rem] lg:h-[12rem]">
            {randomized[0] && (
              <DestinationCard
                title={randomized[0].country}
                image={randomized[0].heroImage.url}
                url={randomized[0].url}
                label={randomized[0].heroTitle}
              />
            )}
          </div>
          <div className="h-[12rem] sm:h-[12rem] lg:h-[12rem]">
            {randomized[1] && (
              <DestinationCard
                title={randomized[1].country}
                image={randomized[1].heroImage.url}
                url={randomized[1].url}
                label={randomized[1].heroTitle}
              />
            )}
          </div>
        </div>

        {/* Middle column: single tall card */}
        <div className="h-[12rem] lg:h-full flex flex-col justify-center">
          {randomized[2] && (
            <DestinationCard
              title={randomized[2].country}
              image={randomized[2].heroImage.url}
              url={randomized[2].url}
              label={randomized[2].heroTitle}
            />
          )}
        </div>

        {/* Right column: two stacked cards */}
        <div className="space-y-4 h-full flex flex-col">
          <div className="h-[12rem] sm:h-[12rem] lg:h-[12rem]">
            {randomized[3] && (
              <DestinationCard
                title={randomized[3].country}
                image={randomized[3].heroImage.url}
                url={randomized[3].url}
                label={randomized[3].heroTitle}
              />
            )}
          </div>
          <div className="h-[12rem] sm:h-[12rem] lg:h-[12rem]">
            {randomized[4] && (
              <DestinationCard
                title={randomized[4].country}
                image={randomized[4].heroImage.url}
                url={randomized[4].url}
                label={randomized[4].heroTitle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;

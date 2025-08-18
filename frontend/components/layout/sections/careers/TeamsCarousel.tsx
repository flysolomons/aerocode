"use client";

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import {
  DotButton,
  useDotButton,
} from "@/components/layout/carousel/DotButton";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import parse from "html-react-parser";

export type Team = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

type PropType = {
  teams: Team[];
  options?: EmblaOptionsType;
};

const TeamsCarousel: React.FC<PropType> = (props) => {
  const { teams, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  // Prev/Next button logic
  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = React.useState(false);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setPrevBtnEnabled(emblaApi.canScrollPrev());
      setNextBtnEnabled(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="embla">
      <div className="relative">
        {/* Show prev/next arrows on desktop only */}
        <button
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 rounded-full shadow-lg p-3 text-white hover:bg-yellow-300 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          aria-label="Previous team"
          style={{ marginLeft: "-1.5rem" }}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {teams.map((team, index) => (
              <div className="embla__slide" key={index}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[32rem] lg:h-[36rem] flex">
                  {/* Image - 3/4 width */}
                  <div className="relative w-3/4 group overflow-hidden">
                    <Image
                      src={team.imageSrc}
                      alt={team.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Text Content - 1/4 width */}
                  <div className="w-1/4 p-6 lg:p-8 flex flex-col justify-center bg-gray-50">
                    <h3 className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 mb-3 lg:mb-4 leading-tight">
                      {team.title}
                    </h3>
                    <div className="text-sm lg:text-base text-gray-600 leading-relaxed">
                      {parse(team.description)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-blue-500 rounded-full shadow-lg p-3 text-white hover:bg-yellow-300 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          aria-label="Next team"
          style={{ marginRight: "-1.5rem" }}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="embla__controls">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : ""
              )}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .embla__container {
          display: flex;
          flex-direction: row;
          gap: 1rem;
        }
        .embla__slide {
          min-width: 0;
          margin-left: 0 !important;
          background: transparent !important;
          border: none !important;
          flex: 0 0 100%;
        }
      `}</style>
    </section>
  );
};

export default TeamsCarousel;

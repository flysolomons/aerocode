import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./DotButton";
import useEmblaCarousel from "embla-carousel-react";
// import SpecialCard from "@/components/ui/cards/SpecialCard";
import DestinationCard from "@/components/ui/cards/DestinationCard";
import Image from "next/image";

// Use the destination type for recommendations
export type Destination = {
  image: string;
  title: string;
  label: string;
  url: string;
};

type PropType = {
  slides: Destination[];
  options?: EmblaOptionsType;
};

const RecommendationCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
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
        {/* Show prev/next arrows on desktop only (hidden on mobile, flex on sm+) */}
        <button
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 text-gray-700 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          aria-label="Previous"
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
            {slides.map((slide, index) => (
              <div
                className="embla__slide rounded-3xl overflow-hidden bg-transparent border-0"
                key={index}
              >
                <DestinationCard
                  image={slide.image}
                  title={slide.title}
                  label={slide.label}
                  url={slide.url}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 text-gray-700 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          aria-label="Next"
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
        }
        @media (min-width: 640px) {
          .embla__slide {
            flex: 0 0 35%;
          }
        }
        @media (min-width: 1024px) {
          .embla__slide {
            flex: 0 0 30.5%;
          }
        }
      `}</style>
    </section>
  );
};

export default RecommendationCarousel;

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./DotButton";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

type SlideType = {
  imageUrl: string;
  country: string;
  subtitle: string;
  url?: string;
};

type PropType = {
  slides: SlideType[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
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
              <div className="embla__slide" key={index}>
                <a
                  href={slide.url || "#"}
                  tabIndex={0}
                  aria-label={slide.country}
                  className="block focus:outline-none "
                >
                  <div className="embla__slide__image group overflow-hidden">
                    <Image
                      src={slide.imageUrl}
                      alt={`${slide.country} - Slide ${index + 1}`}
                      fill
                      className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-110 border-4 border-white"
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-3 rounded-lg">
                      <div className="text-xl md:text-2xl font-bold font-sans">
                        {slide.country}
                      </div>
                      <div className="text-sm md:text-base text-gray-200 mt-1">
                        {slide.subtitle}
                      </div>
                    </div>
                  </div>
                </a>
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
      `}</style>
    </section>
  );
};

export default EmblaCarousel;

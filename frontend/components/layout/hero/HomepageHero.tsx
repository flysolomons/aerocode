// HomePage Hero with Embla Carousel

import React, { useState, useCallback, useEffect } from "react";
import BookingWidget from "../booking-widget/BookingWidget";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, useDotButton } from "../carousel/DotButton";

interface CarouselSlide {
  slide: {
    title: string;
    image: {
      url: string;
    };
  };
  sortOrder: number;
}

interface HomePageHeroProps {
  carouselSlides: CarouselSlide[];
  showBookingWidget?: boolean;
}

export default function HomePageHero({
  carouselSlides,
  showBookingWidget = true,
}: HomePageHeroProps) {
  const [isBookingModalActive, setIsBookingModalActive] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 0, // Instant slide change
      dragFree: false,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 7000, stopOnInteraction: false })] // 10 second autoplay
  );

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  // Prev/Next button logic
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setPrevBtnEnabled(emblaApi.canScrollPrev());
      setNextBtnEnabled(emblaApi.canScrollNext());
      setCurrentSlideIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!carouselSlides.length) {
    return <div>No carousel slides available</div>;
  }

  return (
    <main>
      <div className="relative">
        <div className="absolute inset-0">
          {/* Fade Transition Slides */}
          {carouselSlides.map((slideData, index) => {
            const isActive = index === selectedIndex;
            return (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all ease-linear ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                    style={{
                      backgroundImage: `url(${slideData.slide.image.url})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/15"></div>
                </div>
              </div>
            );
          })}

          {/* Hidden Embla for navigation logic */}
          <div
            className="homepage-hero-embla opacity-0 pointer-events-none"
            ref={emblaRef}
          >
            <div className="homepage-hero-embla__container">
              {carouselSlides.map((_, index) => (
                <div key={index} className="homepage-hero-embla__slide">
                  <div className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - moved closer to center */}
          {carouselSlides.length > 1 && (
            <>
              <button
                className="hidden md:block absolute left-8 md:left-12 lg:left-16 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                aria-label="Previous slide"
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
              <button
                className="hidden md:block absolute right-8 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                aria-label="Next slide"
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
            </>
          )}
        </div>

        <div className="relative h-[calc(100vh)]">
          <div
            className={`relative flex flex-col items-center justify-center h-1/2 text-white text-center space-y-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0 transition-opacity duration-300 z-10 ${
              isBookingModalActive ? "xl:opacity-0" : "opacity-100"
            }`}
          >
            <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-veneer max-w-4xl lg:max-w-5xl transition-all duration-1000 ease-out transform">
              {carouselSlides[selectedIndex]?.slide.title ||
                "Connecting the Hapi Isles"}
            </h1>
          </div>

          <div className="md:-mt-8 lg:-mt-10 xl:-mt-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0 z-10 relative">
            {showBookingWidget && (
              <BookingWidget onModalStateChange={setIsBookingModalActive} />
            )}
          </div>

          {/* Navigation Dots - moved to right */}
          {carouselSlides.length > 1 && (
            <div className="absolute bottom-20 md:bottom-24 right-8 z-10">
              <div className="flex space-x-2">
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === selectedIndex
                        ? "bg-white"
                        : "bg-gray-400 hover:bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Animated scroll down indicator */}
          <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 xl:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-6 xl:h-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      <style jsx>{`
        .homepage-hero-embla {
          overflow: hidden;
        }
        .homepage-hero-embla__container {
          display: flex;
          height: 100%;
        }
        .homepage-hero-embla__slide {
          flex: 0 0 100%;
          min-width: 0;
          height: 100%;
        }
      `}</style>
    </main>
  );
}

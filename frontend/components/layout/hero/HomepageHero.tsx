// HomePage Hero with Embla Carousel

import React, { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import BookingWidget from "../booking-widget/BookingWidget";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { DotButton, useDotButton } from "../carousel/DotButton";
import parse from "html-react-parser";
import HeroBottomFade from "./HeroBottomFade";

interface CarouselSlide {
  slide: {
    title: string;
    subheading?: string | null;
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

const HomePageHero = React.memo(function HomePageHero({
  carouselSlides,
  showBookingWidget = true,
}: HomePageHeroProps) {
  const [isBookingModalActive, setIsBookingModalActive] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [resumeTimeoutId, setResumeTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Preload first image

  // Memoize autoplay plugin to avoid recreation
  const autoplayPlugin = useMemo(() => {
    return Autoplay({ delay: 7000, stopOnInteraction: false });
  }, []);

  // Memoize embla config to avoid recreation
  const emblaConfig = useMemo(
    () => ({
      loop: true,
      duration: 0,
      dragFree: false,
      containScroll: "trimSnaps" as const,
    }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaConfig, [autoplayPlugin]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  // Prev/Next button logic
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      setPrevBtnEnabled(emblaApi.canScrollPrev());
      setNextBtnEnabled(emblaApi.canScrollNext());
      setCurrentSlideIndex(newIndex);

      // Preload next and previous images
      const nextIndex = (newIndex + 1) % carouselSlides.length;
      const prevIndex =
        (newIndex - 1 + carouselSlides.length) % carouselSlides.length;

      setLoadedImages(
        (prev) => new Set([...prev, newIndex, nextIndex, prevIndex])
      );
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, carouselSlides.length]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutId) {
        clearTimeout(resumeTimeoutId);
      }
    };
  }, [resumeTimeoutId]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      // Reset autoplay timer
      const autoplayPlugin = emblaApi.plugins().autoplay;
      if (autoplayPlugin) {
        autoplayPlugin.stop();
        autoplayPlugin.play();
      }
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      // Reset autoplay timer
      const autoplayPlugin = emblaApi.plugins().autoplay;
      if (autoplayPlugin) {
        autoplayPlugin.stop();
        autoplayPlugin.play();
      }
    }
  }, [emblaApi]);

  // Handle navigation dot clicks
  const handleDotClick = useCallback(
    (index: number) => {
      // Navigate to the selected slide
      onDotButtonClick(index);

      if (!emblaApi) return;

      // Reset autoplay timer
      const autoplayPlugin = emblaApi.plugins().autoplay;
      if (autoplayPlugin) {
        autoplayPlugin.stop();
        autoplayPlugin.play();
      }
    },
    [emblaApi, onDotButtonClick]
  );

  // Handle subheading link clicks
  const handleSubheadingClick = useCallback(
    (e: React.MouseEvent) => {
      // Check if clicked element is a link
      if ((e.target as HTMLElement).tagName === "A") {
        if (!emblaApi) return;

        // Stop current autoplay
        const autoplayPlugin = emblaApi.plugins().autoplay;
        if (autoplayPlugin) {
          autoplayPlugin.stop();

          // Clear any existing resume timeout
          if (resumeTimeoutId) {
            clearTimeout(resumeTimeoutId);
          }

          // Set new timeout to resume after 10 seconds
          const timeoutId = setTimeout(() => {
            autoplayPlugin.play();
            setResumeTimeoutId(null);
          }, 10000);

          setResumeTimeoutId(timeoutId);
        }
      }
    },
    [emblaApi, resumeTimeoutId]
  );

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
            const shouldLoad = loadedImages.has(index) || index === 0; // Always load first image

            return (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative w-full h-full overflow-hidden">
                  {shouldLoad && (
                    <Image
                      src={slideData.slide.image.url}
                      alt={slideData.slide.title}
                      fill
                      className={`object-cover transition-transform duration-&lsqb;9000ms&rsqb; ease-linear ${
                        isActive ? "scale-110" : "scale-100"
                      }`}
                      priority={index === 0} // Priority load for first image
                      fetchPriority={index === 0 ? "high" : "auto"} // High priority for LCP image
                      quality={85} // Optimize quality vs size
                      sizes="100vw"
                      onLoad={() => {
                        // Mark image as loaded for smoother transitions
                        setLoadedImages((prev) => new Set([...prev, index]));
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/15"></div>
                </div>
              </div>
            );
          })}

          <HeroBottomFade />

          {/* Hidden Embla for navigation logic */}
          <div
            className="overflow-hidden opacity-0 pointer-events-none"
            ref={emblaRef}
          >
            <div className="flex h-full">
              {carouselSlides.map((_, index) => (
                <div key={index} className="flex-none w-full h-full min-w-0">
                  <div className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
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
            className={`relative flex flex-col items-center justify-center h-1/2 text-white text-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0 transition-opacity duration-300 ${
              isBookingModalActive ? "xl:opacity-0" : "opacity-100"
            }`}
          >
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-veneer max-w-4xl lg:max-w-5xl">
              {carouselSlides[selectedIndex]?.slide.title ||
                "Connecting the Hapi Isles"}
            </h1>
            {carouselSlides[selectedIndex]?.slide.subheading &&
              carouselSlides[selectedIndex].slide.subheading.trim() && (
                <div
                  className="text-sm sm:text-base md:text-base lg:text-base max-w-3xl lg:max-w-4xl md:mt-0 opacity-90 font-sans [&_a]:underline"
                  onClick={handleSubheadingClick}
                >
                  {parse(carouselSlides[selectedIndex].slide.subheading)}
                </div>
              )}
          </div>
          <div className="md:-mt-8 lg:-mt-10 xl:-mt-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0">
            {showBookingWidget && (
              <BookingWidget onModalStateChange={setIsBookingModalActive} />
            )}
          </div>
          {/* Navigation Dots - centered on mobile, right on desktop */}
          {carouselSlides.length > 1 && (
            <div className="absolute bottom-8 md:bottom-16 left-1/2 md:left-auto md:right-8 transform -translate-x-1/2 md:transform-none z-10">
              <div className="flex space-x-2">
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    onClick={() => handleDotClick(index)}
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

          {/* Animated scroll down indicator - hidden on mobile */}
          <div className="hidden md:block absolute bottom-16 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10">
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
                d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

    </main>
  );
});

export default HomePageHero;

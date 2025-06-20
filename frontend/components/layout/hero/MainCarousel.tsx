"use client";

import React, { useState, useEffect } from "react";
import BookingWidget from "@/components/layout/booking-widget/BookingWidget";
// import { animate, svg, stagger } from "animejs";
// import InViewWrapper from "../common/InViewWrapper";
const MainCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      type: "video",
      src: "https://videos.pexels.com/video-files/3326928/3326928-hd_1920_1080_24fps.mp4",
    },
  ];

  // Auto-slide effect (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [slides.length]);

  // Handle manual slide navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[calc(100vh)] overflow-hidden">
      {/* Carousel Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.type === "video" ? (
            <video
              className="w-full h-full object-cover"
              src={slide.src}
              autoPlay={currentSlide === index} // Play video when slide is active
              loop
              muted // Muted for autoplay compatibility in browsers
              playsInline // Ensures video plays inline on mobile
            />
          ) : (
            <img
              src={slide.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}{" "}
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 md:w-3 md:h-3 rounded-full transition-all duration-200 ${
              currentSlide === index
                ? "bg-white"
                : "bg-gray-400 hover:bg-gray-300"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}{" "}
      </div>
      {/* Content positioned absolutely for centering on mobile, original positioning on desktop */}
      <div className="absolute inset-0 flex flex-col justify-center items-center md:relative md:mt-80 md:justify-start">
        <div className="relative flex flex-col items-center justify-center text-white text-center mb-6 md:mb-0 md:h-1/2">
          {/* <InViewWrapper className="text-5xl font-bold mb-4 animate__animated animate__fadeInUp w-full"> */}
          <h2 className="flex justify-center text-3xl sm:text-3xl md:text-5xl font-bold font-sans mb-4 px-4 leading-tight">
            Connecting the Hapi Isles
          </h2>
          {/* </InViewWrapper> */}
        </div>
        <div className="px-4 md:px-0 w-full">
          <BookingWidget />
        </div>
      </div>
    </div>
  );
};

export default MainCarousel;

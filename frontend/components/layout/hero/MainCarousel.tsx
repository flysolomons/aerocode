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
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>

      <div className="mt-80">
        <div className="relative flex flex-col items-center justify-center h-1/2 text-white text-center">
          {/* <InViewWrapper className="text-5xl font-bold mb-4 animate__animated animate__fadeInUp w-full"> */}
          <h2 className="flex justify-center text-5xl font-bold font-sans mb-4">
            Connecting the Hapi Isles
          </h2>
          {/* </InViewWrapper> */}
        </div>
        <BookingWidget />
      </div>
    </div>
  );
};

export default MainCarousel;

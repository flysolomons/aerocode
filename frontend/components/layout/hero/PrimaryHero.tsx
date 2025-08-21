// props: card title, image

import React, { useState } from "react";
import Image from "next/image";
import BookingWidget from "../booking-widget/BookingWidget";
import StrippedBookingWidget from "../booking-widget/StrippedBookingWidget";
import BreadcrumbNav from "../BreadcrumbNav";
import HeroBottomFade from "./HeroBottomFade";

interface PrimaryHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  breadcrumbs?: string;
  widget?: string;
  showBookingWidget?: boolean;
}

export default function PrimaryHero({
  title,
  subtitle,
  image,
  breadcrumbs,
  widget,
  showBookingWidget = true,
}: PrimaryHeroProps) {
  const [isBookingModalActive, setIsBookingModalActive] = useState(false);
  return (
    <main>
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/15"></div>
          <HeroBottomFade color="#FFFFFF" />
        </div>
        <div className="relative h-[calc(100vh)]">
          <div
            className={`relative flex flex-col items-center justify-center h-1/2 text-white text-center space-y-3 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0 transition-opacity duration-300 ${
              isBookingModalActive ? "xl:opacity-0" : "opacity-100"
            }`}
          >
            <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-veneer max-w-4xl lg:max-w-5xl transition-all duration-1000 ease-out transform">
              {title}
            </h1>
            <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg">
              <BreadcrumbNav breadcrumbs={breadcrumbs} />
            </div>
          </div>
          <div className="items-center justify-items-center">
            <h2 className="font-semibold text-3xl w-3/4 text-white  lg:text-4xl lg:w-2/4 text-center">
              {subtitle}
            </h2>
          </div>
          <div className="md:-mt-8 lg:-mt-10 xl:-mt-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-0">
            {showBookingWidget && (
              <>
                {widget === "stripped" ? (
                  <StrippedBookingWidget />
                ) : (
                  <BookingWidget onModalStateChange={setIsBookingModalActive} />
                )}
              </>
            )}
          </div>
          {/* Animated scroll down indicator */}
          <div className="absolute bottom-16 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce z-10">
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
}

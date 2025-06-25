// props: card title, image

import React, { useState } from "react";
import BookingWidget from "../booking-widget/BookingWidget";
import StrippedBookingWidget from "../booking-widget/StrippedBookingWidget";
import BreadcrumbNav from "../BreadcrumbNav";

interface PrimaryHeroProps {
  title: string;
  image: string;
  breadcrumbs?: string;
  widget?: string;
  showBookingWidget?: boolean;
}

export default function PrimaryHero({
  title,
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
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
          <div className="absolute inset-0 bg-black/15"></div>
        </div>
        <div className="relative h-[calc(100vh)]">
          <div
            className={`relative flex flex-col items-center justify-center h-1/2 text-white text-center space-y-3 px-4 sm:px-6 md:px-8 lg:px-0 transition-opacity duration-300 ${
              isBookingModalActive ? "xl:opacity-0" : "opacity-100"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold font-sans max-w-4xl">
              {title}
            </h1>
            <div className="text-xs sm:text-sm md:text-base lg:text-base">
              <BreadcrumbNav breadcrumbs={breadcrumbs} />
            </div>
          </div>
          <div className="md:-mt-8 lg:-mt-12 px-4 sm:px-6 md:px-8 lg:px-0">
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
          <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
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
    </main>
  );
}

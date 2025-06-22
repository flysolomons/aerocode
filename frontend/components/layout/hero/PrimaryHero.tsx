// props: card title, image

import React from "react";
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
        </div>{" "}
        <div className="relative h-[calc(100vh)]">
          <div className="relative flex flex-col items-center justify-center h-1/2 text-white text-center space-y-3 px-4 sm:px-6 md:px-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans">
              {title}
            </h1>
            <div className="text-xs sm:text-sm lg:text-base">
              <BreadcrumbNav breadcrumbs={breadcrumbs} />
            </div>
          </div>
          <div className="md:-mt-12 px-4 sm:px-6 md:px-0">
            {showBookingWidget && (
              <>
                {widget === "stripped" ? (
                  <StrippedBookingWidget />
                ) : (
                  <BookingWidget />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

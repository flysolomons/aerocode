"use client";
import { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import RouteSpecialCard from "@/components/ui/cards/RouteSpecialCard";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
import Slider from "@/components/layout/Slider";
import { SpecialPage } from "@/graphql/SpecialPageQuery";
import { stripHtmlTags } from "@/lib/utils";
import ThumbnailCarousel from "@/components/layout/carousel/ThumbnailCarouselRouteSpecialCard";
import StrippedBookingWidget from "@/components/layout/booking-widget/StrippedBookingWidget";
import FlightSpecialInformation from "@/components/layout/sections/FlightSpecialInformation";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import ThumbnailCarouselSpecialCard from "@/components/layout/carousel/ThumbnailCarouselSpecialCard";

// Helper function to format dates in a readable format
function formatDate(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

interface SpecialPageTemplateProps {
  initialPage: (SpecialPage & { specials?: any[] }) | null;
  loading?: boolean;
}

export default function SpecialPageTemplate({
  initialPage,
  loading = false,
}: SpecialPageTemplateProps) {
  const [gradientStartColor, setGradientStartColor] = useState("transparent");
  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 sm:h-8 w-48 sm:w-64 bg-gray-200 rounded mb-3 sm:mb-4"></div>
          <div className="h-3 sm:h-4 w-32 sm:w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // console.log("Initial Page Data:", initialPage);

  // Handle null page data
  if (!initialPage) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-2">
            Special not found
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            The special offer you're looking for is not available.
          </p>
        </div>
      </div>
    );
  }
  const {
    heroTitle,
    heroImage,
    name,
    url,
    startDate,
    endDate,
    description,
    termsAndConditions,
    specialRoutes = [],
    bookingClass,
    discount,
    tripType,
    flightScope,
    travelPeriods,
  } = initialPage;

  // Extract specials for the carousel
  const specials = initialPage?.specials || [];

  return (
    <>
      <SecondaryHero
        title={heroTitle || name || "Special Offer"}
        image={heroImage?.url || "/hero.jpg"}
        breadcrumbs={url}
        onColorCalculated={setGradientStartColor}
      />
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
          <StrippedBookingWidget id="stripped-booking-widget" />

          {/* Description with validity period */}
          <div className="w-full mx-auto space-y-8 sm:space-y-8">
            {description && (
              <p className="text-sm sm:text-base lg:text-base text-center text-gray-700 leading-relaxed">
                {description}
              </p>
            )}
            <FlightSpecialInformation
              bookingClass={bookingClass}
              discount={discount}
              tripType={tripType}
              flightScope={flightScope}
              travelPeriods={travelPeriods}
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          {/* Route specials section */}
          {specialRoutes && specialRoutes.length > 0 && (
            <RouteSpecialSection
              heading={`Associated Routes`}
              description="Take advantage of our special fares on these popular routes."
              specials={specialRoutes}
            />
          )}

          {/* Terms and conditions section */}
          {termsAndConditions && (
            <div className="w-full px-0">
              <details className="group border border-gray-200 rounded-2xl bg-gray-50 shadow-lg w-full">
                <summary className="flex flex-row items-center justify-between cursor-pointer px-6 py-4 focus:outline-none">
                  <h2 className="text-2xl sm:text-2xl lg:text-2xl font-bold text-blue-500 text-left w-full">
                    Terms & Conditions
                  </h2>
                  <span className="ml-4 transition-transform group-open:rotate-180 flex-shrink-0">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="prose prose-sm sm:prose lg:prose-lg max-w-none w-full px-6 pb-6 pt-2 text-left">
                  <div
                    dangerouslySetInnerHTML={{ __html: termsAndConditions }}
                  />
                </div>
              </details>
            </div>
          )}

          {/*This section will display specials carousel NOT route specials */}
          <div className="w-full mx-auto text-center space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
              Browse More Flight Specials
            </h2>

            <ThumbnailCarouselSpecialCard
              slides={specials.map((special) => ({
                specialName: special.name,
                image: special.heroImage?.url,
                url: special.url,
                description: special.subTitle,
                expires: special.endDate,
              }))}
            />
          </div>

          {/* Book Now CTA button */}
          <PrimaryButton text="Book Now" />
        </div>
      </Container>
    </>
  );
}

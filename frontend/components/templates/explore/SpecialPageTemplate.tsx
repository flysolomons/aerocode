"use client";
import { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import RouteSpecialCard from "@/components/ui/cards/RouteSpecialCard";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
import Slider from "@/components/layout/Slider";
import { SpecialPage } from "@/graphql/SpecialPageQuery";
import { stripHtmlTags } from "@/lib/utils";
import ThumbnailCarousel from "@/components/layout/carousel/ThumbnailCarousel";
import StrippedBookingWidget from "@/components/layout/booking-widget/StrippedBookingWidget";

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
  initialPage: SpecialPage | null;
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
    termsAndConditions,
    specialRoutes = [],
  } = initialPage;

  // Format the validity period if both dates are available
  const validityPeriod =
    startDate && endDate
      ? `Valid from ${formatDate(startDate)} to ${formatDate(endDate)}`
      : "";

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
            <p className="text-sm sm:text-base lg:text-base text-center text-gray-700 leading-relaxed">
              We offer convenient flights between Australia, Fiji, Vanuatu, and
              Honiara, the vibrant capital of the Solomon Islands. Discover the
              beauty and diversity of the Solomons with our extensive network of
              destinations.
            </p>
            {/* {validityPeriod && (
              <p className="text-center font-medium text-blue-500 text-sm sm:text-base lg:text-base">
                {validityPeriod}
              </p>
            )} */}

            {/* Special Info Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-500">
                  Special Details
                </h2>
                <div className="flex gap-2">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Limited Time Offer
                  </span>
                  {/* <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    From $799
                  </span> */}
                </div>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Validity Period
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(startDate || "2025-07-01")} -{" "}
                    {formatDate(endDate || "2025-12-31")}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Fare type
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">Promo</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Booking class
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">Economy</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Flight Type
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">International</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* {initialPage.description && (
            <div className="mx-auto w-full">
              <p className="text-sm sm:text-base lg:text-base text-center text-gray-700 leading-relaxed">
                {initialPage.description}
              </p>
            </div>
          )} */}
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
            <ThumbnailCarousel
              slides={[
                {
                  specialName: "Island Explorer",
                  image:
                    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
                  price: "$899",
                  url: "/specials/island-explorer",
                  route: "Honiara to Brisbane",
                },
                {
                  specialName: "Pacific Paradise",
                  image:
                    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
                  price: "$749",
                  url: "/specials/pacific-paradise",
                  route: "Honiara to Nadi",
                },
                {
                  specialName: "Vanuatu Adventure",
                  image:
                    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop",
                  price: "$649",
                  url: "/specials/vanuatu-adventure",
                  route: "Honiara to Port Vila",
                },
                {
                  specialName: "Sydney Saver",
                  image:
                    "https://images.unsplash.com/photo-1465156799763-2c087c332922?w=400&h=300&fit=crop",
                  price: "$999",
                  url: "/specials/sydney-saver",
                  route: "Honiara to Sydney",
                },
                {
                  specialName: "Melbourne Magic",
                  image:
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
                  price: "$1050",
                  url: "/specials/melbourne-magic",
                  route: "Honiara to Melbourne",
                },
                {
                  specialName: "Guadalcanal Getaway",
                  image:
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
                  price: "$799",
                  url: "/specials/guadalcanal-getaway",
                  route: "Honiara to Guadalcanal",
                },
                {
                  specialName: "Fiji Flyer",
                  image:
                    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
                  price: "$720",
                  url: "/specials/fiji-flyer",
                  route: "Honiara to Suva",
                },
                {
                  specialName: "Solomon Escape",
                  image:
                    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop",
                  price: "$880",
                  url: "/specials/solomon-escape",
                  route: "Brisbane to Honiara",
                },
                {
                  specialName: "Coral Coast Special",
                  image:
                    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop",
                  price: "$970",
                  url: "/specials/coral-coast-special",
                  route: "Nadi to Honiara",
                },
              ]}
            />
          </div>

          {/* Book Now CTA button */}
          <div className="w-full flex justify-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              onClick={() => {
                const bookingWidget = document.getElementById(
                  "stripped-booking-widget"
                );
                if (bookingWidget) {
                  bookingWidget.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </Container>
      {/* Other specials section
      <div className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <Container>
          <div className="space-y-6 sm:space-y-8 px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-blue-500">
              Other Specials
            </h2>
            <p className="text-center text-sm sm:text-base lg:text-base text-gray-700 max-w-2xl mx-auto">
              Check out our other special offers available on various routes.
            </p>
            <div className="mt-6 sm:mt-8">
              <Slider />
            </div>
          </div>
        </Container>
      </div> */}
    </>
  );
}

"use client";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
import { SpecialPage } from "@/graphql/SpecialPageQuery";
import StrippedBookingWidget from "@/components/layout/booking-widget/StrippedBookingWidget";
import FlightSpecialInformation from "@/components/layout/sections/FlightSpecialInformation";
import ThumbnailCarouselSpecialCard from "@/components/layout/carousel/ThumbnailCarouselSpecialCard";
import TableOfContents, {
  TOCSection,
} from "@/components/layout/TableOfContents";
import { useTableOfContents } from "@/hooks/useTableOfContents";
import ReadyToFly from "@/components/layout/sections/ReadyToFly";
import { beautifyHtml } from "@/lib/beautifyHtml";

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

  // Check if the current special is expired using the isExpired field
  const isCurrentSpecialExpired = initialPage?.isExpired === "true";

  // Define table of contents sections based on content and expired state
  const sections: TOCSection[] = isCurrentSpecialExpired 
    ? [
        // For expired specials, only show "More Specials" if available
        {
          id: "more-specials",
          label: "More Specials", 
          hasContent: Boolean(specials && specials.length > 0),
        },
      ].filter((section) => section.hasContent)
    : [
        // For active specials, show all relevant sections
        {
          id: "booking-widget",
          label: "Book Now",
          hasContent: true,
        },
        {
          id: "overview",
          label: "Overview",
          hasContent: Boolean(description),
        },
        {
          id: "special-information",
          label: "Special Information",
          hasContent: true,
        },
        {
          id: "associated-routes",
          label: "Associated Routes",
          hasContent: Boolean(specialRoutes && specialRoutes.length > 0),
        },
        {
          id: "terms-conditions",
          label: "Terms & Conditions",
          hasContent: Boolean(termsAndConditions),
        },
        {
          id: "more-specials",
          label: "More Specials",
          hasContent: Boolean(specials && specials.length > 0),
        },
      ].filter((section) => section.hasContent);

  const { activeSection, scrollToSection } = useTableOfContents({
    sections,
    scrollOffset: 30,
  });

  return (
    <>
      <SecondaryHero
        title={heroTitle || name || "Special Offer"}
        image={heroImage?.url || "/hero.jpg"}
        breadcrumbs={url}
      />

      <TableOfContents
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />
    <div className="bg-[url(/traditional_ring_section.png)] bg-no-repeat bg-bottom">
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
          {isCurrentSpecialExpired ? (
            /* Show only expired message */
            <div className="w-full max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-700 mb-2">
                Special Offer Expired
              </h3>
              <p className="text-red-600 mb-4">
                Sorry! The flight special you're looking for has expired.
                Please browse some of our other specials below.
              </p>
              <p className="text-sm text-red-500">
                This special expired on {formatDate(endDate)}
              </p>
            </div>
          ) : (
            /* Show all content when not expired */
            <>
              <div className="space-y-8">
                <StrippedBookingWidget id="booking-widget" />
                {description && (
                  <div id="overview" className="mx-auto w-full">
                    <div className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                      {beautifyHtml(description)}
                    </div>
                  </div>
                )}
              </div>

              {/* Flight information */}
              <div
                id="special-information"
                className="w-full mx-auto space-y-8 sm:space-y-8"
              >
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
                <div id="associated-routes">
                  <RouteSpecialSection
                    heading={`Associated Routes`}
                    description="Take advantage of our special fares on these popular routes."
                    specials={specialRoutes.map((special) => ({
                      ...special,
                      currency: special.currency,
                    }))}
                  />
                </div>
              )}

              {/* Terms and conditions section */}
              {termsAndConditions && (
                <div id="terms-conditions" className="w-full px-0">
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
                    <div className="prose prose-sm sm:prose lg:prose-lg max-w-none w-full px-6 pb-6 pt-2 text-left text-gray-500">
                      <div>{beautifyHtml(termsAndConditions)}</div>
                    </div>
                  </details>
                </div>
              )}

              {/* Book Now CTA button */}
              <ReadyToFly
                buttonText="Book Now"
              />
            </>
          )}

          {/*This section will always display specials carousel */}
          {specials && specials.length > 0 && (
            <div
              id="more-specials"
              className="w-full mx-auto text-center space-y-8"
            >
              <h2 className="text-xl sm:text-xl lg:text-2xl font-semibold text-blue-500">
                Browse More Flight Specials
              </h2>

              <ThumbnailCarouselSpecialCard
                slides={specials.map((special) => ({
                  specialName: special.name,
                  image: special.heroImage?.url,
                  url: special.url,
                  description: special.subTitle,
                  endDate: special.endDate,
                }))}
              />
            </div>
          )}
        </div>
      </Container>

    </div>
      
    </>
  );
}

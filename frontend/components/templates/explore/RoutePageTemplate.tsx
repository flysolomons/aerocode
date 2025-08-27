"use client";
import { useState, useMemo } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import StrippedBookingWidget from "@/components/layout/booking-widget/StrippedBookingWidget";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
import RouteCard from "@/components/ui/cards/RouteCard";
import FareCard from "@/components/ui/cards/FareCard";
import FlightInfoCard from "@/components/ui/cards/FlightInfoCard";
import TableOfContents, {
  TOCSection,
} from "@/components/layout/TableOfContents";
import { useTableOfContents } from "@/hooks/useTableOfContents";
import { RoutePage, SpecialRoute } from "@/graphql/RoutePageQuery";
import Recommendations from "@/components/layout/sections/Recommendations";
import ReadyToFly from "@/components/layout/sections/ReadyToFly";
import { beautifyHtml } from "@/lib/beautifyHtml";

interface RoutePageTemplateProps {
  initialPage: RoutePage | null;
  loading?: boolean;
}

export default function RoutePageTemplate({
  initialPage,
  loading = false,
}: RoutePageTemplateProps) {
  // Get ranked related routes from the initial page data
  const relatedRoutes = initialPage?.rankedRelatedRoutes || [];

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-sm sm:text-base text-gray-600">Loading...</div>
      </div>
    );
  }

  // Handle null page data
  if (!initialPage) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-sm sm:text-base text-gray-600">
          Route not found
        </div>
      </div>
    );
  }

  // Destructure page data
  const {
    heroTitle,
    heroImage,
    originPort,
    destinationPort,
    name,
    url,
    fares = [],
    specialRoutes = [],
  } = initialPage;

  // Define TOC sections for route pages
  const tocSections = useMemo(() => {
    const sections: TOCSection[] = [
      {
        id: "overview",
        label: "Overview",
        hasContent: !!initialPage.description,
      },
      {
        id: "specials",
        label: "Flight Specials",
        hasContent: (initialPage?.specialRoutes?.length || 0) > 0,
      },
      {
        id: "fares",
        label: "Year Round Fares",
        hasContent: (initialPage?.fares?.length || 0) > 0,
      },
      {
        id: "flight-info",
        label: "Flight Information",
        hasContent: true, // Always show flight info
      },
      {
        id: "other-routes",
        label: "Other Routes",
        hasContent: (initialPage?.rankedRelatedRoutes?.length || 0) > 0,
      },
      {
        id: "destinations",
        label: "More Destinations",
        hasContent: true, // Always show recommendations
      },
    ];

    return sections.filter((section) => section.hasContent);
  }, [
    initialPage?.description,
    initialPage?.specialRoutes?.length,
    initialPage?.fares?.length,
    initialPage?.rankedRelatedRoutes?.length,
  ]);

  // Use the table of contents hook
  const { activeSection, scrollToSection } = useTableOfContents({
    sections: tocSections,
  });

  // Memoize preselected objects to prevent re-renders
  const preselectedDeparture = useMemo(
    () => ({
      departureAirport: originPort.city,
      departureAirportCode: originPort.code,
    }),
    [originPort.city, originPort.code]
  );

  const preselectedArrival = useMemo(
    () => ({
      arrivalAirport: destinationPort.city,
      arrivalAirportCode: destinationPort.code,
    }),
    [destinationPort.city, destinationPort.code]
  );

  return (
    <>
      <SecondaryHero
        title={heroTitle}
        image={destinationPort.destinationImage?.url || heroImage?.url || "/hero3.jpg"}
        breadcrumbs={url}
      />

      <TableOfContents
        sections={tocSections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />
      <div className="bg-[url(/traditional_ring_section.png)] bg-no-repeat bg-bottom bg-opacity-5">
        <Container>
          <div className="py-12 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20 px-4 sm:px-6">
            <div className="space-y-8">
              <StrippedBookingWidget
                id="booking-widget"
                preselectedDeparture={preselectedDeparture}
                preselectedArrival={preselectedArrival}
              />
              {initialPage.description && (
                <div id="overview" className="mx-auto w-full scroll-mt-10">
                  <div className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                    {beautifyHtml(initialPage.description)}
                  </div>
                </div>
              )}
            </div>
            <div id="specials" className="scroll-mt-10">
              <RouteSpecialSection
                heading={`${originPort.city} to ${destinationPort.city} Specials`}
                description="Check out our latest special fares for this route. Book early to secure the best prices."
                specials={specialRoutes.map((special) => ({
                  ...special,
                  currency: special.currency,
                }))}
              />
            </div>
            {fares && fares.length > 0 && (
              <div id="fares" className="space-y-6 sm:space-y-8 scroll-mt-10">
                <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                    Year Round Fares
                  </h2>
                  <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                    We offer convenient flights between destinations with
                    competitive fares. Prices may vary by season and
                    availability.
                  </p>
                </div>
                {/* Responsive grid columns based on fares count */}
                <div
                  className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                    fares.length === 1
                      ? "grid-cols-1"
                      : fares.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : fares.length === 3
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  }`}
                >
                  {fares.length === 1 && (
                    <div className="bg-white w-full bg-[url(/traditional_ring_section.png)] bg-no-repeat bg-cover rounded-2xl lg:p-4 lg:rounded-s-2xl  shadow-lg h-full break-words  space-y-6 m-auto">
                      <div className=" w-1/4 p-2 rounded-3xl h-auto text-center text-white bg-[#99471d] m-auto">
                        <h2 className="text-lg font-bold">
                          {fares[0].fareFamily}
                        </h2>
                      </div>

                      <div className="text-center w-full">
                        <span className="text-2xl mr-4">
                          {fares[0].currency}
                        </span>
                        <span className="text-4xl font-bold">
                          {fares[0].price}
                        </span>
                        <p className="pt-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="#000000"
                            className="inline mr-2 -mt-2"
                            viewBox="0 0 256 256"
                          >
                            <path d="M221.66,181.66l-48,48a8,8,0,0,1-11.32-11.32L196.69,184H72a8,8,0,0,1-8-8V32a8,8,0,0,1,16,0V168H196.69l-34.35-34.34a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,221.66,181.66Z"></path>
                          </svg>
                          {fares[0].tripType}
                        </p>
                      </div>
                    </div>
                  )}
                  {fares.length > 1 &&
                    fares.map((fare, index) => (
                      <FareCard
                        key={index}
                        family={fare.fareFamily}
                        price={fare.price}
                        currency={fare.currency}
                        direction={fare.tripType}
                      />
                    ))}
                </div>
              </div>
            )}
            <div
              id="flight-info"
              className="space-y-6 sm:space-y-8 scroll-mt-10"
            >
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                  Flight Information
                </h2>
                <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                  Important details about your flight between {originPort.city}{" "}
                  and {destinationPort.city}.
                </p>
              </div>

              <FlightInfoCard
                departureAirport={originPort.city}
                departureAirportCode={originPort.code}
                departureAirportName={originPort.name}
                arrivalAirport={destinationPort.city}
                arrivalAirportCode={destinationPort.code}
                arrivalAirportName={destinationPort.name}
              />
            </div>
            {relatedRoutes.length > 0 && (
              <div
                id="other-routes"
                className="space-y-6 sm:space-y-8 scroll-mt-10"
              >
                <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                    Other Routes to {initialPage?.destinationPort?.city}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                    Explore other popular flight routes that might interest you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {relatedRoutes.map((rankedRoute, index) => (
                    <RouteCard
                      key={index}
                      origin={rankedRoute.relatedRoute.originPort.city}
                      destination={rankedRoute.relatedRoute.destinationPort.city}
                      url={rankedRoute.relatedRoute.url || ""}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Recommendation Section */}
            <div id="destinations" className="scroll-mt-10">
              <Recommendations
                excludeCountry={initialPage.parent?.country}
                heading="Explore other destinations"
              />
            </div>

            {/* Ready to Fly Section */}
            <ReadyToFly buttonText="Book Now" />
          </div>
        </Container>
      </div>
    </>
  );
}

"use client";
import { useMemo } from "react";
import Container from "@/components/layout/Container";
import PrimaryHero from "@/components/layout/hero/PrimaryHero";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
import ReasonToVisitCard from "@/components/layout/sections/ReasonToVisit";
import InfoCard from "@/components/ui/cards/InfoCard";
import RouteCard from "@/components/ui/cards/RouteCard";
import Recommendations from "@/components/layout/sections/Recommendations";
import ReadyToFly from "@/components/layout/sections/ReadyToFly";
import TableOfContents, {
  TOCSection,
} from "@/components/layout/TableOfContents";
import { useTableOfContents } from "@/hooks/useTableOfContents";
import {
  DestinationPage,
  DestinationSpecialRoute,
} from "@/graphql/DestinationPageQuery";
import parse from "html-react-parser";

interface DestinationTemplateProps {
  initialPage: DestinationPage;
}

export default function DestinationTemplate({
  initialPage,
}: DestinationTemplateProps) {
  // Determine which sections have content and should be shown in navigation
  const navigationSections = useMemo(() => {
    const sections: TOCSection[] = [
      {
        id: "overview",
        label: "Overview",
        hasContent: !!initialPage.description,
      },
      {
        id: "specials",
        label: "Flight Specials",
        hasContent:
          initialPage.rankedRoutes?.some(
            (rankedRoute) =>
              rankedRoute.route.specialRoutes &&
              rankedRoute.route.specialRoutes.length > 0
          ) || false,
      },
      {
        id: "reasons",
        label: "Why Visit",
        hasContent:
          initialPage.reasonsToVisit && initialPage.reasonsToVisit.length > 0,
      },
      {
        id: "requirements",
        label: "Travel Info",
        hasContent:
          initialPage.travelRequirements &&
          initialPage.travelRequirements.length > 0,
      },
      {
        id: "routes",
        label: "Our Routes",
        hasContent: true, // Always show routes section
      },
      {
        id: "more",
        label: "More Destinations",
        hasContent: true, // Always show recommendations
      },
    ];

    return sections.filter((section) => section.hasContent);
  }, [initialPage]);

  // Use the table of contents hook
  const { activeSection, scrollToSection } = useTableOfContents({
    sections: navigationSections,
  });

  console.log("Initial Page Data:", initialPage);

  return (
    <>
      <PrimaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        widget="stripped"
        breadcrumbs={initialPage.url}
      />

      <TableOfContents
        sections={navigationSections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />
      <div className="bg-[url(/traditional_ring_section.png)] bg-no-repeat bg-bottom bg-opacity-5">
      <Container>
        <div className="py-12 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20 px-4 sm:px-6">
          {/* Description section */}
          {initialPage.description && (
            <div id="overview" className="mx-auto w-full scroll-mt-10">
              <div className="text-sm sm:text-base lg:text-base text-left text-gray-600 leading-relaxed">
                {parse(initialPage.description)}
              </div>
            </div>
          )}

          {/* Route special section */}
          {initialPage.rankedRoutes?.some(
            (rankedRoute) =>
              rankedRoute.route.specialRoutes &&
              rankedRoute.route.specialRoutes.length > 0
          ) && (
            <div id="specials" className="scroll-mt-10">
              <RouteSpecialSection
                heading={`${initialPage.country} Specials`}
                description="Check out our special fares and promotions for flights to this destination."
                specials={initialPage.rankedRoutes
                  .flatMap((rankedRoute) =>
                    (rankedRoute.route.specialRoutes || []).map((special) => ({
                      ...special,
                      currency: special.currency,
                    }))
                  )
                  .filter((special) => !!special)
                  .slice(0, 3)}
              />
            </div>
          )}
      
          {/* Reasons to Visit */}
          {initialPage.reasonsToVisit &&
            initialPage.reasonsToVisit.length > 0 && (
              <div id="reasons" className="space-y-6 sm:space-y-8 scroll-mt-10">
                <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                    Why Visit {initialPage.country}
                  </h2>
                  <p className="text-sm sm:text-base lg:text-base text-gray-600 leading-relaxed">
                    Discover what makes {initialPage.country} a must-visit
                    destination.
                  </p>
                </div>
                <div className="space-y-8 sm:space-y-12 lg:space-y-16">
                  {initialPage.reasonsToVisit.map((reason, index) => (
                    <ReasonToVisitCard
                      key={index}
                      title={reason.heading}
                      image={reason.image?.url || "/image.jpg"}
                      description={reason.text}
                      imageOnLeft={index % 2 !== 0}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Travel Requirements */}
          {initialPage.travelRequirements &&
            initialPage.travelRequirements.length > 0 && (
              <div
                id="requirements"
                className="space-y-6 sm:space-y-8 scroll-mt-10"
              >
                <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                    {initialPage.country} Travel Requirements
                  </h2>

                  <p className="text-sm sm:text-base lg:text-base text-gray-600 leading-relaxed">
                    Important information for travelers planning a trip to
                    {initialPage.country}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {initialPage.travelRequirements.map((requirement, index) => (
                    <InfoCard
                      key={index}
                      title={requirement.title}
                      svg={requirement.svgIcon?.url || ""}
                      url={requirement.link || ""}
                      description={requirement.description}
                    />
                  ))}
                </div>
              </div>
            )}
          {/* Routes Section - Using ranked routes from GraphQL */}
          <div id="routes" className="space-y-6 sm:space-y-8 scroll-mt-10">
            <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                Our {initialPage.country} Routes
              </h2>

              <p className="text-sm sm:text-base lg:text-base text-gray-600 leading-relaxed">
                We offer convenient flights to {initialPage.country} from
                various locations.
              </p>
            </div>

            {initialPage.rankedRoutes && initialPage.rankedRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {initialPage.rankedRoutes.map((rankedRoute, index) => (
                  <RouteCard
                    key={index}
                    origin={rankedRoute.route.departureAirport}
                    destination={rankedRoute.route.arrivalAirport}
                    url={rankedRoute.route.url}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-sm sm:text-base text-gray-600">
                  No routes to {initialPage.country} are currently available.
                </div>
              </div>
            )}
          </div>
          {/* Recommendation Section */}
          <div id="more" className="scroll-mt-10">
            <Recommendations
              excludeCountry={initialPage.country}
              heading="Explore More Destinations"
            />
          </div>
         
          {/* Ready to fly section */}
        <ReadyToFly
          buttonText="Book Now"
          description="Dont miss out on the specials, fares dropped so much that you pants cannot catch up"
        />
        </div>
      </Container>
      </div>
      
    </>
  );
}

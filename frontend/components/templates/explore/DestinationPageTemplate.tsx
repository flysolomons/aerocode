"use client";
import { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import PrimaryHero from "@/components/layout/hero/PrimaryHero";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
import ReasonToVisitCard from "@/components/layout/sections/ReasonToVisit";
import InfoCard from "@/components/ui/cards/InfoCard";
import RouteCard from "@/components/ui/cards/RouteCard";
import Recommendations from "@/components/layout/sections/Recommendations";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import {
  DestinationPage,
  DestinationSpecialRoute,
} from "@/graphql/DestinationPageQuery";
import {
  RouteSearchResult,
  fetchRoutesByCountry,
} from "@/graphql/RoutePageQuery";
import parse from "html-react-parser";

interface DestinationTemplateProps {
  initialPage: DestinationPage;
}

export default function DestinationTemplate({
  initialPage,
}: DestinationTemplateProps) {
  const [routes, setRoutes] = useState<RouteSearchResult[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  // Fetch routes by country when the component mounts
  useEffect(() => {
    if (initialPage?.country) {
      setLoadingRoutes(true);
      fetchRoutesByCountry(initialPage.country)
        .then((routesData) => {
          setRoutes(routesData);
        })
        .catch((error) => {
          console.error("Error fetching routes by country:", error);
        })
        .finally(() => {
          setLoadingRoutes(false);
        });
    }
  }, [initialPage?.country]);

  console.log("Initial Page Data:", initialPage);

  return (
    <>
      <PrimaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        widget="stripped"
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20 px-4 sm:px-6">
          {initialPage.description && (
            <div className="mx-auto w-full">
              <div className="text-sm sm:text-base lg:text-base text-center text-gray-700 leading-relaxed">
                {parse(initialPage.description)}
              </div>
            </div>
          )}
          {initialPage.routes?.some(
            (route) => route.specialRoutes && route.specialRoutes.length > 0
          ) && (
            <RouteSpecialSection
              heading={`${initialPage.country} Specials`}
              description="Check out our special fares and promotions for flights to this destination."
              specials={initialPage.routes
                .flatMap((route) =>
                  (route.specialRoutes || []).map((special) => ({
                    ...special,
                    currency: special.currency,
                  }))
                )
                .filter((special) => !!special)
                .slice(0, 3)}
            />
          )}
          {/* Reasons to Visit */}
          {initialPage.reasonsToVisit && initialPage.reasonsToVisit.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                  Why Visit {initialPage.country}
                </h2>
                <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                  Discover what makes {initialPage.country} a must-visit destination.
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
              <div className="space-y-6 sm:space-y-8">
                <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                    {initialPage.country} Travel Requirements
                  </h2>

                  <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
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
          {/* Routes Section - Using dynamically fetched routes by country */}
          <div className="space-y-6 sm:space-y-8">
            <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                Our {initialPage.country} Routes
              </h2>

              <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                We offer convenient flights to {initialPage.country} from
                various locations.
              </p>
            </div>

            {loadingRoutes ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-sm sm:text-base text-gray-600">
                  Loading routes...
                </div>
              </div>
            ) : routes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {routes.map((route, index) => (
                  <RouteCard
                    key={index}
                    origin={route.departureAirport}
                    destination={route.arrivalAirport}
                    url={route.url}
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
          <Recommendations
            excludeCountry={initialPage.country}
            heading="Explore more destinations"
          />
          
          {/* Book Now Button */}
          <div className="flex justify-center pt-8">
            <PrimaryButton
              text="Book Now"
              onClick={() => {
                const widget = document.querySelector('.stripped-booking-widget');
                if (widget) {
                  widget.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Fallback to scroll to top where the hero with booking widget is
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </div>
        </div>
      </Container>
    </>
  );
}

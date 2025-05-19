"use client";
import { useState, useEffect } from "react";
import Container from "@/components/common/Container";
import PrimaryHero from "@/components/layout/PrimaryHero";
import RouteSpecialSection from "@/components/layout/RouteSpecialSection";
import ReasonToVisitCard from "@/components/common/ReasonToVisit";
import InfoCard from "@/components/common/InfoCard";
import RouteCard from "@/components/common/RouteCard";
import {
  DestinationPage,
  DestinationSpecialRoute,
} from "@/graphql/DestinationPageQuery";
import {
  RouteSearchResult,
  fetchRoutesByCountry,
} from "@/graphql/RoutePageQuery";

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

  return (
    <>
      <PrimaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        widget="stripped"
      />{" "}
      <Container>
        <div className="py-12 space-y-16">
          {" "}
          {initialPage.routes?.some(
            (route) => route.specialRoutes && route.specialRoutes.length > 0
          ) && (
            <RouteSpecialSection
              heading={`${initialPage.country} Specials`}
              description="Check out our special fares and promotions for flights to this destination."
              specials={initialPage.routes
                .flatMap((route) => route.specialRoutes || [])
                .filter((special) => !!special)
                .slice(0, 3)}
            />
          )}
          {/* Reasons to Visit */}
          {initialPage.reasonsToVisit &&
            initialPage.reasonsToVisit.map((reason, index) => (
              <ReasonToVisitCard
                key={index}
                title={reason.heading}
                image={reason.image?.url || "/image.jpg"}
                description={reason.text}
                imageOnLeft={index % 2 !== 0}
              />
            ))}
          {/* Travel Requirements */}
          {initialPage.travelRequirements &&
            initialPage.travelRequirements.length > 0 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl text-center font-bold text-blue-500">
                    {initialPage.country} Travel Requirements
                  </h2>

                  <span className="block text-center">
                    Important information for travelers planning a trip to{" "}
                    {initialPage.country}.
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {initialPage.travelRequirements.map((requirement, index) => (
                    <InfoCard
                      key={index}
                      title={requirement.title}
                      description={requirement.description}
                    />
                  ))}
                </div>
              </div>
            )}{" "}
          {/* Routes Section - Using dynamically fetched routes by country */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                Our {initialPage.country} Routes
              </h2>

              <span className="block text-center">
                We offer convenient flights to {initialPage.country} from
                various locations.
              </span>
            </div>

            {loadingRoutes ? (
              <div className="text-center py-8">Loading routes...</div>
            ) : routes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
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
              <div className="text-center py-8">
                No routes to {initialPage.country} are currently available.
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

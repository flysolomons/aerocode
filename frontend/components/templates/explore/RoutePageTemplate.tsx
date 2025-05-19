"use client";
import { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import StrippedBookingWidget from "@/components/common/StrippedBookingWidget";
import RouteSpecialSection from "@/components/layout/RouteSpecialSection";
import RouteCard from "@/components/common/RouteCard";
import FareCard from "@/components/common/FareCard";
import FlightInfoCard from "@/components/common/FlightInfoCard";
import {
  RoutePage,
  RouteSearchResult,
  fetchRoutesByDestination,
  SpecialRoute,
} from "@/graphql/RoutePageQuery";

interface RoutePageTemplateProps {
  initialPage: RoutePage | null;
  loading?: boolean;
}

export default function RoutePageTemplate({
  initialPage,
  loading = false,
}: RoutePageTemplateProps) {
  const [gradientStartColor, setGradientStartColor] = useState("transparent");
  const [relatedRoutes, setRelatedRoutes] = useState<RouteSearchResult[]>([]);
  const [loadingRelatedRoutes, setLoadingRelatedRoutes] = useState(false);

  // Fetch related routes when the component mounts
  useEffect(() => {
    if (initialPage?.arrivalAirportCode) {
      setLoadingRelatedRoutes(true);
      fetchRoutesByDestination(initialPage.arrivalAirportCode)
        .then((routes) => {
          // Filter out the current route if it exists in the results
          const filteredRoutes = routes.filter(
            (route) =>
              !(
                route.departureAirportCode ===
                  initialPage.departureAirportCode &&
                route.arrivalAirportCode === initialPage.arrivalAirportCode
              )
          );
          setRelatedRoutes(filteredRoutes);
        })
        .catch((error) => {
          console.error("Error fetching related routes:", error);
        })
        .finally(() => {
          setLoadingRelatedRoutes(false);
        });
    }
  }, [initialPage]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Handle null page data
  if (!initialPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Route not found
      </div>
    );
  }
  const {
    heroTitle,
    heroImage,
    departureAirport,
    arrivalAirport,
    departureAirportCode,
    arrivalAirportCode,
    name,
    url,
    fares = [],
    specialRoutes = [],
  } = initialPage;

  return (
    <>
      <SecondaryHero
        title={heroTitle}
        image={heroImage?.url || "/hero3.jpg"}
        breadcrumbs={url}
        onColorCalculated={setGradientStartColor}
      />
      <Container>
        <div className="py-12 space-y-16">
          <StrippedBookingWidget />{" "}
          <RouteSpecialSection
            heading={`${departureAirport} to ${arrivalAirport} Specials`}
            description="Check out our latest special fares for this route. Book early to secure the best prices."
            specials={specialRoutes}
          />
          {fares && fares.length > 0 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl text-center font-bold text-blue-500">
                  Year Round Fares
                </h2>
                <span className="block text-center">
                  We offer convenient flights between destinations with
                  competitive fares. Prices may vary by season and availability.
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {fares.map((fare, index) => (
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
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                Flight Information
              </h2>
              <span className="block text-center">
                Important details about your flight between {departureAirport}{" "}
                and {arrivalAirport}.
              </span>
            </div>

            <FlightInfoCard
              departureAirport={departureAirport}
              departureAirportCode={departureAirportCode}
              arrivalAirport={arrivalAirport}
              arrivalAirportCode={arrivalAirportCode}
            />
          </div>{" "}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                Other Routes to {initialPage.arrivalAirport}
              </h2>
              <span className="block text-center">
                Explore other popular flight routes that might interest you.
              </span>
            </div>

            {loadingRelatedRoutes ? (
              <div className="text-center py-8">Loading related routes...</div>
            ) : relatedRoutes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {relatedRoutes.map((route, index) => (
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
                No other routes to {initialPage.arrivalAirport} are currently
                available.
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

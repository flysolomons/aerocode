"use client";
import { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import StrippedBookingWidget from "@/components/layout/booking-widget/StrippedBookingWidget";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
import RouteCard from "@/components/ui/cards/RouteCard";
import FareCard from "@/components/ui/cards/FareCard";
import FlightInfoCard from "@/components/ui/cards/FlightInfoCard";
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
      />{" "}
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6 lg:px-8">
          <StrippedBookingWidget />{" "}
          <RouteSpecialSection
            heading={`${departureAirport} to ${arrivalAirport} Specials`}
            description="Check out our latest special fares for this route. Book early to secure the best prices."
            specials={specialRoutes}
          />{" "}
          {fares && fares.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500">
                  Year Round Fares
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  We offer convenient flights between destinations with
                  competitive fares. Prices may vary by season and availability.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
          )}{" "}
          <div className="space-y-6 sm:space-y-8">
            <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500">
                Flight Information
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Important details about your flight between {departureAirport}{" "}
                and {arrivalAirport}.
              </p>
            </div>

            <FlightInfoCard
              departureAirport={departureAirport}
              departureAirportCode={departureAirportCode}
              arrivalAirport={arrivalAirport}
              arrivalAirportCode={arrivalAirportCode}
            />
          </div>{" "}
          <div className="space-y-6 sm:space-y-8">
            <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500">
                Other Routes to {initialPage.arrivalAirport}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Explore other popular flight routes that might interest you.
              </p>
            </div>

            {loadingRelatedRoutes ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-sm sm:text-base text-gray-600">
                  Loading related routes...
                </div>
              </div>
            ) : relatedRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
              <div className="text-center py-8 sm:py-12">
                <div className="text-sm sm:text-base text-gray-600">
                  No other routes to {initialPage.arrivalAirport} are currently
                  available.
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

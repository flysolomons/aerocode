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
import Recommendations from "@/components/layout/sections/Recommendations";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import parse from "html-react-parser";

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
      />
      <Container>
        <div className="py-12 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20 px-4 sm:px-6">
          <div className="space-y-8">
            <StrippedBookingWidget
              id="booking-widget"
              preselectedDeparture={{
                departureAirport: departureAirport,
                departureAirportCode: departureAirportCode,
              }}
              preselectedArrival={{
                arrivalAirport: arrivalAirport,
                arrivalAirportCode: arrivalAirportCode,
              }}
            />
            {initialPage.description && (
              <div className="mx-auto w-full">
                <div className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                  {parse(initialPage.description)}
                </div>
              </div>
            )}
          </div>
          <RouteSpecialSection
            heading={`${departureAirport} to ${arrivalAirport} Specials`}
            description="Check out our latest special fares for this route. Book early to secure the best prices."
            specials={specialRoutes.map((special) => ({
              ...special,
              currency: special.currency,
            }))}
          />
          {fares && fares.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                  Year Round Fares
                </h2>
                <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                  We offer convenient flights between destinations with
                  competitive fares. Prices may vary by season and availability.
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
          <div className="space-y-6 sm:space-y-8">
            <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                Flight Information
              </h2>
              <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                Important details about your flight between {departureAirport}
                and {arrivalAirport}.
              </p>
            </div>

            <FlightInfoCard
              departureAirport={departureAirport}
              departureAirportCode={departureAirportCode}
              arrivalAirport={arrivalAirport}
              arrivalAirportCode={arrivalAirportCode}
            />
          </div>
          {(loadingRelatedRoutes || relatedRoutes.length > 0) && (
            <div className="space-y-6 sm:space-y-8">
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
                  Other Routes to {initialPage.arrivalAirport}
                </h2>
                <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                  Explore other popular flight routes that might interest you.
                </p>
              </div>

              {loadingRelatedRoutes ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-sm sm:text-base text-gray-600">
                    Loading related routes...
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          )}
          {/* Recommendation Section */}
          <Recommendations
            excludeCountry={initialPage.parent?.country}
            heading="Explore other destinations"
          />

          {/* Ready to Fly Section */}
          <div className="text-center space-y-6">
            <h2 className="text-xl sm:text-xl lg:text-2xl font-semibold text-blue-500">
              Ready to Fly?
            </h2>
            <div className="flex justify-center">
              <PrimaryButton
                text="Book Now"
                onClick={() => {
                  const widget = document.querySelector(
                    ".stripped-booking-widget"
                  );
                  if (widget) {
                    widget.scrollIntoView({ behavior: "smooth" });
                  } else {
                    // Fallback to scroll to top where the hero with booking widget is
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

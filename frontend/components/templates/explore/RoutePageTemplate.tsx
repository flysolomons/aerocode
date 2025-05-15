"use client";
import { useState } from "react";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import StrippedBookingWidget from "@/components/common/StrippedBookingWidget";
import RouteSpecialSection from "@/components/layout/RouteSpecialSection";
import RouteCard from "@/components/common/RouteCard";
import FareCard from "@/components/common/FareCard";
import FlightInfoCard from "@/components/common/FlightInfoCard";
import { RoutePage } from "@/graphql/RoutePageQuery";

interface RoutePageTemplateProps {
  initialPage: RoutePage | null;
  loading?: boolean;
}

export default function RoutePageTemplate({
  initialPage,
  loading = false,
}: RoutePageTemplateProps) {
  const [gradientStartColor, setGradientStartColor] = useState("transparent");

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
          <StrippedBookingWidget />
          <RouteSpecialSection
            heading={`${departureAirport} to ${arrivalAirport} Specials`}
            description="Check out our latest special fares for this route. Book early to secure the best prices."
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
          </div>

          {/* <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                Other Popular Routes
              </h2>
              <span className="block text-center">
                Explore other popular flight routes that might interest you.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              <RouteCard origin="Honiara" destination="Brisbane" />
              <RouteCard origin="Honiara" destination="Sydney" />
              <RouteCard origin="Honiara" destination="Auckland" />
              <RouteCard origin="Honiara" destination="Nadi" />
              <RouteCard origin="Honiara" destination="Port Vila" />
              <RouteCard origin="Brisbane" destination="Honiara" />
            </div>
          </div> */}
        </div>
      </Container>
    </>
  );
}

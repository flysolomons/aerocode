"use client";
import { useState } from "react";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import StrippedBookingWidget from "@/components/common/StrippedBookingWidget";
import RouteSpecial from "@/components/common/RouteSpecialCard";
import RouteCard from "@/components/common/RouteCard";
import FareCard from "@/components/common/FareCard";
import FlightInfoCard from "@/components/common/FlightInfoCard";

export default function Route() {
  const [gradientStartColor, setGradientStartColor] = useState("transparent");

  return (
    <main>
      <div
        className="min-h-screen transition-colors duration-500"
        style={{
          background:
            gradientStartColor !== "transparent"
              ? `linear-gradient(to bottom, ${gradientStartColor} -15%, var(--background) 30%)`
              : undefined,
        }}
      >
        <SecondaryHero
          title="Flights from Honiara to Auckland"
          image="/hero3.jpg"
          breadcrumbs="Home > Explore > Destinations > New Zealand > Honiara to Auckland"
          onColorCalculated={setGradientStartColor}
        />
        <Container>
          <div className="py-12 space-y-16">
            <StrippedBookingWidget />

            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl text-center font-bold text-blue-500">
                  Honiara to Auckland Specials
                </h2>
                <span className="block text-center">
                  We offer convenient flights between Australia, Fiji, Vanuatu,
                  and Honiara, the vibrant capital of the Solomon Islands.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 h-64">
                <RouteSpecial
                  route="Honiara to Auckland"
                  price="$650AUD"
                  image="/image.jpg"
                  specialName="Early Bird Sale"
                />
                <RouteSpecial
                  route="Honiara to Auckland"
                  price="$650AUD"
                  image="/image.jpg"
                  specialName="Early Bird Sale"
                />
                <RouteSpecial
                  route="Honiara to Auckland"
                  price="$650AUD"
                  image="/image.jpg"
                  specialName="Early Bird Sale"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl text-center font-bold text-blue-500">
                  Year Round Fares
                </h2>
                <span className="block text-center">
                  We offer convenient flights between Australia, Fiji, Vanuatu,
                  and Honiara, the vibrant capital of the Solomon Islands.
                </span>
              </div>
              <div className="grid grid-cols-4 gap-8">
                <FareCard
                  family="Saver"
                  price="$1,825"
                  currency="SBD"
                  direction="One Way"
                />
                <FareCard
                  family="Smart"
                  price="$1,825"
                  currency="SBD"
                  direction="One Way"
                />
                <FareCard
                  family="Flexi"
                  price="$1,825"
                  currency="SBD"
                  direction="One Way"
                />
                <FareCard
                  family="Business"
                  price="$1,825"
                  currency="SBD"
                  direction="One Way"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl text-center font-bold text-blue-500">
                  Flight Information
                </h2>
                <span className="block text-center">
                  We offer convenient flights between Australia, Fiji, Vanuatu,
                  and Honiara, the vibrant capital of the Solomon Islands.
                </span>
              </div>

              <FlightInfoCard
                departureAirport="Honiara, Solomon Islands"
                departureAirportCode="HIR"
                arrivalAirport="Auckland, New Zealand"
                arrivalAirportCode="AKL"
              />
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl text-center font-bold text-blue-500">
                  Other Flights to Auckland
                </h2>

                <span className="block text-center">
                  We offer convenient flights between Australia, Fiji, Vanuatu,
                  and Honiara, the vibrant capital of the Solomon Islands.
                </span>
              </div>

              <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                <RouteCard origin="Honiara" destination="Auckland" />
                <RouteCard origin="Honiara" destination="Auckland" />
                <RouteCard origin="Honiara" destination="Auckland" />
                <RouteCard origin="Honiara" destination="Auckland" />
                <RouteCard origin="Honiara" destination="Auckland" />
                <RouteCard origin="Honiara" destination="Auckland" />
                <RouteCard origin="Honiara" destination="Auckland" />
                <RouteCard origin="Honiara" destination="Auckland" />
                <RouteCard origin="Honiara" destination="Auckland" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}

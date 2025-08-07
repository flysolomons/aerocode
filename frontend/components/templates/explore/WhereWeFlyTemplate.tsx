"use client";
import { useState } from "react";
import Image from "next/image";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import RadioButton from "@/components/ui/buttons/RadioButton";
import RouteCard from "@/components/ui/cards/RouteCard";
import { WhereWeFlyPage } from "@/graphql/WhereWeFlyPageQuery";
import parse from "html-react-parser";

interface WhereWeFlyProps {
  initialPage: WhereWeFlyPage;
}

export default function WhereWeFlyTemplate({ initialPage }: WhereWeFlyProps) {
  const [showInternational, setShowInternational] = useState(true);
  
  // Get the appropriate routes based on the current selection
  const currentRoutes = showInternational 
    ? initialPage.rankedInternationalRoutes || []
    : initialPage.rankedDomesticRoutes || [];

  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
          {initialPage.description && (
            <div className="mx-auto w-full">
              <div className="text-sm sm:text-base lg:text-base text-left text-gray-600 leading-relaxed">
                {parse(initialPage.description)}
              </div>
            </div>
          )}

          {/* Toggle between International and Domestic routes */}
          <div className="flex justify-center">
            <RadioButton
              optionOne="International"
              optionTwo="Domestic"
              initialSelected="one"
              onOptionChange={(option) =>
                setShowInternational(option === "one")
              }
            />
          </div>
          {/* Map image showing routes */}
          <div className="w-full relative">
            <Image
              src={
                showInternational
                  ? initialPage.internationalRoutes.url
                  : initialPage.domesticRoutes.url
              }
              alt={`Where We Fly: ${
                showInternational ? "International" : "Domestic"
              }`}
              width={1128}
              height={770}
              className="w-full h-auto rounded-2xl sm:rounded-3xl shadow-lg"
            />
          </div>
          {/* Routes Display */}
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500 text-center">
              {showInternational ? "International" : "Domestic"} Routes
            </h2>

            {currentRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {currentRoutes.map((rankedRoute, index) => (
                  <RouteCard
                    key={index}
                    origin={rankedRoute.route.originPort.city}
                    destination={rankedRoute.route.destinationPort.city}
                    url={rankedRoute.route.url || ""}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-gray-600">
                  No routes found for
                  {showInternational ? " international" : " domestic"} flights.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

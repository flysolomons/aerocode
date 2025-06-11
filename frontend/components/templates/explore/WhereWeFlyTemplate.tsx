"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import Recommendations from "@/components/layout/Recommendations";
import RadioButton from "@/components/common/RadioButton";
import RouteCard from "@/components/common/RouteCard";
import { WhereWeFlyPage } from "@/graphql/WhereWeFlyPageQuery";
import {
  fetchRoutesByFlightScope,
  RouteSearchResult,
} from "@/graphql/RoutePageQuery";

interface WhereWeFlyProps {
  initialPage: WhereWeFlyPage;
}

export default function WhereWeFlyTemplate({ initialPage }: WhereWeFlyProps) {
  const [showInternational, setShowInternational] = useState(true);
  const [routes, setRoutes] = useState<RouteSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  // Fetch routes when flight scope changes
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const flightScope = showInternational
          ? "international route"
          : "domestic route";
        const routeData = await fetchRoutesByFlightScope(flightScope);
        console.log("Fetched routes:", routeData);
        setRoutes(routeData);
      } catch (error) {
        console.error("Error fetching routes:", error);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [showInternational]);

  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-12 space-y-16">
          {/* Description */}
          <span className="block text-center">
            {initialPage.description}
          </span>{" "}
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
          </div>{" "}
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
              className="rounded-3xl"
            />
          </div>
          {/* Routes Display */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-500 text-center">
              {showInternational ? "International" : "Domestic"} Routes
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <p>Loading routes...</p>
              </div>
            ) : routes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <p>
                  No routes found for{" "}
                  {showInternational ? "international" : "domestic"} flights.
                </p>
              </div>
            )}
          </div>
          {/* Additional content could go here */}
        </div>
      </Container>
    </>
  );
}

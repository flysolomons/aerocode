"use client";
import Container from "@/components/common/Container";
import PrimaryHero from "@/components/layout/PrimaryHero";
import RouteSpecialSection from "@/components/layout/RouteSpecialSection";
import ReasonToVisitCard from "@/components/common/ReasonToVisit";
import InfoCard from "@/components/common/InfoCard";
import RouteCard from "@/components/common/RouteCard";
import { DestinationPage } from "@/graphql/DestinationPageQuery";

interface DestinationTemplateProps {
  initialPage: DestinationPage;
}

export default function DestinationTemplate({
  initialPage,
}: DestinationTemplateProps) {
  return (
    <>
      <PrimaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        widget="stripped"
      />
      <Container>
        <div className="py-12 space-y-16">
          <RouteSpecialSection
            heading={`${initialPage.country} Specials`}
            description="Check out our special fares and promotions for flights to this destination."
          />

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
            )}          {/* Routes Section - Using routes array from the API */}
          {initialPage.routes && initialPage.routes.length > 0 && (
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {initialPage.routes.map((route, index) => (
                  <RouteCard 
                    key={index}
                    origin={route.departureAirport} 
                    destination={route.arrivalAirport} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

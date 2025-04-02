import Container from "@/components/common/Container";
import PrimaryHero from "@/components/layout/PrimaryHero";
import RouteSpecial from "@/components/common/RouteSpecialCard";
import Image from "next/image";
import ReasonToVisitCard from "@/components/common/ReasonToVisit";
export default function Destination() {
  return (
    <>
      <PrimaryHero
        title="Flights to New Zealand"
        image="/hero.jpg"
        widget="stripped"
      />
      <Container>
        <div className="py-12 space-y-16">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                New Zealand Specials
              </h2>
              <span className="block text-center">
                We offer convenient flights between Australia, Fiji, Vanuatu,
                and Honiara, the vibrant capital of the Solomon Islands.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 h-[256px]">
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

          <ReasonToVisitCard
            title="REASON 1 TO VISIT NEW ZEALAND"
            image="/image.jpg"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            imageOnLeft={false}
          />
          <ReasonToVisitCard
            title="REASON 2 TO VISIT NEW ZEALAND"
            image="/image.jpg"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            imageOnLeft={true}
          />

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                New Zealand Travel Requirements
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                Our New Zealand Routes
              </h2>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

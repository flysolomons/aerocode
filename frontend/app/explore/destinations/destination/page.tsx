import Container from "@/components/common/Container";
import PrimaryHero from "@/components/layout/PrimaryHero";
import RouteSpecialSection from "@/components/layout/RouteSpecialSection";
import ReasonToVisitCard from "@/components/common/ReasonToVisit";
import InfoCard from "@/components/common/InfoCard";
import RouteCard from "@/components/common/RouteCard";
import Recommendations from "@/components/layout/Recommendations";

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
          <RouteSpecialSection
            heading="New Zealand Specials"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          />

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
          <ReasonToVisitCard
            title="REASON 3 TO VISIT NEW ZEALAND"
            image="/image.jpg"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
            imageOnLeft={false}
          />

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                New Zealand Travel Requirements
              </h2>

              <span className="block text-center">
                We offer convenient flights between Australia, Fiji, Vanuatu,
                and Honiara, the vibrant capital of the Solomon Islands.
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <InfoCard
                title="Visa"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
              <InfoCard
                title="Passport"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
              <InfoCard
                title="Customs"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                Our New Zealand Routes
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

          <Recommendations />
        </div>
      </Container>
    </>
  );
}

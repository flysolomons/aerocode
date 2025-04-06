import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import Recommendations from "@/components/layout/Recommendations";
import SpecialsCard from "@/components/common/SpecialCard";

export default function Specials() {
  return (
    <>
      <SecondaryHero
        title="Specials"
        image="/hero.jpg"
        breadcrumbs="Home > Explore > Specials"
      />
      <Container>
        <div className="py-12 space-y-16">
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Latest Specials
            </h2>
            {/* Description */}
            <span className="block text-center">
              We offer convenient flights between Australia, Fiji, Vanuatu, and
              Honiara, the vibrant capital of the Solomon Islands.
            </span>
          </div>

          {/* Latest specials options */}
          <div className="grid grid-cols-3 gap-4 h-64">
            <SpecialsCard
              price="$650AUD"
              image="/image.jpg"
              specialName="Early Bird Sale"
            />
            <SpecialsCard
              price="$650AUD"
              image="/image.jpg"
              specialName="Early Bird Sale"
            />
            <SpecialsCard
              price="$650AUD"
              image="/image.jpg"
              specialName="Early Bird Sale"
            />
          </div>

          {/* Recommendations section */}
          <Recommendations />
        </div>
      </Container>
    </>
  );
}

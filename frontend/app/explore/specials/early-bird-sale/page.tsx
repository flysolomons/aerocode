import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import RouteSpecialCard from "@/components/common/RouteSpecialCard";

export default function SpecialInformation() {
  return (
    <>
      <SecondaryHero
        title="Early Bird Sale"
        image="/hero.jpg"
        breadcrumbs="Home > Explore > Specials > Early Bird Sale"
      />
      <Container>
        <div className="py-12 space-y-16">
          {/* Description */}
          <span className="block text-center">
            We offer convenient flights between Australia, Fiji, Vanuatu, and
            Honiara, the vibrant capital of the Solomon Islands. Discover the
            beauty and diversity of the Solomons with our extensive network of
            domestic destinations. Beyond the Pacific, we've partnered with
            leading airlines to expand your travel horizons. Through our
            codeshare and interline agreements, we offer seamless connections to
            a wide range of regional and international destinations, including
            exciting locations in Europe, Asia, and North America.
          </span>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 h-[256px]">
              <RouteSpecialCard
                route="Honiara to Brisbane"
                price="$650AUD"
                image="/image.jpg"
                specialName="Early Bird Sale"
              />
              <RouteSpecialCard
                route="Honiara to Brisbane"
                price="$650AUD"
                image="/image.jpg"
                specialName="Early Bird Sale"
              />
              <RouteSpecialCard
                route="Honiara to Brisbane"
                price="$650AUD"
                image="/image.jpg"
                specialName="Early Bird Sale"
              />
            </div>

            <div className="grid grid-cols-3 gap-4 h-[256px]">
              <RouteSpecialCard
                route="Honiara to Brisbane"
                price="$650AUD"
                image="/image.jpg"
                specialName="Early Bird Sale"
              />
              <RouteSpecialCard
                route="Honiara to Brisbane"
                price="$650AUD"
                image="/image.jpg"
                specialName="Early Bird Sale"
              />
              <RouteSpecialCard
                route="Honiara to Brisbane"
                price="$650AUD"
                image="/image.jpg"
                specialName="Early Bird Sale"
              />
            </div>
          </div>

          <h2 className="text-3xl text-center font-bold text-blue-500">
            Terms & Conditions
          </h2>
        </div>
      </Container>
    </>
  );
}

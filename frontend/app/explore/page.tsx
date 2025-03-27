import SecondaryHero from "../../components/layout/SecondaryHero";
import Container from "../../components/common/Container";
import GenericCard from "@/components/common/GenericCard";
import DestinationCard from "@/components/common/DestinationCard";

export default function Explore() {
  return (
    <>
      <SecondaryHero />
      <Container>
        <div className="py-12 space-y-16">
          <span>
            We offer convenient flights between Australia, Fiji, Vanuatu, and
            Honiara, the vibrant capital of the Solomon Islands. Discover the
            beauty and diversity of the Solomons with our extensive network of
            domestic destinations. Beyond the Pacific, we've partnered with
            leading airlines to expand your travel horizons. Through our
            codeshare and interline agreements, we offer seamless connections to
            a wide range of regional and international destinations, including
            exciting locations in Europe, Asia, and North America.
          </span>

          <div className="grid grid-cols-3 gap-4">
            <GenericCard title="Where We Fly" image="/image.jpg" />
            <GenericCard title="Flight Schedules" image="/image.jpg" />
            <GenericCard title="Our Specials" image="/image.jpg" />
            <GenericCard title="Cargo" image="/image.jpg" />
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Our Destinations
            </h2>

            <div className="grid grid-cols-3 gap-4 h-[400px]">
              <DestinationCard title="Port Vila, Vanuatu" image="/image.jpg" />

              <div className="space-y-4">
                <div className="h-[192px]">
                  <DestinationCard
                    title="Port Vila, Vanuatu"
                    image="/image.jpg"
                  />
                </div>

                <div className="h-[192px]">
                  <DestinationCard
                    title="Port Vila, Vanuatu"
                    image="/image.jpg"
                  />
                </div>
              </div>

              <DestinationCard title="Brisbane, Australia" image="/image.jpg" />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

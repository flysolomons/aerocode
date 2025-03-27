import SecondaryHero from "../../components/layout/SecondaryHero";
import Container from "../../components/common/Container";
import GenericCard from "@/components/common/GenericCard";
import Recommendations from "@/components/layout/Recommendations";

export default function Explore() {
  return (
    <>
      <SecondaryHero
        title="Explore"
        image="./hero.jpg"
        breadcrumbs="Home > Explore"
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

          {/* Explore options */}
          <div className="grid grid-cols-3 gap-4 h-64">
            <GenericCard title="Where We Fly" image="/image.jpg" />
            <GenericCard title="Flight Schedules" image="/image.jpg" />
            <GenericCard title="Our Specials" image="/image.jpg" />
            {/* <GenericCard title="Cargo" image="/image.jpg" /> */}
          </div>

          {/* Recommendations section */}
          <Recommendations />
        </div>
      </Container>
    </>
  );
}

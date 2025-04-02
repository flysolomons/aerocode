import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import GenericCard from "@/components/common/GenericCard";

export default function Destinations() {
  return (
    <>
      <SecondaryHero
        title="Destinations"
        image="/hero.jpg"
        breadcrumbs="Home > Destinations"
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

          {/* Destinations options */}
          <div className="grid grid-cols-3 gap-4">
            <GenericCard title="Solomon Islands" image="/image.jpg" />
            <GenericCard title="Australia" image="/image.jpg" />
            <GenericCard title="New Zealand" image="/image.jpg" />
            <GenericCard title="Vanuatu" image="/image.jpg" />
            <GenericCard title="Fiji" image="/image.jpg" />
            <GenericCard title="Papua New Guinea" image="/image.jpg" />
          </div>
        </div>
      </Container>
    </>
  );
}

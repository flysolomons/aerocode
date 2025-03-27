import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import DestinationRecommendations from "@/components/layout/Recommendations";
import RadioButton from "@/components/common/RadioButton";
import Image from "next/image";

export default function WhereWeFly() {
  return (
    <>
      <SecondaryHero
        title="Where We Fly"
        image="/hero.jpg"
        breadcrumbs="Home > Explore > Where We Fly"
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

          <div className="flex justify-center">
            <RadioButton optionOne="International" optionTwo="Domestic" />
          </div>

          <div className="w-full relative">
            <Image
              src="/image.jpg" // Replace with your image path
              alt="Where We Fly: Interanational"
              width={1128}
              height={770}
              className="rounded-3xl"
            />
          </div>
          {/* Recommendations section */}
          <DestinationRecommendations />
        </div>
      </Container>
    </>
  );
}

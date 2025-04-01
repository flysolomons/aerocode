import Container from "@/components/common/Container";
import PrimaryHero from "@/components/layout/PrimaryHero";
import RouteSpecial from "@/components/common/RouteSpecialCard";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <PrimaryHero title="Connecting the Hapi Isles..." image="./image.jpg" />
      <Container>
        <div className="py-12 space-y-16">
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Our Specials
            </h2>
            <span className="block text-center">
              We offer convenient flights between Australia, Fiji, Vanuatu, and
              Honiara, the vibrant capital of the Solomon Islands.
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 h-[256px]">
            <RouteSpecial
              route="Honiara to Brisbane"
              price="$650AUD"
              image="/image.jpg"
              specialName="Early Bird Sale"
            />
            <RouteSpecial
              route="Honiara to Brisbane"
              price="$650AUD"
              image="/image.jpg"
              specialName="Early Bird Sale"
            />
            <RouteSpecial
              route="Honiara to Brisbane"
              price="$650AUD"
              image="/image.jpg"
              specialName="Early Bird Sale"
            />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Discover New Horizons
            </h2>
            <span className="block text-center">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Join Belama
            </h2>
            <span className="block text-center">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              All You Need
            </h2>
            <span className="block text-center">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>
        </div>
      </Container>
    </>
  );
}

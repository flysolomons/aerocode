import SecondaryHero from "../../components/layout/SecondaryHero";
import Image from "next/image";
import Container from "../../components/common/Container";
import GenericCard from "@/components/common/GenericCard";

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

          <div className="grid grid-cols-3 gap-6">
            <GenericCard title="Where We Fly" image="/image.jpg" />
            <GenericCard title="Flight Schedules" image="/image.jpg" />
            <GenericCard title="Our Specials" image="/image.jpg" />
            <GenericCard title="Cargo" image="/image.jpg" />
          </div>

          {/* our destinations */}
          <div className="space-y-8">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Our Destinations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[400px]">
              <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <Image
                  src="/image.jpg"
                  alt="Port Vila, Vanuatu"
                  width={500}
                  height={400}
                  className="w-full h-full  object-cover"
                />
                <div className="absolute bottom-6 left-6 text-white z-20">
                  <span className="text-xl font-semibold">
                    Port Vila, Vanuatu
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative rounded-3xl overflow-hidden h-[192px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/image.jpg"
                    alt="Port Moresby, Papua New Guinea"
                    width={500}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 text-white z-20">
                    <span className="text-xl font-semibold">
                      Port Moresby, PNG
                    </span>
                  </div>
                </div>
                <div className="relative rounded-3xl overflow-hidden h-[192px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                  <Image
                    src="/image.jpg"
                    alt="Nadi, Fiji"
                    width={500}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-6 text-white z-20">
                    <span className="text-xl font-semibold">Nadi, Fiji</span>
                  </div>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                <Image
                  src="/image.jpg"
                  alt="Brisbane, Australia"
                  width={500}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 text-white z-20">
                  <span className="text-xl font-semibold">
                    Brisbane, Australia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

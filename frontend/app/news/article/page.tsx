import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import Image from "next/image";
import OtherNewsSection from "@/components/layout/OtherNewsSection";

export default function NewsArticle() {
  return (
    <>
      <SecondaryHero
        title=""
        image="/hero.jpg"
        breadcrumbs="Home > News > Article"
      />
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-[65%_35%] space-x-16">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-blue-500 mb-2">
                Solomon Airlines Update on Vanuatu flights due to earthquake
              </h1>
              <div className="text-sm text-gray-500">Dec 18th 2024 9:00am</div>
              <div className="space-y-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum
                </p>
                <p>
                  Solomon Airlines wishes to provide an update on its services
                  to and from Vanuatu, following the latest situational update
                  from Vanuatu stakeholders. The changes will impact scheduled
                  flights today Wednesday 18 December and tomorrow Thursday 19
                  December 2024 at this time.
                </p>

                <div className="w-full relative">
                  <Image
                    src="/image.jpg"
                    alt="Where We Fly: International"
                    width={1000}
                    height={1000}
                    className="w-full h-[400px] rounded-3xl object-cover"
                  />
                </div>
              </div>
            </div>

            <OtherNewsSection />
          </div>
        </div>
      </Container>
    </>
  );
}

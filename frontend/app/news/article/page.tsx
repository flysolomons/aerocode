import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import Image from "next/image";

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
                    width={500}
                    height={500}
                    className="w-full rounded-3xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-blue-500 mb-4">
                In Other News
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="flex items-start relative h-20">
                    <div className="w-20 h-20 absolute overflow-hidden rounded-lg">
                      <Image
                        src="/image.jpg"
                        alt="Holiday Travel"
                        layout="fill"
                        objectFit="fill"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="pl-24">
                      <a
                        href="#"
                        className="text-blue-500 hover:underline font-medium"
                      >
                        Soar Into New Year Savings with our International Sale
                      </a>
                      <div className="text-sm text-gray-500 mt-1">
                        Dec 10th 2024
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

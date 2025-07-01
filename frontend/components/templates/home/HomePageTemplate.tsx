"use client";

import { HomePage, HomePageData } from "@/graphql/HomePageQuery";
import Container from "@/components/layout/Container";
import PrimaryHero from "@/components/layout/hero/PrimaryHero";
import InfoCard from "@/components/ui/cards/InfoCard";
import Image from "next/image";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import Slider from "@/components/layout/Slider";
import EmblaCarousel from "@/components/layout/carousel/Carousel";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
// import InViewWrapper
//  from "@/components/common/InViewWrapper";
import MainCarousel from "@/components/layout/hero/MainCarousel";

interface HomePageTemplateProps {
  initialPage: HomePageData;
}

export default function HomePageTemplate({
  initialPage,
}: HomePageTemplateProps) {
  // Assume only one page is returned
  const homePage = initialPage.pages[0];
  const destinations = initialPage.destinations;
  console.log("Homepage data", homePage);
  return (
    <>
      {/* <MainCarousel /> */}
      <PrimaryHero title={homePage.heroTitle} image={homePage.heroImage.url} />
      <Container>
        <div className="pt-8 md:pt-12 space-y-8 md:space-y-16">
          <RouteSpecialSection
            heading="Flight Specials"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
            specials={homePage.specialRouteItems.map((item) => ({
              special: {
                name: item.specialRoute.special.name,
              },
              route: {
                nameFull: item.specialRoute.route.nameFull,
                heroImage: { url: item.specialRoute.route.heroImage?.url },
              },
              startingPrice: String(item.specialRoute.startingPrice),
            }))}
          />
        </div>
      </Container>
      <div className="min-h-[100vh] md:h-[calc(100vh)] flex items-center justify-center px-4 md:px-0 py-8 md:py-0">
        <div className="space-y-6 md:space-y-8 w-full max-w-none md:max-w-[85%]">
          <div className="space-y-2">
            {/* <InViewWrapper
              className="animate__animated animate__fadeInUp"> */}
            <h2 className="discover-title text-2xl md:text-3xl text-center font-bold text-blue-500">
              Discover New Horizons
            </h2>

            <span className="block text-center text-sm md:text-base px-4 md:px-0">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>

            {/* </InViewWrapper> */}
          </div>
          {/* <InViewWrapper className="animate__animated animate__fadeInUp "> */}
          <div className="h-auto">
            {/* <Slider /> */}
            <EmblaCarousel
              slides={destinations.map((dest) => ({
                imageUrl: dest.heroImage.url,
                country: dest.country,
                subtitle: dest.subTitle,
                url: dest.url,
              }))}
            />
          </div>
          {/* </InViewWrapper> */}
          {/* <InViewWrapper
              className="animate__animated animate__fadeInUp"> */}
          {/* <div className="flex justify-center">
            <PrimaryButton text="Explore" />
          </div> */}
          {/* </InViewWrapper> */}
        </div>
      </div>
      {/* <InViewWrapper  className="animate__animated animate__fadeInUp"> */}
      <div
        className="min-h-screen md:h-screen space-y-8 md:space-y-16 bg-cover bg-center bg-no-repeat pt-8 md:pt-1 pb-8 md:pb-2 bg-blue-700 bg-opacity-80 bg-blend-overlay sm:bg-blend-overlay md:bg-blend-soft-light flex items-center justify-center px-4 md:px-0"
        style={{
          backgroundImage: `url(${homePage.belamaImage.url})`,
        }}
      >
        <div className="space-y-6 md:space-y-8 w-full max-w-4xl">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl text-center font-bold text-white pt-2">
              Belama
            </h2>
            <span className="block text-center text-white text-sm md:text-base px-4 md:px-0">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>
          <div className="flex justify-center">
            <PrimaryButton href="/belama" text="Join Now" />
          </div>
          {/*<div className="relative w-full h-[30rem] mb-6">
            <Image
              src="/image.jpg"
              alt="Belama welcome area with tropical scene and refreshments"
              width={1000}
              height={300}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>*/}
        </div>
      </div>
      {/* </InViewWrapper> */}
      {/* <InViewWrapper  className="animate__animated animate__fadeInUp bg-[url('/traditional_ring.png')] bg-no-repeat bg-opacity-50 bg-cover"> */}
      <div className="bg-[url('/traditional_ring.png')] bg-no-repeat bg-opacity-50 bg-cover">
        <Container>
          <div className="min-h-screen md:h-screen flex items-center justify-center py-8 md:py-0">
            <div className="space-y-8 md:space-y-12 w-full">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl text-center font-bold text-blue-500">
                  All You Need
                </h2>
                <span className="block text-center text-sm md:text-base px-4 md:px-0">
                  Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-slate-500 px-4 md:px-0">
                {homePage.allYouNeedItems.map((item, idx) => (
                  <InfoCard
                    key={idx}
                    title={item.pageHeroTitle}
                    description={item.pageDescription}
                    svg={
                      item.pageSvgIcon && item.pageSvgIcon.url
                        ? item.pageSvgIcon.url
                        : undefined
                    }
                    url={item.pageUrl}
                  />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* </InViewWrapper> */}
    </>
  );
}
